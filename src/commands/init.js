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
  const templatesDir = `${hp4tDir}/src/templates`;
  const languageTemplatesDir = `${templatesDir}/${language}`;

  function backupExistingFiles() {
    shell.ls('-RA', `${hp4tDir}/src/templates/${language}/`).forEach(file => {
      if (fs.existsSync(`${projectDir}/${file}`)) {
        logger.info(`Move file: ${file} => ${file}.old`);
        shell.mv(`${projectDir}/${file}`, `${projectDir}/${file}.old`);
      }
    });
  }

  function copyTemplateFiles() {
    shell.ls('-RA', languageTemplatesDir).forEach(file => {
      if (fs.statSync(`${languageTemplatesDir}/${file}`).isDirectory()) {
        logger.debug(`Create directory: ${file}`);
        shell.mkdir(`${projectDir}/${file}`);
      } else {
        logger.info(`Copy file: ${path.relative(projectDir,
          `${languageTemplatesDir}/${file}`)} => ${file}`);
        shell.cp(`${languageTemplatesDir}/${file}`, `${projectDir}/${file}`);
      }
    });
  }

  function installLodash() {
    if (!fs.existsSync(`${projectDir}/package.json`)) {
      shell.cp(`${templatesDir}/package.json`, `${projectDir}/`);
    }
    logger.info('Installing lodash ...');
    shell.exec('npm i lodash --save');
  }

  function execute() {
    logger.info(`Initialize ${language} project ...`);

    backupExistingFiles();
    copyTemplateFiles();
    installLodash();

    logger.info('Project initialized.');

    return true;
  }

  const exports = {
    checkConditions,
    execute,
  };

  return exports;
};
