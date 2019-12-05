// Helper function used in starfleet.js; check subcommands sections of starfleet.js file
const shell = require("shelljs"); // portable unix shell commands for node.js 

const createFileStructure = () => {
    // creates new src folder
    const srcText = `graphqlsrc`
    shell.mkdir(srcText);
    
    // creates folders (using provided elements in text arr) within the new src folder
    const text = ['data', 'models'];
    text.forEach(element => {
        let filepath = `${process.cwd()}/graphqlsrc/${element}`
        shell.mkdir(filepath);
    })
}

module.exports = createFileStructure;
