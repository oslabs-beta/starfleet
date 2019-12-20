#!/usr/bin/env node
const inquirer = require('inquirer');
const createDockerfile = require('./createDockerfile.js');
const createDockerCompose= require('./createDockerCompose.js');
const { build, up } = require('./runDocker.js');

const deployDocker = () => { 
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
    .then(async answers => { 
        await createDockerfile(answers.PROJECTNAME, answers.PORT);
        await createDockerCompose(answers.PROJECTNAME, answers.PORT);
        await build();
        await up();
    })
}

deployDocker();

