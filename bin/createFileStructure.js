#!/usr/bin/env node

const inquirer = require("inquirer"); //a collection of common interactive command line user interfaces
const chalk = require("chalk"); //terminal string styling done right
const figlet = require("figlet"); // program for making large letters our of ordinary text
const shell = require("shelljs"); // portable unix shell commands for node.js 
const fs = require("fs");

//creating
const createFolderStructure = () => {
    const srcText = `graphqlsrc`
    const modelsText = `models`
    shell.mkdir(srcText);
    shell.mkdir(modelsText);
}

const foldersInsideSrc = () => { 
    const text = ['data', 'models', 'resolvers', 'typeDefs'];
    text.forEach(element => {
        let filepath = `${process.cwd()}/graphlsrc/${element}`
        shell.mkdir(filepath);
    })
}



const run = async() => {
    createFolderStructure();
    foldersInsideSrc();
}

run();