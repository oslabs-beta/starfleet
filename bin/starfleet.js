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

program
  .version(version)
  .description(description)

// cli command: "starfleet init" or "starfleet i"
program
  .command('init')
  .alias('i')
  .description('Initializing GraphQL services')
  .action(file => {
    
    const srcPath = path.resolve(__dirname, '../graphqlsrc') 
    console.log(srcPath)
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
      });
    })
  })

program
  .command('deploy')
  .alias('d')
  .description('Deploy newly created microservices')
  .option("-d, --docker", "deploy to docker")
  .option("-l, --lambda", "deploy to lambda")
  .action( () => {
    const env = process.argv[3].toLowerCase() || 'docker';
    if (env === 'docker' || env === '-d') {
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
    }
    else if (env === 'lambda' || env === '-l') console.log('deploying to lambda');
    else console.log('Please enter a valid env, docker (-d) or lambda (-l), to deploy to')
  });

program.parse(process.argv);
