const shell = require('shelljs');

function checkConditions() {
  return true;
}

module.exports = (opts) => {
  const engine = opts.engine;
  const options = opts.options;
  const config = opts.config;
  const hp4tDir = opts.hp4tDir;
  const projectDir = opts.projectDir;
  const logger = opts.logger;
  const environment = opts.environment;

  function getCommand() {
    return options.command;
  }

  function getAppName() {
    return config.get(environment, 'app');
  }

  function execute() {
    console.log('Run command on Heroku application');

    const appName = getAppName();
    const remoteCommand = getCommand();
    const command = `heroku run "${remoteCommand}" --exit-code --app ${appName}`;

    logger.debug(command);

    return shell.exec(command).code === 0;
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
