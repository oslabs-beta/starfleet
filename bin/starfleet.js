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

// Temp
const Book = require('../models/Book');

// inqurier
const inquirer = require("inquirer");

program
  .version(version)
  .description(description)

program
  .command('init')
  .alias('i')
  .description('Initializing GraphQL services')
  .action(file => {  
    const questions = [
      {
          name: "USERINPUT",
          message: "Please enter the name of the folder where your schema is in:",
          type: "input",
          default: "models"
      }
    ];

    inquirer.prompt(questions)
    .then(answers => {
      const workdir = `${answers.USERINPUT}`

      fs.readdirSync('./'+workdir).forEach( file => {
        const filename = path.parse(file).name;
        const model = require('../'+workdir+'/'+file);
        createGQL(model, filename);
      });
    })
  });

program
  .command('deploy')
  .alias('d')
  .description('Deploy newly created microservices')
  .action( () => {
	  createDockerfile();
  });


  program.parse(process.argv);
