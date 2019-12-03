const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLString = require('graphql').GraphQLString;
const bookType = require('../typeDefs/typeDef');
const BookModel = require('../../models/Book');

exports.addBook = {
  type: bookType.bookType,
  args: {
	name: {
	  type: new GraphQLNonNull(GraphQLString),
	},
	author: {
	  type: new GraphQLNonNull(GraphQLString),
	}
  },
  resolve: async (root, args) => {
	const uModel = new BookModel(args);
	const newBook = await uModel.save();
	if (!newBook) {
	  throw new Error('error');
	}
	return newBook;
  }
}
