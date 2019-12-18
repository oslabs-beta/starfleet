const Tour = require('../../models/Tour.js');

module.exports = resolvers = {
Query: {

	TourById: async (obj, args) => {
	  const tour = await Tour.findById(args._id);
	  return tour;
	},
	// TourByIds: async (obj, args) => {

	// },
	TourOne: async (obj, args) => {
	  for (key in args) {
	    if (key === 'filter') {
		  for (prop in args[key]) {
		    const field = {};
			field[prop] = args[key][prop];
			const tour = await Tour.findOne(field);
		    return tour;
		  }
		}
	  }
	},
	// TourMany: async (obj, args) => {

	// },


	TourCreateOne: async (obj, args) => {
	  const record = {};
	  for (key in args) {
		const newModel = new Tour(args[key]);
		const newDoc = await newModel.save();
		if (!newDoc) {
		  throw new Error('error saving document');
		}
		record[key] = newDoc;
		return record;
	  }
	},
	TourCreateMany: async (obj, args) => {
	  const payload = {};
	  const records = [];
	  const recordIds = [];
	  for (key in args) {
	    if (key === 'records') {
		  for (let i = 0; i < args[key].length; i++) { 
			const newModel = new Tour(args[key][i]);
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
	TourUpdateById: async (obj, args) => {
	  for (key in args) {
		if (key === 'record') {
		  const update = {};
		  for (field in args[key]) {
			update[field] = args[key][field];
		  }
		  const updatedDoc = await Tour.findByIdAndUpdate(args[key]._id, update, {useFindAndModify: false, new: true})
		  .catch( err => console.log('No document found'));
		  if (!updatedDoc) {
		    throw new Error('error updating document, ensure MongoID is correct')
		  }
		  return { record: updatedDoc };
		}
	  }
	},
	TourUpdateOne: async (obj, args) => {
	  for (key in args) {
		if (key === 'filter') {
		  const conditions = args[key];
		  const updatedDoc = await Tour.findOneAndUpdate(conditions, args.record, { useFindAndModify: false, new: true })
		    .catch( err => console.log('No document found under given conditions'));
		  if (!updatedDoc) {
			throw new Error('error finding and updating document, ensure filter conditions are correct');
		  };
		  return { record: updatedDoc };
		}
	  }
	},
	TourRemoveById: async (obj, args) => {
	  if (args.hasOwnProperty('_id')) {
		const removedDoc = await Tour.findByIdAndRemove(args._id, { useFindAndModify: false })
		  .catch( err => console.log('No document found'));
		if (!removedDoc) {
		  throw new Error('error finding and removing document, ensure _id is correct');
		};
	    return { record: removedDoc };
	  } else {
	    throw new Error('_id is required');
	  }
	},
	TourRemoveOne: async (obj, args) => {
	  for (key in args) {
		if (key === 'filter') {
		  const field = {};
		  for (prop in args[key]) {
			field[prop] = args[key][prop];
		  }
		  const removedDoc = await Tour.findOneAndRemove(field, { useFindAndModify: false })
			.catch( err => console.log('Error finding and removing document'));
		  if (!removedDoc) {
		    throw new Error('Error finding and removing document, ensure filter conditions are correct')
		  }
		  return { record: removedDoc }; 
		}
	  }
	},
},
// Mutation: {
// }
}

