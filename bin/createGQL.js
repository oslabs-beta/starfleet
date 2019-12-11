// Helper function used in starfleet.js; check subcommands sections of starfleet.js file
const fs = require('fs');
const chalk = require("chalk");

const { composeWithMongoose } = require('graphql-compose-mongoose');
const { schemaComposer } = require('graphql-compose');
const { printSchema } = require('graphql');

const createGQL = (model, modelName) => {
  // converts passed in mongoose schemas to graphql pieces
  const customizationOptions = {};
  const ModelTC = composeWithMongoose(model, customizationOptions); 

  // adds basic CRUD operations to converted schema
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

  // utilizes schemaComposer library's .buildSchema to add CRUD operations
  // this is different than graphql's native buildSchema() - that only adds default resolvers
  const graphqlSchemaObj = schemaComposer.buildSchema();
  // printSchema is graphQL's built in GraphQL to SDL converter
  const graphqlSDL = printSchema(graphqlSchemaObj, { commentDescriptions: true });
//   const filename = modelName + '.graphql';

//   const createSDLFile = (graphQLObj) => {
// 	  fs.writeFile(`./graphqlsrc`)
//   }

  // writes created SDL file to desginated path
  fs.writeFile(`./graphQLsrc/models/graphQLSDL`, graphqlSDL, err => {
		if (err) {
			return console.log(err);
		}
	console.log(chalk.green('✔'), chalk.cyan.bold('Done! Your GraphQL'), chalk.blue(modelName),chalk.cyan.bold('schema has been created and put into the'), chalk.blue('graphQLsrc'), chalk.cyan.bold('directory!'));
  });
};


module.exports = createGQL; 
