const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

function checkConditions() {
  return true;
}

module.exports = (opts) => {
  const engine = opts.engine;
  const config = opts.config;
  const logger = opts.logger;
  const environment = opts.environment;

  function getHerokuApiKey() {
    return process.env.HEROKU_API_KEY;
  }

  function getAppName() {
    return config.get(environment, 'app');
  }

  function getBranch() {
    return engine.getBranch();
  }

  function setup() {
    const herokuApiKey = getHerokuApiKey();
    const content = `machine git.heroku.com\n  login git\n  password ${herokuApiKey}`;
    const dotNetrcFile = path.resolve(`${process.env.HOME}/.netrc`);
    fs.writeFileSync(dotNetrcFile, content);
  }

  function addRemote() {
    const appName = getAppName();

    return shell.exec(`heroku git:remote --app ${appName}`).code === 0;
  }

  function push() {
    const branch = getBranch();
    const command = `git push -u heroku ${branch}:master`;
    logger.debug(command);
    return shell.exec(command).code === 0;
  }

  function execute() {
    logger.info('Deploy application to Heroku');

    setup();
    if (!addRemote()) {
      logger.debug('Error during adding Heroku remote');
      return false;
    }

    if (!addRemote()) {
      logger.debug('Error during adding Heroku remote');
      return false;
    }

    if (!push()) {
      logger.debug('Error during pushing code to Heroku');
      return false;
    }

    return true;
  }

  const exports = {
    checkConditions,
    execute,
  };

  return exports;
};
