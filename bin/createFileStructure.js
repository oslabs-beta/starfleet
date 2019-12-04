#!/usr/bin/env node
const shell = require("shelljs"); // portable unix shell commands for node.js 

const createFileStructure = () => {
    // creates new src folder
    const srcText = `graphqlsrc`
    shell.mkdir(srcText);
    
    // creates file structure in the new src folder
    const text = ['data', 'models'];
    text.forEach(element => {
        let filepath = `${process.cwd()}/graphqlsrc/${element}`
        shell.mkdir(filepath);
    })
}

module.exports = createFileStructure;
