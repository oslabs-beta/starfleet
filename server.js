const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { buildSchema } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools')

// GraphQL dependecies and schemas
const graphqlExpress = require('express-graphql');

// db connection 
const mongoURI = 'mongodb://mongo:27017/starfleet' //require('./response.json');

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology:	true })
  .then( () => console.log('MongoDB successfully connected'))
  .catch( err => console.log('Error connecting to db: ', err));

// GraphQL endpoint
app.use('/graphql', graphqlExpress({
  schema: graphqlObj,
  // schema: JSON.parse(JSON.stringify(bookGraphql)),
  rootValue: global,
  graphiql: true
}));



const PORT = process.env.PORT || 4000;
app.set('port', PORT);

app.listen(app.get('port'), () => {
  console.log(`Listening on port ${PORT}`);
});