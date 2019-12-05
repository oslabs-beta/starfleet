#!/usr/bin/env node
// shebang line needed for running starfleet commands (reference bin lines in package.json file)

const program = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const CFonts = require('cfonts');

// Metadata
const { version } = require('../package.json');
const { description } = require('../package.json');

// Subcommands
const createGQL = require('./createGQL');
const createFileStructure = require('./createFileStructure');
const createDockerfile = require('./createDockerfile');
const createDockerCompose= require('./createDockerCompose');
const { build, up } = require('./runDocker')

program
  .version(version)
  .description(description)

// "starfleet init" command for converting mongoose schema to gql pieces
program
  .command('init')
  .alias('i')
  .description('Initializing GraphQL services')
  .action(() => {
    
    CFonts.say('Starfleet', {
      font: '3d',              
      align: 'left',              
      colors: ['yellow', 'blue'],         
      background: 'black',  
      letterSpacing: 1,           
      lineHeight: 1,              
      space: true,               
      maxLength: '0',            
    });

    const srcPath = path.resolve(__dirname, '../graphqlsrc') 
    if(!fs.existsSync(srcPath)) {
      createFileStructure(); // first creates file structure
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

    // creates SDL file after reading from user-inputted models file path
    inquirer.prompt(questions)
    .then(answers => {
      const workdir = `${answers.USERINPUT}`

    // user's answer used to locate folder containing mongoose schemas
    fs.readdirSync('./'+workdir).forEach( file => {
    const filename = path.parse(file).name;
    // each file name is passed in to createGQL; will be the prefix for all corresponding GQL types and resolvers
    const model = require('../'+workdir+'/'+file);
    createGQL(model, filename);
    });
  })
  })

// "starfleet deploy/d ['-d', '--docker', '-l', '--l']" command to deploy to desired service; default docker"
program
  .command('deploy')
  .alias('d')
  .description('Deploy newly created GQL service')
  .option("-d, --docker", "deploy to docker")
  .option("-l, --lambda", "deploy to lambda")
  .action( () => {
  // process.argv is the array holding all typed words in command line
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
		  await build();
		  await up();
		});
    }
    else if (env === 'lambda' || env === '-l') console.log('deploying to lambda');
    else console.log('Please enter a valid env, docker (-d) or lambda (-l), to deploy to')
  });

program.parse(process.argv);
