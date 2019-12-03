"use strict";

exports.__esModule = true;
exports.sortHelper = sortHelper;
exports.getSortTypeFromModel = getSortTypeFromModel;
exports.sortHelperArgs = void 0;

var _getIndexesFromModel = require("../../utils/getIndexesFromModel");

/* eslint-disable no-use-before-define */
const sortHelperArgs = (tc, model, opts) => {
  if (!tc || tc.constructor.name !== 'ObjectTypeComposer') {
    throw new Error('First arg for sortHelperArgs() should be instance of ObjectTypeComposer.');
  }

  if (!model || !model.modelName || !model.schema) {
    throw new Error('Second arg for sortHelperArgs() should be instance of Mongoose Model.');
  }

  if (!opts || !opts.sortTypeName) {
    throw new Error('You should provide non-empty `sortTypeName` in options for sortHelperArgs().');
  }

  const gqSortType = getSortTypeFromModel(opts.sortTypeName, model, tc.schemaComposer);
  return {
    sort: {
      type: gqSortType
    }
  };
};

exports.sortHelperArgs = sortHelperArgs;

function sortHelper(resolveParams) {
  const sort = resolveParams && resolveParams.args && resolveParams.args.sort;

  if (sort && typeof sort === 'object' && Object.keys(sort).length > 0) {
    resolveParams.query = resolveParams.query.sort(sort); // eslint-disable-line
  }
}

function getSortTypeFromModel(typeName, model, schemaComposer) {
  return schemaComposer.getOrCreateETC(typeName, etc => {
    const indexes = (0, _getIndexesFromModel.extendByReversedIndexes)((0, _getIndexesFromModel.getIndexesFromModel)(model));
    const fields = {};
    indexes.forEach(indexData => {
      const keys = Object.keys(indexData);
      let name = keys.join('__').toUpperCase().replace(/[^_a-zA-Z0-9]/gi, '__');

      if (indexData[keys[0]] === 1) {
        name = `${name}_ASC`;
      } else if (indexData[keys[0]] === -1) {
        name = `${name}_DESC`;
      }

      fields[name] = {
        name,
        value: indexData
      };
    });
    etc.setFields(fields);
  });
}