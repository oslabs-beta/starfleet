import { ObjectTypeComposer } from 'graphql-compose';
import { ComposeWithPaginationOpts } from './paginationResolver';
export declare function composeWithPagination<TSource, TContext>(typeComposer: ObjectTypeComposer<TSource, TContext>, opts: ComposeWithPaginationOpts): ObjectTypeComposer<TSource, TContext>;
