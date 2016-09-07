const yaml = require('js-yaml');
const fs = require('fs');

function getConfig(file) {
  try {
    if (fs.existsSync(file)) {
      return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
    }
    else {
      return {};
    }
  } catch (e) {
    console.log(e);
    return {};
  }
}

module.exports = (opts) => {
  const logger = opts.logger;
  const config = getConfig(opts.file);

  logger.debug('Configuration:\n', config);

  function getInfrastructureDir() {
    if (config.infrastructure && config.infrastructure.dir) {
      return config.infrastructure.dir;
    } else {
      return 'infrastructure/';
    }
  }

  function environmentExists(name) {
    return name in config.environments;
  }

  function getEnvironmentConfiguration(environment) {
    return config.environments[environment] || {};
  }

  function getDefaultEnvironmentConfiguration() {
    return getEnvironmentConfiguration('default');
  }

  function get(environment, property, defaultValue) {
    if (!environment || !property) {
      return null;
    }
    const envConfig = getEnvironmentConfiguration(environment);
    const defaultConfig = getDefaultEnvironmentConfiguration();

    return envConfig[property] || defaultConfig[property] || defaultValue;
  }

  const exports = {
    get,
    getInfrastructureDir,
    environmentExists,
  };

  return exports;
}
