function checkConditions() {
  return true;
}

module.exports = (opts) => {
  function execute() {
    console.log('Pipeline');
    return true;
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
