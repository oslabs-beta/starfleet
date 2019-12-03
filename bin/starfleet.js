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

// starfleet deploy (flags)
// program
//     .command('deploy')
//     .option('-d, --deploy <type>', 'where to deploy', 'docker')
//     .action( () => {
//         console.log('hello');
//     })


program.parse(process.argv);
