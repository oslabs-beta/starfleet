"use strict";

exports.__esModule = true;
exports.MovieModel = void 0;

var _mongooseCommon = require("../../__mocks__/mongooseCommon");

const MovieSchema = new _mongooseCommon.Schema({
  _id: String,
  characters: {
    type: [String],
    // redundant but i need it.
    description: 'A character in the Movie, Person or Droid.'
  },
  director: {
    type: String,
    // id of director
    description: 'Directed the movie.'
  },
  imdbRatings: String,
  releaseDate: String
});

const MovieModel = _mongooseCommon.mongoose.model('Movie', MovieSchema);

exports.MovieModel = MovieModel;