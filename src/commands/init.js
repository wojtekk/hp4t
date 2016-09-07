function checkConditions() {
  return false;
}

module.exports = (opts) => {
  function execute() {
    console.log('Init');
    return true;
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
