#!/usr/bin/env node
 // shebang line needed for running starfleet commands (reference bin lines in package.json file)

const program = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const CFonts = require('cfonts');
const chalk = require('chalk');

// Metadata
const {
	version
} = require('../package.json');
const {
	description
} = require('../package.json');

// Subcommands
const createSDL = require('./createSDL');
const createFileStructure = require('./createFileStructure');
const createDockerfile = require('./createDockerfile');
const createDockerCompose = require('./createDockerCompose');
const createGeneratedServer = require('./createGeneratedServer');
const {
	build,
	up,
	stop
} = require('./runDocker')
const {
	importModel,
	startQueryBlock,
	startMutationBlock,
	createQueryResolver,
	createMutationResolver,
	endResolverBlock,
	insertModuleExports
} = require('./createResolvers');

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

		if (!fs.existsSync(srcPath)) {
			createFileStructure();
		} else {
			console.log('GraphQL structure already exists. Skipping...')
		}

		// questions used by inquirer to create variable inputs
		const questions = [{
				name: "USERINPUT",
				message: "Please enter the name of the folder where your schema is in:",
				type: "input",
				default: "models"
			},
			{
				name: "URI",
				message: "Please provide your MongoDB connection string (URI): ",
				type: "input"
			},
			{
				name: "DATABASENAME",
				message: "What is the name of your database?",
				type: "input"
			},
		];

		// creates SDL file after reading from user-inputted models file path
		inquirer.prompt(questions)
			.then(answers => {
				const workdir = `${answers.USERINPUT}`

				fs.readdirSync('./' + workdir).forEach(file => {
					const filename = path.parse(`${process.cwd()}/${workdir}/${file}`).name
					// each file name is passed in to createSDL; will be the prefix for all corresponding GQL types and resolvers
					const model = require(`${process.cwd()}/${workdir}/${file}`);

					// if the model file is only exporting one model, it will hit the function if block
					if (typeof model === "function") {
						// no edge case for if provided model is incorrect function
						createSDL(model, filename);
					} else if (typeof model === 'object' && Object.entries(model).length !== 0) { // if the model file has multiple, it will be an object containing all the different schemas inside
						for (const key in model) {
							createSDL(model[key], key);
						}
					} else {
						console.log(chalk.red('Skipping SDL file creation. An invalid Mongoose model was provided. Please make sure that you are exporting your models correctly.'))
					}
				});

				// creates resolver file
				const resolve = () => {
					let startExports = true;
					let startQuery = true;
					let startMutation = true;
					const models = fs.readdirSync('./' + workdir);

					// 1. Import all Mongoose models
					models.forEach(file => {
						const filename = path.parse(`${process.cwd()}/${workdir}/${file}`).name;
						const model = require(`${process.cwd()}/${workdir}/${file}`);
						// if the model file is only exporting one model, it will hit the function if block
						if (typeof model === "function") {
							// no edge case for if provided model is incorrect function
								importModel(filename, `../../${workdir}/${file}`, generatedResolverFile);
						} else if (typeof model === 'object' && Object.entries(model).length !== 0) { // if the model file has multiple, it will be an object containing all the different schemas inside
							for (const key in model) {
								importModel(key, `../../${workdir}/${file}`, generatedResolverFile);
							}
						} else {
							console.log(chalk.red('Skipping resolver creation. An invalid Mongoose model was provided. Please make sure that you are exporting your models correctly.'))
						}
					});

					// 2. Create Query resolvers for each model
					models.forEach(file => {
						if (startExports) {
							insertModuleExports(generatedResolverFile);
							startExports = false;
						}
						if (startQuery) {
							startQueryBlock(generatedResolverFile);
							startQuery = false;
						}
						const filename = path.parse(`${process.cwd()}/${workdir}/${file}`).name;
						const model = require(`${process.cwd()}/${workdir}/${file}`);
						if (typeof model === "function") {
							// no edge case for if provided model is incorrect function
								createQueryResolver(filename, `${workdir}/${file}`, generatedResolverFile);
						} else if (typeof model === 'object' && Object.entries(model).length !== 0) { // if the model file has multiple, it will be an object containing all the different schemas inside
							for (const key in model) {
								createQueryResolver(key, `${workdir}/${file}`, generatedResolverFile);
							}
						} else {
							console.log(chalk.red('Skipping resolver creation. An invalid Mongoose model was provided. Please make sure that you are exporting your models correctly.'))
						}
					});


					// 3. Close Query Block
					endResolverBlock(generatedResolverFile, '},\n');

					// 4. Create Mutation resolvers for each model
					models.forEach(file => {
						if (startMutation) {
							startMutationBlock(generatedResolverFile);
							startMutation = false;
						}
						const filename = path.parse(`${process.cwd()}/${workdir}/${file}`).name;
						const model = require(`${process.cwd()}/${workdir}/${file}`);
						if (typeof model === "function") {
							// no edge case for if provided model is incorrect function
							createMutationResolver(filename, `${workdir}/${file}`, generatedResolverFile);
						} else if (typeof model === 'object' && Object.entries(model).length !== 0) { // if the model file has multiple, it will be an object containing all the different schemas inside
							for (const key in model) {
								createMutationResolver(key, `${workdir}/${file}`, generatedResolverFile);
							}
						} else {
							console.log(chalk.red('Skipping resolver creation. An invalid Mongoose model was provided. Please make sure that you are exporting your models correctly.'))
						}
					});

					// 5. Close Resolvers Block
					endResolverBlock(generatedResolverFile, '},\n');
					endResolverBlock(generatedResolverFile, '}');
				}

				const generatedResolverFile = `${process.cwd()}/graphqlsrc/resolvers/starfleet-resolvers.js`
				fs.access(generatedResolverFile, fs.constants.F_OK, err => {
					err ? resolve() : console.log(chalk.red('Skipping resolver file creation. Resolver file already exists in graphqlsrc directory. To generate a new resolver file, either manually delete starfleet-resolvers.js or run command'), chalk.white('starfleet unresolve'), chalk.red('to remove it'));
				});

				// creates server file
				createGeneratedServer(answers.URI, answers.DATABASENAME)
			})
	})

// "starfleet deploy/d ['-d', '--docker']" command to deploy to docker"
program
	.command('deploy')
	.alias('d')
	.description('Deploys newly created GQL service to docker')
	.option("-d, --docker", "deploy to docker")
	.action(() => {
		if (!process.argv[3]) {
			console.log(chalk.red('\nPlease enter a valid deployment option. See'), chalk.white('--help'), chalk.red(' for assistance\n'));
			return;
		}
		const env = process.argv[3].toLowerCase();
		if (env === '--docker' || env === '-d') {

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

			const prompts = [{
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
				.then(answers => {
					createDockerfile(answers.PROJECTNAME, answers.PORT);
					createDockerCompose(answers.PROJECTNAME, answers.PORT);
					build();
					up();
				});
		} else if (env === 'lambda' || env === '-l') console.log('deploying to lambda');
	});

program
	.command('land')
	.alias('l')
	.description('Stops created docker container')
	.option('-d, --docker', 'terminate docker containers')
	.action(() => {

		if (!process.argv[3]) {
			console.log(chalk.red('\nPlease enter a valid deployment option. See'), chalk.white('--help'), chalk.red(' for assistance\n'));
			return;
		}

		fs.access('./docker-compose-starfleet.yml', fs.constants.F_OK, err => {
			if (err) console.log('Missing file docker-compose-starfleet.yml, run command `starfleet deploy -d` to generate Docker containers');
			stop();
		});

	});

program
	.command('cleanup')
	.alias('c')
	.description('Remove all generated folders & files from init command')
	.action(() => {
		const graphqlsrcDir = `${process.cwd()}/graphqlsrc`
		const modelsDir = `${process.cwd()}/graphqlsrc/models`
		const resolversDir = `${process.cwd()}/graphqlsrc/resolvers`
		const gqlFile = `${process.cwd()}/graphqlsrc/models/starfleet-SDL.graphql`;
		const resolversFile = `${process.cwd()}/graphqlsrc/resolvers/starfleet-resolvers.js`;
		const gqlServerFile = `${process.cwd()}/graphqlServer.js`

		fs.readdirSync(graphqlsrcDir).forEach(folder => {
			if (folder === 'models') {
				fs.unlinkSync(gqlFile)
				fs.rmdirSync(modelsDir)
			}

			if (folder === 'resolvers') {
				fs.unlinkSync(resolversFile)
				fs.rmdirSync(resolversDir)
			}
		})

		fs.rmdirSync(graphqlsrcDir)
		fs.unlinkSync(gqlServerFile)
	});

program.parse(process.argv);