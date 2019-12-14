const mongoose = require('mongoose');
const fs = require('fs');
const { ApolloServer } = require('apollo-server');
const typeDefs = `${fs.readFileSync(__dirname.concat('/graphqlsrc/models/gqlSDL.gql'), 'utf8')}` // this path is for testing purpose and should be dynamic on fix.
const resolvers = require('./resolvers')


// db connection 
const DB = 'mongodb://localhost:27017/starfleet';

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology:	true })
  .then(() => console.log('MongoDB successfully connected'))
  .catch( err => console.log('Error connecting to db: ', err));

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
