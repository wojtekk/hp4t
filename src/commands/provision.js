const heroin = require('heroin-js');

function checkConditions() {
  return true;
}

module.exports = (opts) => {
  const config = opts.config;
  const projectDir = opts.projectDir;
  const logger = opts.logger;
  const environment = opts.environment;

  function getHerokuApiKey() {
    return process.env.HEROKU_API_KEY;
  }

  function getConfigFileName() {
    const configFile = config.get(environment, 'config', environment);
    return `${projectDir}/${config.getInfrastructureDir()}/${configFile}`;
  }

  function getConfig() {
    const opts = {
      app: config.get(environment, 'app'),
      environment,
    };
    logger.debug('Application configuration options:\n', opts);

    /* eslint-disable-next-line global-require */
    const configuration = require(getConfigFileName())(opts);
    logger.debug('Application configuration:\n', configuration);

    return configuration;
  }

  function execute() {
    logger.info('Provision Heroku application');

    const configuration = getConfig();

    const herokuApiKey = getHerokuApiKey();
    const heroku = heroin(herokuApiKey, { debug: false, logLevel: 'NONE' });

    return heroku(configuration)
      .then(res => true);
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
