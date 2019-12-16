
    const mongoose = (require('mongoose')); 
    const fs = require('fs');
    const { ApolloServer } = require('apollo-server');
    const typeDefs = fs.readFileSync('./graphqlsrc/models/gqlSDL.gql')
    const resolvers = require('./graphlsrc/resolvers')

    mongoose.connect('Enter your MongoDB Uri here', { useNewUrlParser: true, useUnifiedTopology:	true, dbName: 'lol' })

    .then(() => console.log('MongoDB successfully connected')) 

    .catch( err => console.log('Error connecting to db: ', err));


    const server = new ApolloServer({ typeDefs, resolvers }); 


    server.listen().then(({ url }) => { console.log ('🚀  Server ready at' + url ); });
    