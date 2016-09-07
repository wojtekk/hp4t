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

  function getAppName() {
    return config.get(environment, 'app');
  }

  function execute() {
    console.log('Promote Heroku application');

    const appName = getAppName();

    return shell.exec(`heroku pipelines:promote --app ${appName}`).code === 0;
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
