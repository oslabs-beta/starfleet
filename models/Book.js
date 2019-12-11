const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  name: {
	type: String,
	required: true
  },
  author: {
	type: String,
	required: true
  }
});

module.exports = mongoose.model('book', BookSchema);
