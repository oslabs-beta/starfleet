import { SchemaComposer, ObjectTypeComposer } from 'graphql-compose';
export declare function preparePaginationInfoTC<TContext>(schemaComposer: SchemaComposer<TContext>): ObjectTypeComposer<any, TContext>;
export declare function preparePaginationTC<TSource, TContext>(tc: ObjectTypeComposer<TSource, TContext>, resolverName?: string): ObjectTypeComposer<TSource, TContext>;
