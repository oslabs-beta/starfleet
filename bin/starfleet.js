#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');

// Metadata
const { version } = require('../package.json');
const { description } = require('../package.json');

// Subcommands
const createGQL = require('./createGQL');
const createDockerfile = require('./createDockerfile');
const createFileStructure = require('./createFileStructure');

// Temp
const Book = require('../models/Book');

// inqurier
const inqurier = require('./inquirer')

program
  .version(version)
  .description(description)

// starfleet init
// add creating folder structure before parsing
program
  .command('init')
  .alias('i')
  .description('Initializing GraphQL services')
  .action(file => {
    createFileStructure();

    // change this to be user inputted; with default being models
	const workdir = 'models';

    // reads each file in the provided workdir, grabs the name of the file and the model from the file and runs it through createGQL
	fs.readdirSync('./' + workdir).forEach(file => {
	  const filename = path.parse(file).name;
	  const model = require('../' + workdir + '/' + file);
	  createGQL(model, filename);
	});
  });

program
  .command('deploy')
  .alias('d')
  .description('Deploy newly created microservices')
  .action( () => {
	createDockerfile();
  });


program.parse(process.argv);
