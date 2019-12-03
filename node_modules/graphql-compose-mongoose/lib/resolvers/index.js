"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAvailableNames = getAvailableNames;
Object.defineProperty(exports, "connection", {
  enumerable: true,
  get: function () {
    return _connection.default;
  }
});
Object.defineProperty(exports, "count", {
  enumerable: true,
  get: function () {
    return _count.default;
  }
});
Object.defineProperty(exports, "createMany", {
  enumerable: true,
  get: function () {
    return _createMany.default;
  }
});
Object.defineProperty(exports, "createOne", {
  enumerable: true,
  get: function () {
    return _createOne.default;
  }
});
Object.defineProperty(exports, "findById", {
  enumerable: true,
  get: function () {
    return _findById.default;
  }
});
Object.defineProperty(exports, "findByIds", {
  enumerable: true,
  get: function () {
    return _findByIds.default;
  }
});
Object.defineProperty(exports, "findMany", {
  enumerable: true,
  get: function () {
    return _findMany.default;
  }
});
Object.defineProperty(exports, "findOne", {
  enumerable: true,
  get: function () {
    return _findOne.default;
  }
});
Object.defineProperty(exports, "pagination", {
  enumerable: true,
  get: function () {
    return _pagination.default;
  }
});
Object.defineProperty(exports, "removeById", {
  enumerable: true,
  get: function () {
    return _removeById.default;
  }
});
Object.defineProperty(exports, "removeMany", {
  enumerable: true,
  get: function () {
    return _removeMany.default;
  }
});
Object.defineProperty(exports, "removeOne", {
  enumerable: true,
  get: function () {
    return _removeOne.default;
  }
});
Object.defineProperty(exports, "updateById", {
  enumerable: true,
  get: function () {
    return _updateById.default;
  }
});
Object.defineProperty(exports, "updateMany", {
  enumerable: true,
  get: function () {
    return _updateMany.default;
  }
});
Object.defineProperty(exports, "updateOne", {
  enumerable: true,
  get: function () {
    return _updateOne.default;
  }
});
exports.EMCResolvers = void 0;

var _connection = _interopRequireDefault(require("./connection"));

var _count = _interopRequireDefault(require("./count"));

var _createMany = _interopRequireDefault(require("./createMany"));

var _createOne = _interopRequireDefault(require("./createOne"));

var _findById = _interopRequireDefault(require("./findById"));

var _findByIds = _interopRequireDefault(require("./findByIds"));

var _findMany = _interopRequireDefault(require("./findMany"));

var _findOne = _interopRequireDefault(require("./findOne"));

var _pagination = _interopRequireDefault(require("./pagination"));

var _removeById = _interopRequireDefault(require("./removeById"));

var _removeMany = _interopRequireDefault(require("./removeMany"));

var _removeOne = _interopRequireDefault(require("./removeOne"));

var _updateById = _interopRequireDefault(require("./updateById"));

var _updateMany = _interopRequireDefault(require("./updateMany"));

var _updateOne = _interopRequireDefault(require("./updateOne"));

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