function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/* eslint-disable no-use-before-define */
import { ObjectTypeComposer } from 'graphql-compose';
import GraphQLMongoID from '../../types/mongoid';
import { isObject, toMongoFilterDottedObject, getIndexedFieldNamesForGraphQL } from '../../utils';
import { addFilterOperators, processFilterOperators } from './filterOperators';
// for merging, discriminators merge-able only
export const getFilterHelperArgOptsMap = () => ({
  // filterTypeName? : 'string'
  isRequired: 'boolean',
  onlyIndexed: 'boolean',
  requiredFields: ['string', 'string[]'],
  operators: ['FilterOperatorsOptsMap', 'boolean'],
  removeFields: ['string', 'string[]']
});
export const filterHelperArgs = (typeComposer, model, opts) => {
  if (!(typeComposer instanceof ObjectTypeComposer)) {
    throw new Error('First arg for filterHelperArgs() should be instance of ObjectTypeComposer.');
  }

  if (!model || !model.modelName || !model.schema) {
    throw new Error('Second arg for filterHelperArgs() should be instance of MongooseModel.');
  }

  if (!opts || !opts.filterTypeName) {
    throw new Error('You should provide non-empty `filterTypeName` in options.');
  }

  const removeFields = [];

  if (opts.removeFields) {
    if (Array.isArray(opts.removeFields)) {
      removeFields.push(...opts.removeFields);
    } else {
      removeFields.push(opts.removeFields);
    }
  }

  if (opts.onlyIndexed) {
    const indexedFieldNames = getIndexedFieldNamesForGraphQL(model);
    Object.keys(typeComposer.getFields()).forEach(fieldName => {
      if (indexedFieldNames.indexOf(fieldName) === -1) {
        removeFields.push(fieldName);
      }
    });
  }

  const filterTypeName = opts.filterTypeName;
  const itc = typeComposer.getInputTypeComposer().clone(filterTypeName);
  itc.makeFieldNullable('_id');
  itc.addFields({
    _ids: [GraphQLMongoID]
  });
  itc.removeField(removeFields);

  if (opts.requiredFields) {
    itc.makeFieldNonNull(opts.requiredFields);
  }

  if (itc.getFieldNames().length === 0) {
    return {};
  }

  addFilterOperators(itc, model, opts);
  return {
    filter: {
      type: opts.isRequired ? itc.getTypeNonNull() : itc,
      description: opts.onlyIndexed ? 'Filter only by indexed fields' : 'Filter by fields'
    }
  };
};
export function filterHelper(resolveParams) {
  const filter = resolveParams.args && resolveParams.args.filter;

  if (filter && typeof filter === 'object' && Object.keys(filter).length > 0) {
    const modelFields = resolveParams.query.schema.paths;

    const {
      _ids
    } = filter,
          filterFields = _objectWithoutProperties(filter, ["_ids"]);

    if (_ids && Array.isArray(_ids)) {
      // eslint-disable-next-line
      resolveParams.query = resolveParams.query.where({
        _id: {
          $in: _ids
        }
      });
    }

    processFilterOperators(filterFields);
    const clearedFilter = {};
    Object.keys(filterFields).forEach(key => {
      if (modelFields[key] || key.indexOf('$') === 0) {
        clearedFilter[key] = filterFields[key];
      }
    });

    if (Object.keys(clearedFilter).length > 0) {
      // eslint-disable-next-line
      resolveParams.query = resolveParams.query.where(toMongoFilterDottedObject(clearedFilter));
    }
  }

  if (isObject(resolveParams.rawQuery)) {
    // eslint-disable-next-line
    resolveParams.query = resolveParams.query.where(resolveParams.rawQuery);
  }
}