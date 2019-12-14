const fs = require('fs');

const createResolver = (modelName, modelPath) => {

  const modelResolver = `const mongoose = require('mongoose');
const ${modelName} = require('${modelPath}');

module.exports = resolvers = {
  Query: {
	${modelName}ById: async (obj, args) => {
	  const ${modelName.toLowerCase()} = await ${modelName}.findById(args._id);
	  return ${modelName.toLowerCase()};
	},
	${modelName}ByIds: async (obj, args) => {

	},
	${modelName}One: async (obj, args) => {
	  for (key in args) {
	    if (key === 'filter') {
		  for (prop in args[key]) {
		    const field = {};
			field[prop] = args[key][prop];
			const ${modelName.toLowerCase()} = await ${modelName}.findOne(field);
		    return ${modelName.toLowerCase()};
		  }
		}
	  }
	},
	${modelName}Many: async (obj, args) => {

	},

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
