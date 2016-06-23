const commandLineArgs = require('command-line-args');

const branchCondition = require('conditions/branch');
const tagsCondition = require('conditions/tags');
const slubCondition = require('conditions/slug');

const optionDefinitions = [
  { name: "command", type: String, defaultOption: true, defaultValue: "help" },
  { name: 'branch', alias: 'b', type: String },
  { name: 'tags', alias: 't', type: Boolean },
  { name: 'slug', alias: 's', type: String },
];

const options = commandLineArgs(optionDefinitions);


