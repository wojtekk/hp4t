function getConfiguration() {
  const configuration = {
    name: 'pipeline-name',
    apps: {
      staging: 'app-name-stage',
      production: 'app-name',
    },
  };

  return configuration;
}

module.exports = getConfiguration;
