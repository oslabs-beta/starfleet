const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// GraphQL dependecies and schemas
const graphqlExpress = require('express-graphql');

const passingGQL = require('./bin/passingGQL') //require this to run the function
const mongoURI = 'mongodb://localhost:27017/natours-test' //require('./response.json');

// this will grab graphqlObj and user needs to put this in their server file.
const userInput = fs.readFileSync(`./bin/config.js`, 'utf-8');
let graphqlSchema;
fs.readdirSync('./'+userInput)
.forEach(file => {
  const filename = path.parse(file).name;
  const model = require('./'+userInput+'/'+file);
  graphqlSchema = passingGQL(model, filename);
});

/*
const { buildSchema } = require('graphql');
//const bookSchema = require('./src/resolvers/BookSchema').BookSchema;
const book = fs.readFileSync('./graphqlsrc/models/Book.graphql', 'utf-8');
const bookSchema = buildSchema(book, { commentDescription: true });
*/

// db connection 
const mongoURI = 'mongodb://mongo:27017/starfleet' //require('./response.json');


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology:	true, dbName: 'natours-test' })
  .then(() => console.log('MongoDB successfully connected'))
  .catch( err => console.log('Error connecting to db: ', err));

// GraphQL endpoint
app.use('/graphql', graphqlExpress({
  schema: graphqlSchema,
  rootValue: global,
  graphiql: true
}));


const PORT = process.env.PORT || 4000;
app.set('port', PORT);

app.listen(app.get('port'), () => {
  console.log(`Listening on port ${PORT}`);
});