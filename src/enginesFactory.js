function getEngine() {
  if (process.env.TRAVIS === 'true') {
    /* eslint-disable-next-line global-require */
    return require('./engines/travisCi')();
  } else {
    return null;
  }
}
module.exports = () => {
  const exports = { getEngine };
  return exports;
}
