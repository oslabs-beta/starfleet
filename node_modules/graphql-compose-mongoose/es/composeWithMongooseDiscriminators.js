import { schemaComposer as globalSchemaComposer } from 'graphql-compose';
import { DiscriminatorTypeComposer } from './discriminators';
export * from './discriminators';
export function composeWithMongooseDiscriminators(baseModel, // === MongooseModel,
opts) {
  const m = baseModel;
  const sc = (opts ? opts.schemaComposer : null) || globalSchemaComposer;
  return DiscriminatorTypeComposer.createFromModel(m, sc, opts);
}