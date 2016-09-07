function checkConditions() {
  return true;
}

module.exports = (opts) => {
  function execute() {
    console.log('Local');
    return true;
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
