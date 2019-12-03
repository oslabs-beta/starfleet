"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeChildTC = composeChildTC;

var _graphqlCompose = require("graphql-compose");

var _prepareChildResolvers = require("./prepareChildResolvers");

var _reorderFields = require("./utils/reorderFields");

// copy all baseTypeComposer fields to childTC
// these are the fields before calling discriminator
function copyBaseTCFieldsToChildTC(baseDTC, childTC) {
  const baseFields = baseDTC.getFieldNames();
  const childFields = childTC.getFieldNames();

  for (const field of baseFields) {
    const isFieldExists = childFields.find(fld => fld === field);

    if (isFieldExists) {
      childTC.extendField(field, {
        type: baseDTC.getField(field).type
      });
    } else {
      childTC.setField(field, baseDTC.getField(field));
    }
  }

  return childTC;
}

function composeChildTC(baseDTC, childTC, opts) {
  const composedChildTC = copyBaseTCFieldsToChildTC(baseDTC, childTC);
  composedChildTC.addInterface(baseDTC.getDInterface());
  (0, _prepareChildResolvers.prepareChildResolvers)(baseDTC, composedChildTC, opts);
  (0, _reorderFields.reorderFields)(composedChildTC, opts.reorderFields, baseDTC.getDKey(), baseDTC.getFieldNames());
  return composedChildTC;
}