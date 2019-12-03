const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLID = require('graphql').GraphQLID;
const GraphQLString = require('graphql').GraphQLString;

exports.bookType = new GraphQLObjectType({
  name: 'book',
  fields: () => {
	return {
	  id: { type: new GraphQLNonNull(GraphQLID)},
	  name: { type: GraphQLString },
	  author: { type: GraphQLString }
	}
  }
});
