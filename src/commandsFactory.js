module.exports = (opts) => {
  const engine = opts.engine;
  const options = opts.options;
  const config = opts.config;
  const hp4tDir = opts.hp4tDir;
  const projectDir = opts.projectDir;
  const logger = opts.logger;
  const environment = opts.environment;

  function getCommand(name) {
    // eslint-disable-next-line global-require
    return require(`./commands/${name}`)({
      engine,
      options,
      config,
      hp4tDir,
      projectDir,
      logger,
      environment,
    });
  }

  return {
    getCommand,
  };
};
