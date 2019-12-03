#!/usr/bin/env node

const inquirer = require("inquirer"); //a collection of common interactive command line user interfaces
const chalk = require("chalk"); //terminal string styling done right
const figlet = require("figlet"); // program for making large letters our of ordinary text
const shell = require("shelljs"); // portable unix shell commands for node.js 
const fs = require("fs");

const init = () => {
    console.log(
        chalk.red(
            figlet.textSync("Creating a DockerFile", { 
                font: "Standard",
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );
}

const createDockerfile = () => {
    const questions = [{   
        name: "USERINPUT",
        message: "Please enter a name for your project: ",
	    type: "input",
	    default: "gql-project"
    },
    {
        name: "PORT",
        message: "Please choose a PORT: ",
        type: "number",
        default: 4000,
    }
    ];

    inquirer.prompt(questions)
    .then(answers => {
	  const filePath = `${process.cwd()}/Dockerfile`
	  const text = `FROM node:latest \n\nWORKDIR /usr/src/app/${answers.USERINPUT} \n\nCOPY package.json /usr/src/app/${answers.USERINPUT}/  \n\nRUN npm install \n\nCOPY . /usr/src/app/${answers.USERINPUT} \n\nEXPOSE ${answers.PORT} \n\nCMD npm start`;
        shell.touch(filePath);
        fs.writeFile(filePath, text, (err) => {
            if (err) { 
                throw err;
            }
        })
        return answers.USERINPUT;
    })
    .then(() => {
        console.log(chalk.white.bgGreen.bold(`Done! Your docker file has been created and put into your working directory!`))
    })
}


const run = async () => { 
    //show script information
    init();

    //ask for project name:
    projectname();

    //create the file
    // const filePath = createFile();

    //fill in the docker file: might have to do it in another 'file'
    
    //show success message
    // success(filePath);
};

module.exports =  createDockerfile;
