const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLList = require('graphql').GraphQLList;

// Import models
const BookModel = require('../../models/Book');

// Import types
const bookType = require('../typeDefs/typeDef').bookType;

// Query
exports.BookQuery = new GraphQLObjectType({
  name: 'Query',
  fields: () => {
	return {
	  books: {
		type: new GraphQLList(bookType),
		resolve: async () => {
		  const books = await BookModel.find()
		  if (!books) {
			throw new Error ('error while fetching data');
		  }
		  return books;
		}
	  }
	}
  }
});
