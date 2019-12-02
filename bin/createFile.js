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

const projectname = () => {
    const questions = [{   
        name: "USERINPUT",
        message: "Please enter a name for your project: ",
        type: "input",
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
        const filePath = `${process.cwd()}/${answers.USERINPUT}.txt`
        const text = `FROM node: latest \n WORKDIR /usr/src/app/${answers.USERINPUT} \n COPY package.json /usr/src/app/${answers.USERINPUT}/  \n\n RUN npm install \n COPY . /usr/src/${answers.USERINPUT} \n EXPOSE ${answers.PORT} \n CMD npm start`;
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

// const createFile = () => {
//     const filePath = `${process.cwd()}/${project_name}.txt`
//     const text = `FROM node: latest \n WORKDIR /usr/src/app/${project_name} \n COPY package.json /usr/src/app/${project_name}/  \n\n RUN npm install \n COPY . /usr/src/${project_name} \n EXPOSE 4000 \n CMD npm start`;
//     shell.touch(filePath);
//     fs.writeFile(filePath, text, (err) => {
//         if (err) { 
//             throw err;
//         }
//     })
//     return filePath;
// }

// const success = (filepath) => {
//     console.log(
//         chalk.white.bgGreen.bold(`Done! File created at ${filepath}`)
//     );
// };

const run = async() => { 
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

run();