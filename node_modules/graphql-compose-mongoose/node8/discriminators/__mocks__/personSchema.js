"use strict";

exports.__esModule = true;
exports.PersonSchema = void 0;

var _mongooseCommon = require("../../__mocks__/mongooseCommon");

const PersonSchema = new _mongooseCommon.Schema({
  dob: Number,
  starShips: [String],
  totalCredits: Number
});
exports.PersonSchema = PersonSchema;