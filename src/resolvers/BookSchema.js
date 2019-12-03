const GraphQLSchema = require('graphql').GraphQLSchema;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const query = require('./BookQuery').BookQuery;
const mutation = require('./BookMutations');

exports.BookSchema = new GraphQLSchema({
  query,
  mutation: new GraphQLObjectType({
	name: 'Mutation',
	fields: mutation
  })
});
