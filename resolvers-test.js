const Book = require('./models/Book');


module.exports = resolvers = {
  Query: {
	BookById: async (obj, args) => {
	  const book = await Book.findById(args._id);
	  return book;
	},
	BookByIds: async (obj, args) => {

	},
	BookOne: async (obj, args) => {
	  for (key in args) {
	    if (key === 'filter') {
		  for (prop in args[key]) {
		    const field = {};
			field[prop] = args[key][prop];
			const book = await Book.findOne(field);
		    return book;
		  }
		}
	  }
	},
	BookMany: async (obj, args) => {

	},

  },
  Mutation: {
	BookCreateOne: async (obj, args) => {
	  const record = {};
	  for (key in args) {
		const newModel = new Book(args[key]);
		const newDoc = await newModel.save();
		if (!newDoc) {
		  throw new Error('error saving document');
		}
		record[key] = newDoc;
		return record;
	  }
	},
	BookCreateMany: async (obj, args) => {
	  const payload = {};
	  const records = [];
	  const recordIds = [];
	  for (key in args) {
	    if (key === 'records') {
		  for (let i = 0; i < args[key].length; i++) { 
			const newModel = new Book(args[key][i]);
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
	BookUpdateById: async (obj, args) => {
	  for (key in args) {
		if (key === 'record') {
		  const update = {};
		  for (field in args[key]) {
			update[field] = args[key][field];
		  }
		  const updatedDoc = await Book.findByIdAndUpdate(args[key]._id, update, {useFindAndModify: false, new: true})
		  .catch( err => console.log('No document found'));
		  if (!updatedDoc) {
		    throw new Error('error updating document, ensure MongoID is correct')
		  }
		  return { record: updatedDoc };
		}
	  }
	},
	BookUpdateOne: async (obj, args) => {
	  for (key in args) {
		if (key === 'filter') {
		  const conditions = args[key];
		  const updatedDoc = await Book.findOneAndUpdate(conditions, args.record, { useFindAndModify: false, new: true })
		    .catch( err => console.log('No document found under given conditions'));
		  if (!updatedDoc) {
			throw new Error('error finding and updating document, ensure filter conditions are correct');
		  };
		  return { record: updatedDoc };
		}
	  }
	},
	BookRemoveById: async (obj, args) => {
	  if (args.hasOwnProperty('_id')) {
		const removedDoc = await Book.findByIdAndRemove(args._id, { useFindAndModify: false })
		  .catch( err => console.log('No document found'));
		if (!removedDoc) {
		  throw new Error('error finding and removing document, ensure _id is correct');
		};
	    return { record: removedDoc };
	  } else {
	    throw new Error('_id is required');
	  }
	},
	BookRemoveOne: async (obj, args) => {
	  for (key in args) {
		if (key === 'filter') {
		  const field = {};
		  for (prop in args[key]) {
			field[prop] = args[key][prop];
		  }
		  const removedDoc = await Book.findOneAndRemove(field, { useFindAndModify: false })
			.catch( err => console.log('Error finding and removing document'));
		  if (!removedDoc) {
		    throw new Error('Error finding and removing document, ensure filter conditions are correct')
		  }
		  return { record: removedDoc }; 
		}
	  }
	},

  }
}