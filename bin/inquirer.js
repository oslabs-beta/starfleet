#!/usr/bin/env node
const inquirer = require("inquirer"); //a collection of common interactive command line user interfaces
const shell = require("shelljs"); // portable unix shell commands for node.js 
const fs = require("fs");
const path = require('path');

const inquiry = () => {
    const questions = [
        {
            name: "SCHEMALOCATION",
            message: "Please enter the name of the folder where your schema is in:",
            type: "input",
        }
    ];

    inquirer.prompt(questions)
    .then(answers => {
        // const filePath = `${process.cwd()}/${answers.USERINPUT}.js`
        const text = `FROM node: latest \n WORKDIR /usr/src/app/${answers.USERINPUT} \n COPY package.json /usr/src/app/${answers.USERINPUT}/  \n\n RUN npm install \n COPY . /usr/src/${answers.USERINPUT} \n EXPOSE ${answers.PORT} \n CMD npm start`;

        const fileLocation = path.resolve(__dirname, `${answers.SCHEMALOCATION}`)
        fs.writeFile(filePath, text, (err) => {
            if (err) { 
                throw err;
            }
        })
        return answers.USERINPUT;
    })
}

inquiry();