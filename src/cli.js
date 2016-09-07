const yargs = require('yargs');
const enginesFactory = require('./enginesFactory')();
const pullRequestConditionFactory = require('./conditions/pullRequest');
const slugConditionFactory = require('./conditions/slug');
const branchConditionFactory = require('./conditions/branch');
const tagsConditionFactory = require('./conditions/tags');
const loggerFactory = require('./logger');
const path = require('path');
const fs = require('fs');

const defaultOptions = {
  branch: {
    alias: 'b',
    describe: 'Execute command on branch',
    type: 'string',
  },
  tags: {
    alias: 't',
    describe: 'Execute command on tags',
    type: 'boolean',
  },
  slug: {
    alias: 's',
    describe: 'Execute command on repository slug',
    type: 'string',
  },
  verbose: {
    alias: 'v',
    describe: 'Verbose mode',
    type: 'boolean',
  },
};

const consoleArguments = yargs
  .usage('Usage: hp4t <cmd> [args]')
  .command('init [language]', 'Initialize project', {
    language: {
      alias: 'l',
      describe: 'Main language used in the project',
      type: 'string',
      default: 'nodejs',
      choices: ['php', 'nodejs'],
    },
    verbose: defaultOptions.verbose,
  })
  .command('export <application>', 'Export Heroku application configuration', {
    key: {
      alias: 'k',
      describe: 'Heroku API key',
      type: 'string',
      required: true,
    },
    verbose: defaultOptions.verbose,
  })
  .command('export-pipeline <pipeline>', 'Export Heroku pipeline configuration', {
    key: {
      alias: 'k',
      describe: 'Heroku API key',
      type: 'string',
      required: true,
    },
    verbose: defaultOptions.verbose,
  })
  .command('provision <environment> [args]', 'Configure Heroku application', defaultOptions)
  .command('provision-pipeline [pipeline] [args]', 'Configure Heroku pipelines', Object.assign({},
    {
      pipeline: {
        alias: 'p',
        describe: 'Pipeline file name',
        type: 'string',
        default: 'pipeline',
      },
    },
    defaultOptions
  ))
  .command('deploy <environment> [args]', 'Deploy application', defaultOptions)
  .command('promote <environment> [args]', 'Promote application to next environment', defaultOptions)
  .command('run-remote <environment> <command> [args]', 'Run command on Heroku', defaultOptions)
  .command('run-local <environment> <command> [args]', 'Run command locally', defaultOptions)
  .command('notify-rollbar', 'Notify Rollbar about deployment', { verbose: defaultOptions.verbose })
  .strict()
  .help();

const options = consoleArguments.argv;

if (options._[0] === undefined) {
  consoleArguments.showHelp();
  process.exit(1);
}

const logger = loggerFactory({ verbose: options.verbose || false })

logger.debug('Verbose mode');

const hp4tDir = path.resolve(`${__dirname}/../`);
const projectDir = process.cwd();

logger.debug('HP4T directory:', hp4tDir);
logger.debug('Project directory:', projectDir);

logger.debug('Options:', options);

const environment = options.environment || null;
logger.debug('Environment name:', environment);

const configFile = `${projectDir}/.hp4t.yml`;
const config = require('./config')({ file: configFile, logger });

const commandName = options._[0];
logger.debug('Command name:', commandName);

const engine = enginesFactory.getEngine();

const commandsFactory = require('./commandsFactory')({
  config,
  options,
  engine,
  hp4tDir,
  projectDir,
  logger,
  environment,
});
const command = commandsFactory.getCommand(commandName);

if (!command || !command.checkConditions) {
  logger.error('Unknown or broken command');
  process.exit(1);
}

if (command.checkConditions()) {
  if (!config.environmentExists(environment)) {
    logger.error('Unknown environment');
    process.exit(2);
  }

  const expectedSlug = options.slug || config.get(environment, 'slug');
  const expectedBranch = options.branch || config.get(environment, 'branch');
  const expectedTags = options.tags || config.get(environment, 'tags');

  const pullRequestCondition = pullRequestConditionFactory();
  const slugCondition = slugConditionFactory({ expectedSlug });
  const branchCondition = branchConditionFactory({ expectedBranch });
  const tagsCondition = tagsConditionFactory({ expectedTags });

  if (!engine) {
    logger.error('Unknown CI/CD tool');
    process.exit(2);
  } else if (!pullRequestCondition.check(engine.isPullRequest()) || !slugCondition.check(engine.getSlug()) || !branchCondition.check(engine.getBranch()) || !tagsCondition.check(engine.isTag())) {
    logger.info('Command skipped - conditions are not met');
    process.exit(0);
  }
}

try {
  const result = command.execute();

  if (result instanceof Promise ||
    typeof result.then === 'function') {
    logger.debug('Command return Promise, waiting ...');
    result
      .catch(err => {
        logger.error('Unexpected exception', err);
        process.exit(4);
      })
      .then(() => {
        logger.info('Command executed successfully');
        process.exit(0);
      });
  } else {
    if (!result) {
      logger.error('Error during command execution');
      process.exit(3);
    } else {
      process.exit(0);
    }
  }
} catch (err) {
  logger.error('Unexpected exception', err);
  process.exit(4);
}
