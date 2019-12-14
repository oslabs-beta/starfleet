
    const mongoose = (require('mongoose')); 
    const fs = require('fs');
    const { ApolloServer } = require('apollo-server');
    const typeDefs = fs.readFileSync(__dirname.concat('C:\Users\andyr\starfleet\starfleet/graphqlsrc/models/gqlSDL.gql'))
    const resolvers = require('./graphlsrc/resolvers')
    
    mongoose.connect('ass', { useNewUrlParser: true, useUnifiedTopology:	true, dbName: 'ass' })

    .then(() => console.log('MongoDB successfully connected')) 

    .catch( err => console.log('Error connecting to db: ', err));


    const server = new ApolloServer({ typeDefs, resolvers }); 


    server.listen().then(({ url }) => { console.log ('🚀  Server ready at' + url ); });
    