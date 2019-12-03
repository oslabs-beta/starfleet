"use strict";

exports.__esModule = true;
exports.DroidSchema = void 0;

var _mongooseCommon = require("../../__mocks__/mongooseCommon");

const DroidSchema = new _mongooseCommon.Schema({
  makeDate: Date,
  modelNumber: Number,
  primaryFunction: [String]
});
exports.DroidSchema = DroidSchema;