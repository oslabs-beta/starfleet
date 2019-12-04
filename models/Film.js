const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filmSchema = new Schema({
  title: String,
  episode_id: Number,
  opening_crawl: String,
  director: String,
  producer: String,
  release_date: Date
});

module.exports = mongoose.model('film', filmSchema);
