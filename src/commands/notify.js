function checkConditions() {
  return true;
}

module.exports = (opts) => {
  function execute() {
    console.log('Notify');
    return true;
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
