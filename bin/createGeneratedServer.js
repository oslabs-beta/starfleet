const fs = require("fs");

function createGeneratedServer(mongoDBUrl = 'Enter your MongoDB Uri here', mongoDBname = 'natours') { 
    const serverText = `
    const mongoose = (require('mongoose')); 
    const fs = require('fs');
    const { ApolloServer } = require('apollo-server');
    const typeDefs = fs.readFileSync(__dirname.concat('${process.cwd()}/graphqlsrc/models/gqlSDL.gql'))
    const resolvers = require('./graphlsrc/resolvers')

    const DB = process.env.DATABASE.replace(
        '<PASSWORD>',
        process.env.DATABASE_PASSWORD
      );


    mongoose.connect('${mongoDBUrl}', { useNewUrlParser: true, useUnifiedTopology:	true, dbName: '${mongoDBname}' })

    .then(() => console.log('MongoDB successfully connected')) 

    .catch( err => console.log('Error connecting to db: ', err));


    const server = new ApolloServer({ typeDefs, resolvers }); 


    server.listen().then(({ url }) => { console.log ('🚀  Server ready at' + url ); });
    `
    fs.writeFile(`${process.cwd()}/graphqlServer.js`, serverText, err => {
        if (err) console.log(err);
    })
}

module.exports = createGeneratedServer;