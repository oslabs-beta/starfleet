"use strict";

exports.__esModule = true;
exports.getAvailableNames = getAvailableNames;
exports.EMCResolvers = void 0;

var _connection = _interopRequireDefault(require("./connection"));

exports.connection = _connection.default;

var _count = _interopRequireDefault(require("./count"));

exports.count = _count.default;

var _createMany = _interopRequireDefault(require("./createMany"));

exports.createMany = _createMany.default;

var _createOne = _interopRequireDefault(require("./createOne"));

exports.createOne = _createOne.default;

var _findById = _interopRequireDefault(require("./findById"));

exports.findById = _findById.default;

var _findByIds = _interopRequireDefault(require("./findByIds"));

exports.findByIds = _findByIds.default;

var _findMany = _interopRequireDefault(require("./findMany"));

exports.findMany = _findMany.default;

var _findOne = _interopRequireDefault(require("./findOne"));

exports.findOne = _findOne.default;

var _pagination = _interopRequireDefault(require("./pagination"));

exports.pagination = _pagination.default;

var _removeById = _interopRequireDefault(require("./removeById"));

exports.removeById = _removeById.default;

var _removeMany = _interopRequireDefault(require("./removeMany"));

exports.removeMany = _removeMany.default;

var _removeOne = _interopRequireDefault(require("./removeOne"));

exports.removeOne = _removeOne.default;

var _updateById = _interopRequireDefault(require("./updateById"));

exports.updateById = _updateById.default;

var _updateMany = _interopRequireDefault(require("./updateMany"));

exports.updateMany = _updateMany.default;

var _updateOne = _interopRequireDefault(require("./updateOne"));

exports.updateOne = _updateOne.default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAvailableNames() {
  return ['findById', 'findByIds', 'findOne', 'findMany', 'updateById', 'updateOne', 'updateMany', 'removeById', 'removeOne', 'removeMany', 'createOne', 'createMany', 'count', 'pagination', // should be defined after `findMany` and `count` resolvers
  'connection' // should be defined after `findMany` and `count` resolvers
  ];
} // Enum MongooseComposeResolvers


const EMCResolvers = {
  findById: 'findById',
  findByIds: 'findByIds',
  findOne: 'findOne',
  findMany: 'findMany',
  updateById: 'updateById',
  updateOne: 'updateOne',
  updateMany: 'updateMany',
  removeById: 'removeById',
  removeOne: 'removeOne',
  removeMany: 'removeMany',
  createOne: 'createOne',
  createMany: 'createMany',
  count: 'count',
  connection: 'connection',
  pagination: 'pagination'
};
exports.EMCResolvers = EMCResolvers;