"use strict";

var _graphqlCompose = require("graphql-compose");

var _mongoose = require("mongoose");

var _userModel = require("../../__mocks__/userModel");

var _connection = _interopRequireWildcard(require("../connection"));

var _findMany = _interopRequireDefault(require("../findMany"));

var _count = _interopRequireDefault(require("../count"));

var _fieldsConverter = require("../../fieldsConverter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

beforeAll(() => _userModel.UserModel.base.connect());
afterAll(() => _userModel.UserModel.base.disconnect());
describe('connection() resolver', () => {
  describe('prepareCursorQuery()', () => {
    let rawQuery;
    describe('single index', () => {
      const cursorData = {
        a: 10
      };
      const indexKeys = Object.keys(cursorData);
      it('asc order', () => {
        const indexData = {
          a: 1
        }; // for beforeCursorQuery

        rawQuery = {};
        (0, _connection.prepareCursorQuery)(rawQuery, cursorData, indexKeys, indexData, '$lt', '$gt');
        expect(rawQuery).toEqual({
          a: {
            $lt: 10
          }
        }); // for afterCursorQuery

        rawQuery = {};
        (0, _connection.prepareCursorQuery)(rawQuery, cursorData, indexKeys, indexData, '$gt', '$lt');
        expect(rawQuery).toEqual({
          a: {
            $gt: 10
          }
        });
      });
      it('desc order', () => {
        const indexData = {
          a: -1
        }; // for beforeCursorQuery

        rawQuery = {};
        (0, _connection.prepareCursorQuery)(rawQuery, cursorData, indexKeys, indexData, '$lt', '$gt');
        expect(rawQuery).toEqual({
          a: {
            $gt: 10
          }
        }); // for afterCursorQuery

        rawQuery = {};
        (0, _connection.prepareCursorQuery)(rawQuery, cursorData, indexKeys, indexData, '$gt', '$lt');
        expect(rawQuery).toEqual({
          a: {
            $lt: 10
          }
        });
      });
    });
    describe('compound index', () => {
      const cursorData = {
        a: 10,
        b: 100,
        c: 1000
      };
      const indexKeys = Object.keys(cursorData);
      it('asc order', () => {
        const indexData = {
          a: 1,
          b: -1,
          c: 1
        }; // for beforeCursorQuery

        rawQuery = {};
        (0, _connection.prepareCursorQuery)(rawQuery, cursorData, indexKeys, indexData, '$lt', '$gt');
        expect(rawQuery).toEqual({
          $or: [{
            a: 10,
            b: 100,
            c: {
              $lt: 1000
            }
          }, {
            a: 10,
            b: {
              $gt: 100
            }
          }, {
            a: {
              $lt: 10
            }
          }]
        }); // for afterCursorQuery

        rawQuery = {};
        (0, _connection.prepareCursorQuery)(rawQuery, cursorData, indexKeys, indexData, '$gt', '$lt');
        expect(rawQuery).toEqual({
          $or: [{
            a: 10,
            b: 100,
            c: {
              $gt: 1000
            }
          }, {
            a: 10,
            b: {
              $lt: 100
            }
          }, {
            a: {
              $gt: 10
            }
          }]
        });
      });
      it('desc order', () => {
        const indexData = {
          a: -1,
          b: 1,
          c: -1
        }; // for beforeCursorQuery

        rawQuery = {};
        (0, _connection.prepareCursorQuery)(rawQuery, cursorData, indexKeys, indexData, '$lt', '$gt');
        expect(rawQuery).toEqual({
          $or: [{
            a: 10,
            b: 100,
            c: {
              $gt: 1000
            }
          }, {
            a: 10,
            b: {
              $lt: 100
            }
          }, {
            a: {
              $gt: 10
            }
          }]
        }); // for afterCursorQuery

        rawQuery = {};
        (0, _connection.prepareCursorQuery)(rawQuery, cursorData, indexKeys, indexData, '$gt', '$lt');
        expect(rawQuery).toEqual({
          $or: [{
            a: 10,
            b: 100,
            c: {
              $lt: 1000
            }
          }, {
            a: 10,
            b: {
              $gt: 100
            }
          }, {
            a: {
              $lt: 10
            }
          }]
        });
      });
    });
  });
  describe('connection() -> ', () => {
    let UserTC;
    beforeEach(() => {
      _graphqlCompose.schemaComposer.clear();

      UserTC = (0, _fieldsConverter.convertModelToGraphQL)(_userModel.UserModel, 'User', _graphqlCompose.schemaComposer);
      UserTC.setResolver('findMany', (0, _findMany.default)(_userModel.UserModel, UserTC));
      UserTC.setResolver('count', (0, _count.default)(_userModel.UserModel, UserTC));
    });
    let user1;
    let user2;
    beforeEach(async () => {
      await _userModel.UserModel.deleteMany({});
      user1 = new _userModel.UserModel({
        name: 'userName1',
        skills: ['js', 'ruby', 'php', 'python'],
        gender: 'male',
        relocation: true
      });
      user2 = new _userModel.UserModel({
        name: 'userName2',
        skills: ['go', 'erlang'],
        gender: 'female',
        relocation: false
      });
      await user1.save();
      await user2.save();
    });
    it('should return Resolver object', () => {
      const resolver = (0, _connection.default)(_userModel.UserModel, UserTC);
      expect(resolver).toBeInstanceOf(_graphqlCompose.Resolver);
    });
    it('Resolver object should have `filter` arg', () => {
      const resolver = (0, _connection.default)(_userModel.UserModel, UserTC);
      if (!resolver) throw new Error('Connection resolveris undefined');
      expect(resolver.hasArg('filter')).toBe(true);
    });
    it('Resolver object should have `sort` arg', () => {
      const resolver = (0, _connection.default)(_userModel.UserModel, UserTC);
      if (!resolver) throw new Error('Connection resolveris undefined');
      expect(resolver.hasArg('sort')).toBe(true);
    });
    it('Resolver object should have `connection args', () => {
      const resolver = (0, _connection.default)(_userModel.UserModel, UserTC);
      if (!resolver) throw new Error('Connection resolveris undefined');
      expect(resolver.hasArg('first')).toBe(true);
      expect(resolver.hasArg('last')).toBe(true);
      expect(resolver.hasArg('before')).toBe(true);
      expect(resolver.hasArg('after')).toBe(true);
    });
    describe('Resolver.resolve():Promise', () => {
      it('should be fulfilled Promise', async () => {
        const resolver = (0, _connection.default)(_userModel.UserModel, UserTC);
        if (!resolver) throw new Error('Connection resolveris undefined');
        const result = resolver.resolve({
          args: {
            first: 20
          }
        });
        await expect(result).resolves.toBeDefined();
      });
      it('should return array of documents in `edges`', async () => {
        const resolver = (0, _connection.default)(_userModel.UserModel, UserTC);
        if (!resolver) throw new Error('Connection resolveris undefined');
        const result = await resolver.resolve({
          args: {
            first: 20
          }
        });
        expect(result.edges).toBeInstanceOf(Array);
        expect(result.edges).toHaveLength(2);
        expect(result.edges.map(d => d.node.name)).toEqual(expect.arrayContaining([user1.name, user2.name]));
      });
      it('should limit records', async () => {
        const resolver = (0, _connection.default)(_userModel.UserModel, UserTC);
        if (!resolver) throw new Error('Connection resolveris undefined');
        const result = await resolver.resolve({
          args: {
            first: 1
          }
        });
        expect(result.edges).toBeInstanceOf(Array);
        expect(result.edges).toHaveLength(1);
      });
      it('should sort records', async () => {
        const resolver = (0, _connection.default)(_userModel.UserModel, UserTC);
        if (!resolver) throw new Error('Connection resolveris undefined');
        const result1 = await resolver.resolve({
          args: {
            sort: {
              _id: 1
            },
            first: 1
          }
        });
        const result2 = await resolver.resolve({
          args: {
            sort: {
              _id: -1
            },
            first: 1
          }
        });
        expect(`${result1.edges[0].node._id}`).not.toBe(`${result2.edges[0].node._id}`);
      });
      it('should return mongoose documents', async () => {
        const resolver = (0, _connection.default)(_userModel.UserModel, UserTC);
        if (!resolver) throw new Error('Connection resolveris undefined');
        const result = await resolver.resolve({
          args: {
            first: 20
          }
        });
        expect(result.edges[0].node).toBeInstanceOf(_userModel.UserModel);
        expect(result.edges[1].node).toBeInstanceOf(_userModel.UserModel);
      });
      it('should call `beforeQuery` method with non-executed `query` as arg', async () => {
        const mongooseActions = [];

        _userModel.UserModel.base.set('debug', function debugMongoose(...args) {
          mongooseActions.push(args);
        });

        const resolver = (0, _connection.default)(_userModel.UserModel, UserTC);

        if (!resolver) {
          throw new Error('resolver is undefined');
        }

        const result = await resolver.resolve({
          args: {},
          beforeQuery: (query, rp) => {
            expect(query).toBeInstanceOf(_mongoose.Query);
            expect(rp.model).toBe(_userModel.UserModel); // modify query before execution

            return query.where({
              _id: user1.id
            }).limit(1989);
          }
        });
        expect(mongooseActions).toEqual([['users', 'find', {
          _id: user1._id
        }, {
          limit: 1989,
          projection: {}
        }]]);
        expect(result.edges).toHaveLength(1);
      });
      it('should override result with `beforeQuery`', async () => {
        const resolver = (0, _connection.default)(_userModel.UserModel, UserTC);

        if (!resolver) {
          throw new Error('resolver is undefined');
        }

        const result = await resolver.resolve({
          args: {},
          beforeQuery: (query, rp) => {
            expect(query).toBeInstanceOf(_mongoose.Query);
            expect(rp.model).toBe(_userModel.UserModel);
            return [{
              overrides: true
            }];
          }
        });
        expect(result).toHaveProperty('edges.0.node', {
          overrides: true
        });
      });
    });
  });
});