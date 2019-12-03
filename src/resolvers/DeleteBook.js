const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLString = require('graphql').GraphQLString;
const bookType = require('../typeDefs/typeDef');
const BookModel = require('../../models/Book');

exports.removeBook = {
  type: bookType.bookType,
  args: {
	id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (root, args) => {
	const removedBook = await bookModel.findByIdAndRemove(args.id);
	if (!removedBook) throw new Error('error');
	return removedBook;
  }
}
