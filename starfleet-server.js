
const mongoose = require('mongoose'); 
const fs = require('fs');
const { ApolloServer } = require('apollo-server');
const typeDefs = fs.readFileSync('./graphqlsrc/models/starfleet-SDL.graphql', 'utf8');
const resolvers = require('./graphqlsrc/resolvers/starfleet-resolvers')

const MONGO_URI = '';

mongoose.connect(MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology:	true, 
    dbName: '' 
})
.then(() => console.log('MongoDB successfully connected')) 
.catch( err => console.log('Error connecting to db: ', err));

const server = new ApolloServer({ 
    typeDefs, 
    resolvers 
}); 

server.listen().then(({ url }) => { 
    console.log('🚀 Server ready at' + url); 
});
    