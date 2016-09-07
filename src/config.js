const yaml = require('js-yaml');
const fs = require('fs');

function getConfig(file) {
  try {
    if (!fs.existsSync(file)) {
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
  const config = getConfig(opts.file);

  function getInfrastructureDir() {
    return config.infrastructure.dir || 'infrastructure/';
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
  };

  return exports;
}
