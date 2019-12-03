import connection from './connection';
import count from './count';
import createMany from './createMany';
import createOne from './createOne';
import findById from './findById';
import findByIds from './findByIds';
import findMany from './findMany';
import findOne from './findOne';
import pagination from './pagination';
import removeById from './removeById';
import removeMany from './removeMany';
import removeOne from './removeOne';
import updateById from './updateById';
import updateMany from './updateMany';
import updateOne from './updateOne';
export { findById, findByIds, findOne, findMany, updateById, updateOne, updateMany, removeById, removeOne, removeMany, createOne, createMany, count, pagination, connection };
export function getAvailableNames() {
  return ['findById', 'findByIds', 'findOne', 'findMany', 'updateById', 'updateOne', 'updateMany', 'removeById', 'removeOne', 'removeMany', 'createOne', 'createMany', 'count', 'pagination', // should be defined after `findMany` and `count` resolvers
  'connection' // should be defined after `findMany` and `count` resolvers
  ];
} // Enum MongooseComposeResolvers

export const EMCResolvers = {
  findById: 'findById',
  findByIds: 'findByIds',
  findOne: 'findOne',
  findMany: 'findMany',
  updateById: 'updateById',
  updateOne: 'updateOne',
  updateMany: 'updateMany',
  removeById: 'removeById',
  removeOne: 'removeOne',
  removeMany: 'removeMany',
  createOne: 'createOne',
  createMany: 'createMany',
  count: 'count',
  connection: 'connection',
  pagination: 'pagination'
};