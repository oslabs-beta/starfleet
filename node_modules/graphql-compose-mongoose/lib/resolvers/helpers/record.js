"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recordHelperArgs = exports.getRecordHelperArgsOptsMap = void 0;

var _graphqlCompose = require("graphql-compose");

// for merging, discriminators merge-able only
const getRecordHelperArgsOptsMap = () => ({
  isRequired: 'boolean',
  removeFields: 'string[]',
  requiredFields: 'string[]'
});

exports.getRecordHelperArgsOptsMap = getRecordHelperArgsOptsMap;

const recordHelperArgs = (tc, opts) => {
  if (!tc || tc.constructor.name !== 'ObjectTypeComposer') {
    throw new Error('First arg for recordHelperArgs() should be instance of ObjectTypeComposer.');
  }

  if (!opts || !opts.recordTypeName) {
    throw new Error('You should provide non-empty `recordTypeName` in options.');
  }

  const recordTypeName = opts.recordTypeName;
  let recordITC;
  const schemaComposer = tc.schemaComposer;

  if (schemaComposer.hasInstance(recordTypeName, _graphqlCompose.InputTypeComposer)) {
    recordITC = schemaComposer.getITC(recordTypeName);
  } else {
    recordITC = tc.getInputTypeComposer().clone(recordTypeName);
  }

  if (opts && opts.removeFields) {
    recordITC.removeField(opts.removeFields);
  }

  if (opts && opts.requiredFields) {
    recordITC.makeRequired(opts.requiredFields);
  }

  return {
    record: {
      type: opts.isRequired ? recordITC.getTypeNonNull() : recordITC
    }
  };
};

exports.recordHelperArgs = recordHelperArgs;