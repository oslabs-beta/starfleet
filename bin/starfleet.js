#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require("chalk");
const CFonts = require('cfonts');

// Metadata
const { version } = require('../package.json');
const { description } = require('../package.json');

// Subcommands
const createGQL = require('./createGQL');
const passingGQL = require('./passingGQL');
const createFileStructure = require('./createFileStructure');
const createDockerfile = require('./createDockerfile');
const createDockerCompose= require('./createDockerCompose');
const { build, up } = require('./runDocker')

// CFonts.say('Starfleet', {
//   font: '3d',              
//   align: 'left',              
//   colors: ['yellow', 'blue'],         
//   background: 'black',  
//   letterSpacing: 1,           
//   lineHeight: 1,              
//   space: true,               
//   maxLength: '0',            
// });

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

      fs.writeFile(`./bin/config.js`, workdir, err => {
        if (err) {
          return console.log(err);
        }
      })

      fs.readdirSync('./'+workdir).forEach( file => {
        const filename = path.parse(file).name;
        const model = require('../'+workdir+'/'+file);
        createGQL(model, filename);
        // module.exports = pass(model, filename)
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
	if (!process.argv[3]) {
	  console.log(chalk.red('\nPlease enter a valid deployment option. See'),chalk.white('--help'), chalk.red(' for assistance\n'));
	  return;
	}
    const env = process.argv[3].toLowerCase() || 'deploy';
    if (env === 'docker' || env === '-d') {
      
      CFonts.say('Now Deploying to Docker', {
        font: 'chrome',              
        align: 'left',              
        colors: ['blue', 'yellow', 'cyan'],         
        background: 'black',  
        letterSpacing: 1,           
        lineHeight: 1,              
        space: true,               
        maxLength: '0',  
    })
    
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
  });


program.parse(process.argv);

