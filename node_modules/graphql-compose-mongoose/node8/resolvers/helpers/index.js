"use strict";

exports.__esModule = true;
var _exportNames = {
  MergeAbleHelperArgsOpts: true
};
exports.MergeAbleHelperArgsOpts = void 0;

var _filter = require("./filter");

Object.keys(_filter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _filter[key];
});

var _limit = require("./limit");

Object.keys(_limit).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _limit[key];
});

var _record = require("./record");

Object.keys(_record).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _record[key];
});

var _projection = require("./projection");

Object.keys(_projection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _projection[key];
});

var _skip = require("./skip");

Object.keys(_skip).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _skip[key];
});

var _sort = require("./sort");

Object.keys(_sort).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _sort[key];
});
const MergeAbleHelperArgsOpts = {
  sort: 'boolean',
  skip: 'boolean',
  limit: (0, _limit.getLimitHelperArgsOptsMap)(),
  filter: (0, _filter.getFilterHelperArgOptsMap)(),
  record: (0, _record.getRecordHelperArgsOptsMap)(),
  records: (0, _record.getRecordHelperArgsOptsMap)()
};
exports.MergeAbleHelperArgsOpts = MergeAbleHelperArgsOpts;