const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

function checkConditions() {
  return false;
}

module.exports = (opts) => {
  const options = opts.options;
  const hp4tDir = opts.hp4tDir;
  const projectDir = opts.projectDir;
  const logger = opts.logger;

  const language = options.language;

  function backupExistingFiles() {
    shell.ls('-RA', `${hp4tDir}/src/templates/${language}/`).forEach(file => {
      if (fs.existsSync(`${projectDir}/${file}`)) {
        logger.info(`Move file: ${file} => ${file}.old`);
        shell.mv(`${projectDir}/${file}`, `${projectDir}/${file}.old`); //FIXME
      }
    });
  }

  function copyTemplateFiles() {
    const templateDir = `${hp4tDir}/src/templates/${language}/`;
    shell.ls('-RA', templateDir).forEach(file => {
      if( fs.statSync(`${templateDir}/${file}`).isDirectory() ) {
        logger.debug(`Create directory: ${file}`);
        shell.mkdir(`${projectDir}/${file}`);
      } else {
        logger.info(`Copy file: ${path.relative(projectDir, `${templateDir}/${file}`)} => ${file}`);
        shell.cp(`${templateDir}/${file}`, `${projectDir}/${file}`);
      }
    });
  }

  function execute() {
    logger.info('Initialize ${language} project ...');

    backupExistingFiles();
    copyTemplateFiles();

    logger.info('Projtect initialized.');

    return true;
  }

  const exports = {
    checkConditions,
    execute,
  }

  return exports;
}
