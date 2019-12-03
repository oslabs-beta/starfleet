"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  GraphQLMongoID: true,
  GraphQLBSONDecimal: true
};
Object.defineProperty(exports, "GraphQLMongoID", {
  enumerable: true,
  get: function () {
    return _mongoid.default;
  }
});
Object.defineProperty(exports, "GraphQLBSONDecimal", {
  enumerable: true,
  get: function () {
    return _bsonDecimal.default;
  }
});
exports.default = void 0;

var _composeWithMongoose = require("./composeWithMongoose");

Object.keys(_composeWithMongoose).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _composeWithMongoose[key];
    }
  });
});

var _mongoid = _interopRequireDefault(require("./types/mongoid"));

var _bsonDecimal = _interopRequireDefault(require("./types/bsonDecimal"));

var _composeWithMongooseDiscriminators = require("./composeWithMongooseDiscriminators");

Object.keys(_composeWithMongooseDiscriminators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _composeWithMongooseDiscriminators[key];
    }
  });
});

var _fieldsConverter = require("./fieldsConverter");

Object.keys(_fieldsConverter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fieldsConverter[key];
    }
  });
});

var _resolvers = require("./resolvers");

Object.keys(_resolvers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _resolvers[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _composeWithMongoose.composeWithMongoose;
exports.default = _default;