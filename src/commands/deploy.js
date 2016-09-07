function checkConditions() {
  return true;
}

module.exports = (opts) => {
  function execute() {
    console.log('Deploy');
    return true;
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
