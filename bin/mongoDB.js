#!/usr/bin/env node

const inquirer = require("inquirer"); //a collection of common interactive command line user interfaces
const chalk = require("chalk"); //terminal string styling done right
const figlet = require("figlet"); // program for making large letters our of ordinary text
const shell = require("shelljs"); // portable unix shell commands for node.js 
const fs = require("fs");

const doesDbExist = () => { 
inquirer.prompt({
    name: "MONGODB",
    message: "Do you have a existing MongoDB table?",
    type: "confirm",
})
.then( answers => {
    if (answers.MONGODB === true) { 
        inquirer.prompt({
            name:"URL",
            message: "Please enter the MongoDB url: ",
            type: "input",
        })
    } else {
        inquirer.prompt({
            name:"DATABASE",
            message: "What do you want to call your MongoDB database?",
            type: "input"
        })
    }
})
};




const run = async() => { 
    doesDbExist();
    // askForMongoDBUrl();
};

run();
