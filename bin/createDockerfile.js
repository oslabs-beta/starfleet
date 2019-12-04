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

const createDockerfile = (PROJECT_NAME, PORT) => {

	const filePath = `${process.cwd()}/Dockerfile`
	const text = `FROM node:latest \n\nWORKDIR /usr/src/app/${PROJECT_NAME} \n\nCOPY package.json /usr/src/app/${PROJECT_NAME}/  \n\nRUN npm install \n\nCOPY . /usr/src/app/${PROJECT_NAME} \n\nEXPOSE ${PORT} \n\nCMD npm start`;
	shell.touch(filePath);
	fs.writeFile(filePath, text, (err) => {
		if (err) { 
			throw err;
		} else { 
		 console.log(chalk.green('✔'), chalk.cyan.bold(`Done! Your docker file has been created and put into your working directory!`))
		}
	});
	return;
}

module.exports =  createDockerfile;
