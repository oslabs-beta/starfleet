
    const mongoose = (require('mongoose')); 
    const fs = require('fs');
    const { ApolloServer } = require('apollo-server');
    const typeDefs = fs.readFileSync('./graphqlsrc/models/starfleetSDL.gql')
    const resolvers = require('./graphqlsrc/resolvers/starfleet-resolvers.js')

    mongoose.connect('URL', { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'starfleet' })

    .then(() => console.log('MongoDB successfully connected')) 

    .catch( err => console.log('Error connecting to db: ', err));


    const server = new ApolloServer({ typeDefs, resolvers }); 


    server.listen().then(({ url }) => { console.log ('🚀  Server ready at' + url ); });
    