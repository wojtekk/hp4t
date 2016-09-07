const shell = require('shelljs');

function checkConditions() {
  return true;
}

module.exports = (opts) => {
  const options = opts.options;
  const logger = opts.logger;

  function getCommand() {
    return options.command;
  }

  function execute() {
    logger.info('Run local command');

    const command = getCommand();

    logger.debug(command);

    return shell.exec(command).code === 0;
  }

  const exports = {
    checkConditions,
    execute,
  };

  return exports;
};
