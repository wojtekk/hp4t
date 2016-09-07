function getConfiguration(opts) {
  const configuration = {
    name: 'hp4t-test',
    apps: {
      staging: 'hp4t-test-stage',
      production: 'hp4t-test',
    }
  };

  return configuration;
}

module.exports = getConfiguration;
