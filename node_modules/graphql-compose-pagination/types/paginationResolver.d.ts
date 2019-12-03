import { ProjectionType, Resolver, ObjectTypeComposer } from 'graphql-compose';
import { GraphQLResolveInfo } from 'graphql-compose/lib/graphql';
export declare const DEFAULT_RESOLVER_NAME = "pagination";
export declare const DEFAULT_PER_PAGE = 20;
export interface ComposeWithPaginationOpts {
    paginationResolverName?: string;
    findResolverName: string;
    countResolverName: string;
    perPage?: number;
}
export interface PaginationResolveParams<TContext> {
    source: any;
    args: {
        page?: number;
        perPage?: number;
        sort?: any;
        filter?: {
            [fieldName: string]: any;
        };
        [argName: string]: any;
    };
    context: TContext;
    info: GraphQLResolveInfo;
    projection: ProjectionType;
    [opt: string]: any;
}
export interface PaginationType {
    count: number;
    items: any[];
    pageInfo: PaginationInfoType;
}
export interface PaginationInfoType {
    currentPage: number;
    perPage: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
export declare function preparePaginationResolver<TSource, TContext>(tc: ObjectTypeComposer<TSource, TContext>, opts: ComposeWithPaginationOpts): Resolver<TSource, TContext>;
