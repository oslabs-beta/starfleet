#!/usr/bin/env node

const inquirer = require("inquirer"); //a collection of common interactive command line user interfaces
const shell = require("shelljs"); // portable unix shell commands for node.js 
const fs = require("fs");

//NOTE: at the moment, you need to already have invoked the createFileStructure command:
//function that asks if user has a mongoDB. If they do, ask for their schema and add it to the src/models folder. If not, ask for the name of their mongoDB.
const doesDbExist = () => { 
inquirer.prompt({
    name: "MONGODB",
    message: "Do you have a existing MongoDB table?",
    type: "confirm",
})
.then( answers => {
    if (answers.MONGODB === true) { 
        const questions = [{
            name:"URL",
            message: "Please enter the MongoDB url: ",
            type: "input",
        },
        { 
            name: "SCHEMA",
            message: "Copy and paste your MongoDB schema into your text editor: ",
            type: 'editor',
        }]
     
        inquirer.prompt(questions)
        .then( answers => {
            const filePath = `src/models/schema.js`;
            shell.touch(filePath);
            fs.writeFile(filePath, answers.SCHEMA, err => {
                console.log(err);
            })
        })
    } else {
        inquirer.prompt({
            name:"DATABASENAME",
            message: "What do you want to call your MongoDB database?",
            type: "input"
        })
        .then( answers => {
            const filePath = `src/models/schema.js`;
            const mongoDBText = `mongoose.connect(mongo_uri, { dbName: "${answers.DATABASENAME}"})`;

            shell.touch(filePath);
            fs.writeFile(filePath, mongoDBText, err => {
                if (err) { 
                    return console.log("this is the error: " ,err);
                } else { 
                    return;
                } 
            })
        })
    }
})
};




const run = async() => { 
    doesDbExist();
    
};

run();
