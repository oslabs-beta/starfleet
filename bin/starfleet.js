#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs')

// Metadata
const { version } = require('../package.json');
const { description } = require('../package.json');

// Subcommands
const createGQL = require('./createGQL');
const createDockerfile = require('./createDockerfile');

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
    // creates new src folder
    const srcText = `graphqlsrc`
    shell.mkdir(srcText);

    // creates file structure in the new src folder
    const text = ['data', 'models', 'resolvers', 'typeDefs'];
    text.forEach(element => {
        let filepath = `${process.cwd()}/graphqlsrc/${element}`
        shell.mkdir(filepath);
    })

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
