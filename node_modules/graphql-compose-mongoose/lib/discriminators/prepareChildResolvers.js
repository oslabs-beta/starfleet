"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareChildResolvers = prepareChildResolvers;

var _DiscriminatorTypeComposer = require("./DiscriminatorTypeComposer");

var _resolvers = require("../resolvers");

// set the DKey as a query on filter, also project it
// Also look at it like setting for filters, makes sure to limit
// query to child type
function setQueryDKey(resolver, childTC, DKey, fromField) {
  if (resolver) {
    resolver.wrapResolve(next => resolve => {
      const DName = childTC.getTypeName();
      /* eslint no-param-reassign: 0 */

      resolve.args = resolve.args ? resolve.args : {};
      resolve.projection = resolve.projection ? resolve.projection : {};

      if (fromField === 'records') {
        resolve.args[fromField] = resolve.args[fromField] || [];

        for (const record of resolve.args[fromField]) {
          record[DKey] = DName;
        }
      } else if (fromField) {
        resolve.args[fromField] = resolve.args[fromField] ? resolve.args[fromField] : {};
        resolve.args[fromField][DKey] = DName;
      } else {
        resolve.args[DKey] = DName;
      }

      resolve.projection[DKey] = 1;
      /* eslint no-param-reassign: 1 */

      return next(resolve);
    });
  }
} // hide the DKey on the filter or record


function hideDKey(resolver, childTC, DKey, fromField) {
  if (Array.isArray(fromField)) {
    for (const field of fromField) {
      hideDKey(resolver, childTC, DKey, field);
    }
  } else if (fromField && resolver.hasArg(fromField)) {
    const fieldTC = resolver.getArgITC(fromField);

    if (fieldTC) {
      fieldTC.removeField(DKey);
    }
  } else {
    resolver.removeArg(DKey);
  }
} // Set baseDTC resolver argTypes on childTC fields shared with DInterface


function copyResolverArgTypes(resolver, baseDTC, fromArg) {
  if (resolver && baseDTC.hasInputTypeComposer()) {
    if (Array.isArray(fromArg)) {
      for (const field of fromArg) {
        copyResolverArgTypes(resolver, baseDTC, field);
      }
    } else if (fromArg && resolver.hasArg(fromArg)) {
      if (baseDTC.hasResolver(resolver.name) && baseDTC.getResolver(resolver.name).hasArg(fromArg)) {
        const childResolverArgTC = resolver.getArgITC(fromArg);
        const baseResolverArgTC = baseDTC.getResolver(resolver.name).getArgITC(fromArg);
        const baseResolverArgTCFields = baseResolverArgTC.getFieldNames();

        for (const baseArgField of baseResolverArgTCFields) {
          if (childResolverArgTC.hasField(baseArgField) && baseArgField !== '_id') {
            childResolverArgTC.extendField(baseArgField, {
              type: baseResolverArgTC.getField(baseArgField).type
            });
          }
        }
      }
    }
  }
} // reorder input fields resolvers, based on reorderFields opts


function reorderFieldsRecordFilter(resolver, baseDTC, order, fromField) {
  if (order) {
    if (Array.isArray(fromField)) {
      for (const field of fromField) {
        reorderFieldsRecordFilter(resolver, baseDTC, order, field);
      }
    } else if (fromField && resolver.hasArg(fromField)) {
      const argTC = resolver.getArgITC(fromField);

      if (Array.isArray(order)) {
        argTC.reorderFields(order);
      } else {
        const newOrder = []; // is CDTC

        if (baseDTC.hasInputTypeComposer()) {
          newOrder.push(...baseDTC.getInputTypeComposer().getFieldNames());
          newOrder.filter(value => value === '_id' || value === baseDTC.getDKey());
          newOrder.unshift('_id', baseDTC.getDKey());
        }

        argTC.reorderFields(newOrder);
      }
    }
  }
}

function prepareChildResolvers(baseDTC, childTC, opts) {
  for (const resolverName in _resolvers.EMCResolvers) {
    if (_resolvers.EMCResolvers.hasOwnProperty(resolverName) && childTC.hasResolver(resolverName)) {
      const resolver = childTC.getResolver(resolverName);

      switch (resolverName) {
        case _resolvers.EMCResolvers.createOne:
          setQueryDKey(resolver, childTC, baseDTC.getDKey(), 'record');
          hideDKey(resolver, childTC, baseDTC.getDKey(), 'record');
          break;

        case _resolvers.EMCResolvers.createMany:
          setQueryDKey(resolver, childTC, baseDTC.getDKey(), 'records');
          hideDKey(resolver, childTC, baseDTC.getDKey(), 'records');
          break;

        case _resolvers.EMCResolvers.updateById:
          hideDKey(resolver, childTC, baseDTC.getDKey(), 'record');
          break;

        case _resolvers.EMCResolvers.updateOne:
        case _resolvers.EMCResolvers.updateMany:
          setQueryDKey(resolver, childTC, baseDTC.getDKey(), 'filter');
          hideDKey(resolver, childTC, baseDTC.getDKey(), ['record', 'filter']);
          break;

        case _resolvers.EMCResolvers.findOne:
        case _resolvers.EMCResolvers.findMany:
        case _resolvers.EMCResolvers.removeOne:
        case _resolvers.EMCResolvers.removeMany:
        case _resolvers.EMCResolvers.count:
        case _resolvers.EMCResolvers.pagination:
        case _resolvers.EMCResolvers.connection:
          // limit remove scope to DKey
          setQueryDKey(resolver, childTC, baseDTC.getDKey(), 'filter'); // remove DKey Field, remove from filter

          hideDKey(resolver, childTC, baseDTC.getDKey(), 'filter');
          break;

        default:
      }

      copyResolverArgTypes(resolver, baseDTC, ['filter', 'record', 'records']);
      reorderFieldsRecordFilter(resolver, baseDTC, opts.reorderFields, ['filter', 'record', 'records']);
    }
  }
}