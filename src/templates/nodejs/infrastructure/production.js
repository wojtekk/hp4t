const _ = require('lodash');

function getConfiguration(opts) {
  /* eslint-disable-next-line global-require */
  const baseConfig = require('./base')(opts);

  const config = {
    name: opts.app,
    addons: {},
    config_vars: {},
    domains: [
      `${opts.app}.herokuapp.com`,
    ],
    formation: [
      {
        process: 'web',
        quantity: 1,
        size: 'Hobby',
      },
    ],
  };

  const configuration = _.merge({}, baseConfig, config);

  return configuration;
}

module.exports = getConfiguration;
