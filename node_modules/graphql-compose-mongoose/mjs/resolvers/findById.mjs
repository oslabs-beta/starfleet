import { projectionHelper } from './helpers';
import { beforeQueryHelper } from './helpers/beforeQueryHelper';
export default function findById(model, // === MongooseModel
tc, opts) {
  if (!model || !model.modelName || !model.schema) {
    throw new Error('First arg for Resolver findById() should be instance of Mongoose Model.');
  }

  if (!tc || tc.constructor.name !== 'ObjectTypeComposer') {
    throw new Error('Second arg for Resolver findById() should be instance of ObjectTypeComposer.');
  }

  return tc.schemaComposer.createResolver({
    type: tc,
    name: 'findById',
    kind: 'query',
    args: {
      _id: 'MongoID!'
    },
    resolve: resolveParams => {
      const args = resolveParams.args || {};

      if (args._id) {
        resolveParams.query = model.findById(args._id); // eslint-disable-line

        resolveParams.model = model; // eslint-disable-line

        projectionHelper(resolveParams);
        return beforeQueryHelper(resolveParams);
      }

      return Promise.resolve(null);
    }
  });
}