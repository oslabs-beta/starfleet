
    const mongoose = (require('mongoose')); 
    const fs = require('fs');
    const { ApolloServer } = require('apollo-server');
    const typeDefs = fs.readFileSync(__dirname.concat('C:\Users\andyr\starfleet\starfleet/graphqlsrc/models/gqlSDL.gql'))
    const resolvers = require('./graphlsrc/resolvers')

    const DB = process.env.DATABASE.replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD
      );


    mongoose.connect('Enter your MongoDB Uri here', { useNewUrlParser: true, useUnifiedTopology:	true, dbName: 'natours' })

    .then(() => console.log('MongoDB successfully connected')) 

    .catch( err => console.log('Error connecting to db: ', err));


    const server = new ApolloServer({ typeDefs, resolvers }); 


    server.listen().then(({ url }) => { console.log ('🚀  Server ready at' + url ); });
    