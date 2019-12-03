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

// inqurier
const inqurier = require('./inquirer')

program
  .version(version)
  .description(description)

program
  .command('initialize')
  .alias('init')
  .description('Initializing GraphQL services')
  .action( file => {

  inqurier()
  
	const workdir = 'models';

	fs.readdirSync('./'+workdir).forEach( file => {
	  const filename = path.parse(file).name;
	  const model = require('../'+workdir+'/'+file);
	  createGQL(model, filename);
	});
  });


program.parse(process.argv);
