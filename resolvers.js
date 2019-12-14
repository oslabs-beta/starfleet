const mongoose = require('mongoose');
const Tour = require('./models/tourModel');
const Book = require('./models/Book');

module.exports = resolvers = {
  Query: {
    tourModelById: async (_, id) => {
      const tour = await Tour.findById(id);
      return tour;
    },
    tourModelByIds: async (_, ids) => {
      const tours_ids = await ids._ids.map((id) => mongoose.Types.ObjectId(id));
      const tours = await Tour.find({
        _id: {
          $in: tours_ids
        }
      });
      return tours;
    },
    tourModelOne: async (_, arg) => {

    },
    tourModelMany: async () => {

    },
    tourModelCount: async () => {

	},
	BookById: async (parent, args) => {
	  return {
		_id: args._id,
		name: 'Walden',
		author: 'Thoreau'
	  }
	}
  },
  Mutation: {
    tourModelCreateOne: async (_, args) => {

    },
    tourModelCreateMany: async () => {

    },
    tourModelUpdateById: async (_, id) => {

    },
    tourModelUpdateOne: async () => {

    },
    tourModelUpdateMany: async () => {

    },
    tourModelRemoveById: async () => {

    },
    tourModelRemoveOne: async () => {

    },
    tourModelRemoveMany: async () => {

	},

	BookCreateOne: async (parent, args) => {
	  const record = {}
	  for (key in args) {
		const uModel = new Book(args[key]);
		const newDoc = await uModel.save();
		if (!newDoc) {
		  throw new Error('error');
		}
		record[key] = newDoc;
		return record;
	  }
	}
  }
};
