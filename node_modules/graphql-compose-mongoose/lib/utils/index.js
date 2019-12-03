"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  isObject: true,
  upperFirst: true,
  toMongoDottedObject: true,
  toMongoFilterDottedObject: true
};
Object.defineProperty(exports, "isObject", {
  enumerable: true,
  get: function () {
    return _graphqlCompose.isObject;
  }
});
Object.defineProperty(exports, "upperFirst", {
  enumerable: true,
  get: function () {
    return _graphqlCompose.upperFirst;
  }
});
Object.defineProperty(exports, "toMongoDottedObject", {
  enumerable: true,
  get: function () {
    return _toMongoDottedObject.toMongoDottedObject;
  }
});
Object.defineProperty(exports, "toMongoFilterDottedObject", {
  enumerable: true,
  get: function () {
    return _toMongoDottedObject.toMongoFilterDottedObject;
  }
});

var _graphqlCompose = require("graphql-compose");

var _toMongoDottedObject = require("./toMongoDottedObject");

var _getIndexesFromModel = require("./getIndexesFromModel");

Object.keys(_getIndexesFromModel).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getIndexesFromModel[key];
    }
  });
});