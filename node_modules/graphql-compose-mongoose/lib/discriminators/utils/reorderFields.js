"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reorderFields = reorderFields;

var _graphqlCompose = require("graphql-compose");

var _DiscriminatorTypeComposer = require("../DiscriminatorTypeComposer");

function reorderFields(modelTC, order, DKey, commonFieldKeys) {
  if (order) {
    if (Array.isArray(order)) {
      modelTC.reorderFields(order);
    } else {
      const newOrder = []; // is child discriminator

      if (modelTC instanceof _graphqlCompose.ObjectTypeComposer && commonFieldKeys) {
        newOrder.push(...commonFieldKeys);
        newOrder.filter(value => value === '_id' || value === DKey);
        newOrder.unshift('_id', DKey);
      } else {
        if (modelTC.getField('_id')) {
          newOrder.push('_id');
        }

        newOrder.push(DKey);
      }

      modelTC.reorderFields(newOrder);
    }
  }

  return modelTC;
}