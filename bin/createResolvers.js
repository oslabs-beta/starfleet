const fs = require('fs');

const createResolver = (modelName) => {

  const modelResolver = `
  {
    Query: {
	  ${modelName}ById: async (obj, args) => {
	    return {
		  name: args,
		  author: 'Thoreau',
		}
	  },
	  ${modelName}ByIds: async (obj, args
	},
	Mutation: {
	  ${modelName}CreateOne: async (obj, args) => {
		const record = {};
		for (key in args) {
		  const uModel = new ${modelName}(args[key]);
		  const newDoc = await uModel.save();
		  if (!newDoc) {
			throw new Error('error saving document');
		  }
		  record[key] = newDoc;
		  return record;
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
