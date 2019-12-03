#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const path = require('path');

// Metadata
const { version } = require('../package.json');
const { description } = require('../package.json');

// Subcommands
const createGQL = require('./createGQL');

// Temp
const Book = require('../models/Book');

program
  .version(version)
  .description(description)

// starfleet init
// add creating folder structure before parsing
program
  .command('initialize')
  .alias('init')
  .description('Initializing GraphQL services')
  .action(file => {

    // change this to be user inputted; with default being models
	const workdir = 'models';

	fs.readdirSync('./' + workdir).forEach(file => {
	  const filename = path.parse(file).name;
	  const model = require('../' + workdir + '/' + file);
	  createGQL(model, filename);
	});
  });

// starfleet deploy (flags)
program
    .command('deploy')
    .option('--d, --deploy <type>', 'specify where to deploy', 'docker')
    .action()


program.parse(process.argv);
