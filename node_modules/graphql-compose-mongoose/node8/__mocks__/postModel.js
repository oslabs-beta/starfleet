"use strict";

exports.__esModule = true;
exports.PostModel = exports.PostSchema = void 0;

var _mongooseCommon = require("./mongooseCommon");

const PostSchema = new _mongooseCommon.Schema({
  _id: {
    type: Number
  },
  title: {
    type: String,
    description: 'Post title'
  } // createdAt, created via option `timastamp: true` (see bottom)
  // updatedAt, created via option `timastamp: true` (see bottom)

});
exports.PostSchema = PostSchema;

const PostModel = _mongooseCommon.mongoose.model('Post', PostSchema);

exports.PostModel = PostModel;