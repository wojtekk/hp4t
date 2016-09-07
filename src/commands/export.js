const heroin = require('heroin-js');

function checkConditions() {
  return false;
}

module.exports = (opts) => {
  const options = opts.options;
  const logger = opts.logger;

  function getHerokuApiKey() {
    return options.key;
  }

  function getAppName() {
    return options.application;
  }

  function execute() {
    logger.info('Export Heroku application configuration');

    const herokuApiKey = getHerokuApiKey();
    const appName = getAppName();
    const heroku = heroin(herokuApiKey, { debug: false, logLevel: 'NONE' });

    return heroku.export(appName)
      .then(result => {
        logger.log('Application configuration:\n', result);

        return true;
      });
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
