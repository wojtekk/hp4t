const shell = require('shelljs');

function checkConditions() {
  return true;
}

module.exports = (opts) => {
  const options = opts.options;
  const config = opts.config;
  const logger = opts.logger;
  const environment = opts.environment;

  function getCommand() {
    return options.command;
  }

  function getAppName() {
    return config.get(environment, 'app');
  }

  function execute() {
    logger.info('Run command on Heroku application');

    const appName = getAppName();
    const remoteCommand = getCommand();
    const command = `heroku run "${remoteCommand}" --exit-code --app ${appName}`;

    logger.debug(command);

    return shell.exec(command).code === 0;
  }

  const exports = {
    checkConditions,
    execute,
  };

  return exports;
};
