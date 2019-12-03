/* @flow */

import { ObjectTypeComposer } from 'graphql-compose';
import { prepareConnectionResolver } from './connectionResolver';
import type { ComposeWithConnectionOpts } from './connectionResolver';

export function composeWithConnection<TSource, TContext>(
  typeComposer: ObjectTypeComposer<TSource, TContext>,
  opts: ComposeWithConnectionOpts
): ObjectTypeComposer<TSource, TContext> {
  if (!(typeComposer instanceof ObjectTypeComposer)) {
    throw new Error('You should provide ObjectTypeComposer instance to composeWithRelay method');
  }

  if (!opts) {
    throw new Error('You should provide non-empty options to composeWithConnection');
  }

  const resolverName = opts.connectionResolverName || 'connection';
  if (typeComposer.hasResolver(resolverName)) {
    return typeComposer;
  }

  const resolver = prepareConnectionResolver(typeComposer, opts);

  typeComposer.setResolver(resolverName, resolver);
  return typeComposer;
}
