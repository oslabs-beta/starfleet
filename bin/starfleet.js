#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

// Metadata
const { version } = require('../package.json');
const { description } = require('../package.json');

// Subcommands
const createGQL = require('./createGQL');
const createFileStructure = require('./createFileStructure');
const createDockerfile = require('./createDockerfile');
const createDockerCompose= require('./createDockerCompose');

// Temp
const Book = require('../models/Book');

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
	const prompts = [
		{
			  name: 'PROJECTNAME',
			  message: 'Please enter a name for your project: ',
			  type: 'input',
			  default: 'gql-project'
			},
		{
			  name: 'PORT',
			  message: 'Please specify a port (press ENTER to accept default port 4000): ',
			  type: 'number',
			  default: 4000
			}
	]

	inquirer.prompt(prompts)
	  .then( async answers => {
 		await createDockerfile(answers.PROJECTNAME, answers.PORT);
		await createDockerCompose(answers.PROJECTNAME, answers.PORT);
	  });
  });


program.parse(process.argv);
