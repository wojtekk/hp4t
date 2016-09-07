const shell = require('shelljs');

function checkConditions() {
  return true;
}

module.exports = (opts) => {
  const config = opts.config;
  const environment = opts.environment;
  const logger = opts.logger;

  function getAppName() {
    return config.get(environment, 'app');
  }

  function execute() {
    logger.info('Promote Heroku application');

    const appName = getAppName();

    return shell.exec(`heroku pipelines:promote --app ${appName}`).code === 0;
  }

  const exports = {
    checkConditions,
    execute,
  };

  return exports;
};
