const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLString = require('graphql').GraphQLString;
const bookType = require('../typeDefs/typeDef');
const BookModel = require('../../models/Book');

exports.updateBook = {
  type: bookType.bookType,
  args: {
	id: { type: new GraphQLNonNull(GraphQLString) },
	name: { type: new GraphQLNonNull(GraphQLString)	},
	author: { type: new GraphQLNonNull(GraphQLString) }
  },
  resolve: async (root, args) => {
	const UpdatedBook = await BookModel.findByIdAndUpdate(args.id, args);
	if (!UpdatedBook) {
	  throw new Error('Error')
	}
	return UpdatedBook;
  }
};
