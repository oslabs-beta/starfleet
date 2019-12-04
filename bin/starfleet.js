#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');

// Metadata
const { version } = require('../package.json');
const { description } = require('../package.json');

// Subcommands
const createGQL = require('./createGQL');
const graphqlObj = require('./graphqlObj');
const createDockerfile = require('./createDockerfile');
const createFileStructure = require('./createFileStructure');
const chalk = require("chalk"); //terminal string styling done right

// Temp
const Book = require('../models/Book');

// inqurier
const inquirer = require("inquirer");

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
    
    const srcPath = path.resolve(__dirname, '../graphqlsrc') 
    
    if(!fs.existsSync(srcPath)) {
      createFileStructure();
    } else {
      console.log('GraphQL structure already exists. Skipping...')
    }

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
        graphqlObj(model, filename);
      });
    })
  })

program
  .command('deploy')
  .alias('d')
  .description('Deploy newly created microservices')
  .action(() => {
	  createDockerfile();
  });


program.parse(process.argv);