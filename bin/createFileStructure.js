#!/usr/bin/env node

const inquirer = require("inquirer"); //a collection of common interactive command line user interfaces
const shell = require("shelljs"); // portable unix shell commands for node.js 
const fs = require("fs"); 

const createFolderStructure = () => {
    const srcText = `src`
    const modelsText = `models`
    shell.mkdir(srcText);
    shell.mkdir(modelsText);
}

const foldersInsideSrc = () => { 
    const folders = ['data', 'models', 'resolvers', 'typeDefs'];
    folders.forEach(element => {
        let filepath = `${process.cwd()}/src/${element}`
        shell.mkdir(filepath);
    })
}



const run = async() => {
    createFolderStructure();
    foldersInsideSrc();
}

run();