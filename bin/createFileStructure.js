// Helper function used in starfleet.js; check subcommands sections of starfleet.js file
const shell = require("shelljs"); // portable unix shell commands for node.js 

console.log("this is the current working directory: ", process.cwd())
const createFileStructure = () => {
    // creates new src folder
    const srcText = `graphqlsrc`
    shell.mkdir(srcText);
    
    // creates file structure in the new src folder; folder names taken from text arr
    const text = ['data', 'models', 'resolvers'];
    text.forEach(element => {
        let filepath = `${process.cwd()}/graphqlsrc/${element}`
        shell.mkdir(filepath);
    })
}

module.exports = createFileStructure;
