"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  composeWithMongooseDiscriminators: true
};
exports.composeWithMongooseDiscriminators = composeWithMongooseDiscriminators;

var _graphqlCompose = require("graphql-compose");

var _discriminators = require("./discriminators");

Object.keys(_discriminators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _discriminators[key];
    }
  });
});

function composeWithMongooseDiscriminators(baseModel, // === MongooseModel,
opts) {
  const m = baseModel;
  const sc = (opts ? opts.schemaComposer : null) || _graphqlCompose.schemaComposer;
  return _discriminators.DiscriminatorTypeComposer.createFromModel(m, sc, opts);
}