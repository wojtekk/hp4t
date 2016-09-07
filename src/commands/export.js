function checkConditions() {
  return false;
}

module.exports = (opts) => {
  function execute() {
    console.log('Export');
    return true;
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
