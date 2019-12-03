import { InputTypeComposer } from 'graphql-compose';
// for merging, discriminators merge-able only
export const getRecordHelperArgsOptsMap = () => ({
  isRequired: 'boolean',
  removeFields: 'string[]',
  requiredFields: 'string[]'
});
export const recordHelperArgs = (tc, opts) => {
  if (!tc || tc.constructor.name !== 'ObjectTypeComposer') {
    throw new Error('First arg for recordHelperArgs() should be instance of ObjectTypeComposer.');
  }

  if (!opts || !opts.recordTypeName) {
    throw new Error('You should provide non-empty `recordTypeName` in options.');
  }

  const recordTypeName = opts.recordTypeName;
  let recordITC;
  const schemaComposer = tc.schemaComposer;

  if (schemaComposer.hasInstance(recordTypeName, InputTypeComposer)) {
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