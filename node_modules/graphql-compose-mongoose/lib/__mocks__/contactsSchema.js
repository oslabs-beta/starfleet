"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongooseCommon = require("./mongooseCommon");

const ContactsSchema = new _mongooseCommon.Schema({
  phones: [String],
  email: String,
  skype: String,
  locationId: _mongooseCommon.Schema.Types.ObjectId
});
var _default = ContactsSchema;
exports.default = _default;