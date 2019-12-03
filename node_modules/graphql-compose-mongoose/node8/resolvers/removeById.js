"use strict";

exports.__esModule = true;
exports.default = removeById;

var _findById = _interopRequireDefault(require("./findById"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
function removeById(model, // === MongooseModel
tc, opts) {
  if (!model || !model.modelName || !model.schema) {
    throw new Error('First arg for Resolver removeById() should be instance of Mongoose Model.');
  }

  if (!tc || tc.constructor.name !== 'ObjectTypeComposer') {
    throw new Error('Second arg for Resolver removeById() should be instance of ObjectTypeComposer.');
  }

  const findByIdResolver = (0, _findById.default)(model, tc);
  const outputTypeName = `RemoveById${tc.getTypeName()}Payload`;
  const outputType = tc.schemaComposer.getOrCreateOTC(outputTypeName, t => {
    t.addFields({
      recordId: {
        type: 'MongoID',
        description: 'Removed document ID'
      },
      record: {
        type: tc,
        description: 'Removed document'
      }
    });
  });
  const resolver = tc.schemaComposer.createResolver({
    name: 'removeById',
    kind: 'mutation',
    description: 'Remove one document: ' + '1) Retrieve one document and remove with hooks via findByIdAndRemove. ' + '2) Return removed document.',
    type: outputType,
    args: {
      _id: 'MongoID!'
    },
    resolve: async resolveParams => {
      const args = resolveParams.args || {};

      if (!args._id) {
        throw new Error(`${tc.getTypeName()}.removeById resolver requires args._id value`);
      } // We should get all data for document, cause Mongoose model may have hooks/middlewares
      // which required some fields which not in graphql projection
      // So empty projection returns all fields.


      resolveParams.projection = {};
      let doc = await findByIdResolver.resolve(resolveParams);

      if (resolveParams.beforeRecordMutate) {
        doc = await resolveParams.beforeRecordMutate(doc, resolveParams);
      }

      if (doc) {
        await doc.remove();
        return {
          record: doc,
          recordId: tc.getRecordIdFn()(doc)
        };
      }

      return null;
    }
  });
  return resolver;
}