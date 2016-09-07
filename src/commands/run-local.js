const shell = require('shelljs');

function checkConditions() {
  return true;
}

module.exports = (opts) => {
  const options = opts.options;

  function getCommand() {
    return options.command;
  }

  function execute() {
    console.log('Run local command');

    const command = getCommand();

    shell.exec(command)

    return true;
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
