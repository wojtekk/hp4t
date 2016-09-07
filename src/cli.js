const yargs = require('yargs');
const enginesFactory = require('./enginesFactory')();
const commandFactory = require('./commandsFactory')();
const pullRequestConditionFactory = require('./conditions/pullRequest');
const slugConditionFactory = require('./conditions/slug');
const branchConditionFactory = require('./conditions/branch');
const tagsConditionFactory = require('./conditions/tags');
const loggerFactory = require('./logger');


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

const options = yargs
  .usage('Usage: hp4t <cmd> [args]')
  .command('init [language]', 'Initialize project', {
    language: {
      alias: 'l',
      describe: 'Main language used in the project',
      type: 'string',
      default: 'nodejs',
      choices: ['php', 'nodejs'],
    },
    verbose: {
      alias: 'v',
      describe: 'Verbose mode',
      type: 'boolean',
    }
  })
  .command('export <environment>', 'Export Heroku configuration', {
    verbose: {
      alias: 'v',
      describe: 'Verbose mode',
      type: 'boolean',
    }
  })
  .command('provision <environment> [args]', 'Configure Heroku application', defaultOptions)
  .command('provision-pipeline [args]', 'Configure Heroku pipelines', defaultOptions)
  .command('deploy <environment> [args]', 'Deploy application', defaultOptions)
  .command('promote <environment> [args]', 'Promote application to next environment', defaultOptions)
  .command('run-remote <environment> <command> [args]', 'Run command on Heroku', defaultOptions)
  .command('run-local <environment> <command> [args]', 'Run command locally', defaultOptions)
  .strict()
  .help()
  .argv;

const logger = loggerFactory({ verbose: options.verbose || false })

logger.debug('Verbose mode');
logger.debug('Runned with options:', options);

const environmentName = options.environment || null;
logger.debug('Environment name:', environmentName);

const configFile = '.hp4t.yaml';
const config = require('./config')({ file: configFile });

const commandName = options._[0];
logger.debug('Command name:', commandName);

const command = commandFactory.getCommand(commandName);

if (!command || !command.checkConditions) {
  logger.error('Unknown or broken command');
  process.exit(1);
}

if (command.checkConditions()) {
  const expectedSlug = options.slug || config.get(environmentName, 'slug');
  const expectedBranch = options.branch || config.get(environmentName, 'branch');
  const expectedTags = options.tags || config.get(environmentName, 'tags');

  const pullRequestCondition = pullRequestConditionFactory();
  const slugCondition = slugConditionFactory({ expectedSlug });
  const branchCondition = branchConditionFactory({ expectedBranch });
  const tagsCondition = tagsConditionFactory({ expectedTags });

  const engine = enginesFactory.getEngine();

  if (!engine) {
    logger.error('Unknown CI/CD tool');
    process.exit(2);
  } else if (!pullRequestCondition.check(engine.isPullRequest()) || !slugCondition.check(engine.getSlug()) || !branchCondition.check(engine.getBranch()) || !tagsCondition.check(engine.isTag())) {
    logger.info('Command skipped - conditions are not met');
    process.exit(0);
  }
}

try {
  const result = command.execute({ config, options });
  if (!result) {
    logger.error('Unknown error during command execution');
    process.exit(3);
  } else {
    process.exit(0);
  }
} catch (e) {
  logger.error('Unexpected exception', e);
  process.exit(4);
}

