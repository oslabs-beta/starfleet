const fs = require('fs');

const importModel = (modelName, modelPath, filename) => {
  const dependencies = `const ${modelName} = require('${modelPath}');\n`
  const stream = fs.createWriteStream(filename, {flags: 'a'});
  stream.write(dependencies);
  stream.end();
};

const insertModuleExports = filename => {
  const moduleExports = '\nmodule.exports = resolvers = {\n';
  const stream = fs.createWriteStream(filename, {flags: 'a'});
  stream.write(moduleExports);
}

const startQueryBlock = filename => {
  const startQueryBlock = 'Query: {\n';
  const stream = fs.createWriteStream(filename, {flags: 'a'});
  stream.write(startQueryBlock);
}

const startMutationBlock = filename => {
  const startMutationBlock = 'Mutation: {\n';
  const stream = fs.createWriteStream(filename, {flags: 'a'});
  stream.write(startMutationBlock);
};

const endResolverBlock = (filename, endResolverBlock) => {
  const stream = fs.createWriteStream(filename, {flags: 'a'});
  stream.write(endResolverBlock);
}

const createQueryResolver = (modelName, modelPath, filename) => {

  const modelResolver = `
	${modelName}ById: async (obj, args) => {
	  const ${modelName.toLowerCase()} = await ${modelName}.findById(args._id);
	  return ${modelName.toLowerCase()};
	},
	${modelName}ByIds: async (obj, args) => {
		const ${modelName.toLowerCase()}_ids = await args._ids.map((id) => id);
		const ${modelName.toLowerCase()} = await Tour.find({
			_id: {
				$in: ${modelName.toLowerCase()}_ids
			}
		});
		return  ${modelName.toLowerCase()};	
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
	  for (key in args) {
	    if (key === 'filter') {
		  for (prop in args[key]) {
		    const field = {};
			field[prop] = args[key][prop];
			const ${modelName.toLowerCase()} = await ${modelName}.find(field);
		    return ${modelName.toLowerCase()};
		  }
		}
	  }
	},
`;


  const stream = fs.createWriteStream(filename, {flags: 'a'});
  stream.write(modelResolver);

  // Not required to explicitly end stream, as default option is AutoClose set to true, but done so here for clarity
  stream.end()

}

const createMutationResolver = (modelName, modelPath, filename) => {

  const modelResolver = `
	${modelName}CreateOne: async (obj, args) => {
	  const record = {};
	  for (key in args) {
		const newModel = new ${modelName}(args[key]);
		const newDoc = await newModel.save();
		if (!newDoc) {
		  throw new Error('error saving document');
		}
		record[key] = newDoc;
		return record;
	  }
	},
	${modelName}CreateMany: async (obj, args) => {
	  const payload = {};
	  const records = [];
	  const recordIds = [];
	  for (key in args) {
	    if (key === 'records') {
		  for (let i = 0; i < args[key].length; i++) { 
			const newModel = new ${modelName}(args[key][i]);
			const newDoc = await newModel.save();
			if (!newDoc) {
			  throw new Error('error saving document');
			}
			records.push(newDoc);
			recordIds.push(newDoc._id);
		  };
		}
	  };
	  payload['records'] = records;
	  payload['recordIds'] = recordIds;
	  payload['createCount'] = records.length;
	  return payload;
	},
	${modelName}UpdateById: async (obj, args) => {
	  for (key in args) {
		if (key === 'record') {
		  const update = {};
		  for (field in args[key]) {
			update[field] = args[key][field];
		  }
		  const updatedDoc = await ${modelName}.findByIdAndUpdate(args[key]._id, update, {useFindAndModify: false, new: true})
		  .catch( err => console.log('No document found'));
		  if (!updatedDoc) {
		    throw new Error('error updating document, ensure MongoID is correct')
		  }
		  return { record: updatedDoc };
		}
	  }
	},
	${modelName}UpdateOne: async (obj, args) => {
	  for (key in args) {
		if (key === 'filter') {
		  const conditions = args[key];
		  const updatedDoc = await ${modelName}.findOneAndUpdate(conditions, args.record, { useFindAndModify: false, new: true })
		    .catch( err => console.log('No document found under given conditions'));
		  if (!updatedDoc) {
			throw new Error('error finding and updating document, ensure filter conditions are correct');
		  };
		  return { record: updatedDoc };
		}
	  }
	},
	${modelName}RemoveById: async (obj, args) => {
	  if (args.hasOwnProperty('_id')) {
		const removedDoc = await ${modelName}.findByIdAndRemove(args._id, { useFindAndModify: false })
		  .catch( err => console.log('No document found'));
		if (!removedDoc) {
		  throw new Error('error finding and removing document, ensure _id is correct');
		};
	    return { record: removedDoc };
	  } else {
	    throw new Error('_id is required');
	  }
	},
	${modelName}RemoveOne: async (obj, args) => {
	  for (key in args) {
		if (key === 'filter') {
		  const field = {};
		  for (prop in args[key]) {
			field[prop] = args[key][prop];
		  }
		  const removedDoc = await ${modelName}.findOneAndRemove(field, { useFindAndModify: false })
			.catch( err => console.log('Error finding and removing document'));
		  if (!removedDoc) {
		    throw new Error('Error finding and removing document, ensure filter conditions are correct')
		  }
		  return { record: removedDoc }; 
		}
	  }
	},
`;


  const stream = fs.createWriteStream(filename, {flags: 'a'});
  stream.write(modelResolver);

  // Not required to explicitly end stream, as default option is AutoClose set to true, but done so here for clarity
  stream.end()

}

const endResolver = filename => {
  const stream = fs.createWriteStream(filename, {flags: 'a'});
  stream.write('}');
  stream.end();
}

module.exports = { 
	importModel,
  startQueryBlock,
  startMutationBlock,
  createQueryResolver,
  createMutationResolver,
  endResolverBlock,
	insertModuleExports,
};
