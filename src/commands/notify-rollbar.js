const shell = require('shelljs');

function checkConditions() {
  return false;
}

module.exports = (opts) => {
  const logger = opts.logger;

  function execute() {
    logger.info('Notify rollbar about deployment');

    const rollbarDeployKey = process.env.ROLLBAR_DEPLOY_KEY;
    const revision = process.env.TRAVIS_COMMIT;
    const commitRange = process.env.TRAVIS_COMMIT_RANGE;
    const author = shell.exec('git --no-pager show -s --format="%an"');
    const description = shell.exec(`git log --format=%B ${commitRange}`);

    const command = 'curl --data ' +
      `"access_token=${rollbarDeployKey}&environment=production&revision=${revision}" ` +
      `--data-urlencode "comment=${description}" --data-urlencode "local_username=${author}" ` +
      'https://api.rollbar.com/api/1/deploy/';
    logger.debug(command);

    return shell.exec(command).code === 0;
  }

  const exports = {
    checkConditions,
    execute,
  };

  return exports;
};
