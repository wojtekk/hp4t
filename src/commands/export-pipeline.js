const heroin = require('heroin-js');

function checkConditions() {
  return false;
}

module.exports = (opts) => {
  const options = opts.options;
  const logger = opts.logger;

  function getHerokuApiKey() {
    return options.key;
  }

  function getPipelineName() {
    return options.pipeline;
  }

  function execute() {
    logger.info('Export Heroku pipeline configuration');

    const herokuApiKey = getHerokuApiKey();
    const pipelineName = getPipelineName();
    const heroku = heroin(herokuApiKey, { debug: false, logLevel: 'NONE' });

    return heroku.pipeline(pipelineName)
      .then(result => {
        logger.log('Pipeline configuration:\n', result);

        return true;
      });
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
