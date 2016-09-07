function checkConditions() {
  return true;
}

module.exports = (opts) => {
  function execute() {
    console.log('Provision pipeline');
    return true;
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
