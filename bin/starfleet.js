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
const createGeneratedServer = require('./createGeneratedServer');
const createContainerInventory = require('./createContainerInventory');
const { build, up, stop } = require('./runDocker')

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
    
    const srcPath = `${process.cwd()}/graphqlsrc`

    if(!fs.existsSync(srcPath)) {
      console.log("this is the source path for the currnet working directory: ",srcPath)
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
    },
    {
      name: "MONGODB",
      message: "Do you have a existing MongoDB table?",
      type: "confirm",
    },
    {
      when: function(answer) {
        if (answer.MONGODB === true) { 
          return answer.MONGODB;
        }
      },
      name: "URL",
      message: "Please enter your MongoDB url: ",
      type: "input"
    },
    {
      when: function(answer) { 
        if (answer.MONGODB === false) { 
          return answer.MONGODB;
        }
    },
      name: "DATABASENAME",
      message: "What would you like to call your database: ",
      type: "input"
    },
  ];

    // creates SDL file after reading from user-inputted models file path
    inquirer.prompt(questions)
    .then(answers => {

      console.log("this is the answers ", answers)
      
      const workdir = `${answers.USERINPUT}`
      
      fs.readdirSync('./'+workdir).forEach( file => {
        const filename = path.parse(`${process.cwd()}/${workdir}/${file}`).name
        // each file name is passed in to createGQL; will be the prefix for all corresponding GQL types and resolvers
        const model = require(`${process.cwd()}/${workdir}/${file}`);
        
        // if the model file is only exporting one model, it will hit the function if block
        if (typeof model === "function") {
          createGQL(model, filename);
        } else if (typeof model === 'object') { // if the model file has multiple, it will be an object containing all the different schemas inside
          for (const key in model) {
            createGQL(model[key], key);
          }
        }
      });
       createGeneratedServer(answers.URL, answers.DATABASENAME);
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
		  if (!fs.existsSync('inventory.txt')) {
			const default_containers = 'mongo, starfleet_admin-mongo_1, ';
			fs.writeFileSync('inventory.txt', default_containers, err => {
			  if (err) return console.log(err);
			  console.log('Created inventory file');
			});
		  } 
		  await createContainerInventory(answers.PROJECTNAME);
		  await build();
		  await up();
		});
    }
    else if (env === 'lambda' || env === '-l') console.log('deploying to lambda');
  });

program
  .command('land')
  .alias('l')
  .description('Stop all created microservices')
  .option('-d, --docker', 'terminate docker containers')
  .action( () => {
  if (!process.argv[3]) {
    console.log(chalk.red('\nPlease enter a valid deployment option. See'),chalk.white('--help'), chalk.red(' for assistance\n'));
    return;
  }

  // if inventory file doesn't exist, bootstrap file
  fs.access('./inventory.txt', fs.constants.F_OK, err => {

    const takeInventory = cb => {
    const options = { encoding: 'utf-8' };
    fs.readFile('./inventory.txt', options, (err, content) => {
      if (err) return cb(err);
      cb(null, content);
    });
    }

    takeInventory( async (err, content) => {
      await stop(content);
      fs.unlink('inventory.txt', err => {
        if (err) return console.log('Error unlinking inventory: ', err);
        return console.log('Successfully cleaned up inventory');
      });
      });
    });
});

program.parse(process.argv);


