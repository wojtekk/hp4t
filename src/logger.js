const chalk = require('chalk');

const appName = 'HP4T';

function prepare(prefix, params, color = null) {
  return [color ? chalk.styles[color].open : '', prefix]
    .concat(params, [color ? chalk.styles[color].close : '']);
}

module.exports = (opts) => {
  const verbose = opts.verbose || false;

  function debug(...params) {
    if (verbose) {
      console.info(...prepare(`${appName}: [Debug]`, params, 'blue'));
    }
  }

  function info(...params) {
    console.info(...prepare(`${appName}:`, params));
  }

  function warn(...params) {
    console.warn(...prepare(`${appName}:`, params, 'yellow'));
  }

  function error(...params) {
    console.error(...prepare(`${appName}:`, params, 'red'));
  }

  function log(...params) {
    console.log(...prepare(`${appName}:`, params));
  }

  return {
    debug,
    info,
    warn,
    error,
    log,
  };
};
