const heroin = require('heroin-js');

function checkConditions() {
  return true;
}

module.exports = (opts) => {
  const options = opts.options;
  const config = opts.config;
  const projectDir = opts.projectDir;
  const logger = opts.logger;

  function getHerokuApiKey() {
    return process.env.HEROKU_API_KEY;
  }

  function getConfigFileName() {
    return `${projectDir}/${config.getInfrastructureDir()}/${options.pipeline}`;
  }

  function getConfig() {
    // eslint-disable-next-line global-require
    return require(getConfigFileName())();
  }

  function execute() {
    logger.info('Provision Heroku pipeline');

    const configuration = getConfig();

    const herokuApiKey = getHerokuApiKey();
    const heroku = heroin(herokuApiKey, { debug: false, logLevel: 'NONE' });

    return heroku.pipeline(configuration)
      .then(() => true);
  }

  const exports = {
    checkConditions,
    execute,
  };

  return exports;
};
