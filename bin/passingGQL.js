const { composeWithMongoose } = require('graphql-compose-mongoose');
const { schemaComposer } = require('graphql-compose');
const customizationOptions = {};

const passingGQL = (model, modelName) => {
	const ModelTC = composeWithMongoose(model, customizationOptions);

	schemaComposer.Query.addFields({
		[modelName+"ById"] : ModelTC.getResolver('findById'),
		[modelName+"ByIds"] : ModelTC.getResolver('findByIds'),
		[modelName+"One"] : ModelTC.getResolver('findOne'),
		[modelName+"Many"] : ModelTC.getResolver('findMany'),
		[modelName+"Count"] : ModelTC.getResolver('count'),
		[modelName+"Connection"] : ModelTC.getResolver('connection'),
		[modelName+"Pagination"] : ModelTC.getResolver('pagination'),
	});

	schemaComposer.Mutation.addFields({
		[modelName+"CreateOne"] : ModelTC.getResolver('createOne'),
		[modelName+"CreateMany"] : ModelTC.getResolver('createMany'),
		[modelName+"UpdateById"] : ModelTC.getResolver('updateById'),
		[modelName+"UpdateOne"] : ModelTC.getResolver('updateOne'),
		[modelName+"UpdateMany"] : ModelTC.getResolver('updateMany'),
		[modelName+"RemoveById"] : ModelTC.getResolver('removeById'),
		[modelName+"RemoveOne"] : ModelTC.getResolver('removeOne'),
		[modelName+"RemoveMany"] : ModelTC.getResolver('removeMany'),
	});
	const graphqlSchema = schemaComposer.buildSchema();
	return graphqlSchema
}

module.exports = passingGQL

