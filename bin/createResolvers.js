const fs = require('fs');

const createResolver = (modelName) => {

  const modelResolver = `
  {
    Query: {
	  ${modelName}ById: async (parent, args) => {
	    return {
		  name: 'Walden',
		  author: 'Thoreau',
		}
	  }
	}
  }`;


  const stream = fs.createWriteStream('./resolvers-test.js', {flags: 'a'});
  stream.write(modelResolver);

  // Not required to explicitly end stream, as default option is AutoClose set to true, but done so here for clarity
  stream.end()

}


module.exports = createResolver;
