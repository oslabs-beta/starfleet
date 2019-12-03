"use strict";

var _graphqlCompose = require("graphql-compose");

var _graphql = require("graphql-compose/lib/graphql");

var _userModel = require("../../__mocks__/userModel");

var _count = _interopRequireDefault(require("../count"));

var _fieldsConverter = require("../../fieldsConverter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

beforeAll(() => _userModel.UserModel.base.connect());
afterAll(() => _userModel.UserModel.base.disconnect());
describe('count() ->', () => {
  let UserTC;
  beforeEach(() => {
    _graphqlCompose.schemaComposer.clear();

    UserTC = (0, _fieldsConverter.convertModelToGraphQL)(_userModel.UserModel, 'User', _graphqlCompose.schemaComposer);
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
    const resolver = (0, _count.default)(_userModel.UserModel, UserTC);
    expect(resolver).toBeInstanceOf(_graphqlCompose.Resolver);
  });
  describe('Resolver.args', () => {
    it('should have `filter` arg', () => {
      const resolver = (0, _count.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('filter')).toBe(true);
    });
  });
  describe('Resolver.resolve():Promise', () => {
    it('should be fulfilled promise', async () => {
      const result = (0, _count.default)(_userModel.UserModel, UserTC).resolve({});
      await expect(result).resolves.toBeDefined();
    });
    it('should return total number of documents in collection if args is empty', async () => {
      const result = await (0, _count.default)(_userModel.UserModel, UserTC).resolve({
        args: {}
      });
      expect(result).toBe(2);
    });
    it('should return number of document by filter data', async () => {
      const result = await (0, _count.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            gender: 'male'
          }
        }
      });
      expect(result).toBe(1);
    });
    it('should call `beforeQuery` method with non-executed `query` as arg', async () => {
      const mongooseActions = [];

      _userModel.UserModel.base.set('debug', function debugMongoose(...args) {
        mongooseActions.push(args);
      });

      const result = await (0, _count.default)(_userModel.UserModel, UserTC).resolve({
        args: {},
        beforeQuery: (query, rp) => {
          expect(query).toHaveProperty('exec');
          expect(rp.model).toBe(_userModel.UserModel); // modify query before execution

          return query.limit(1);
        }
      });
      expect(mongooseActions).toEqual([['users', 'countDocuments', {}, {
        limit: 1
      }]]);
      expect(result).toBe(1);
    });
    it('should override result with `beforeQuery`', async () => {
      const result = await (0, _count.default)(_userModel.UserModel, UserTC).resolve({
        args: {},
        beforeQuery: (query, rp) => {
          expect(query).toHaveProperty('exec');
          expect(rp.model).toBe(_userModel.UserModel);
          return 1989;
        }
      });
      expect(result).toBe(1989);
    });
  });
  describe('Resolver.getType()', () => {
    it('should return GraphQLInt type', () => {
      const outputType = (0, _count.default)(_userModel.UserModel, UserTC).getType();
      expect(outputType).toBe(_graphql.GraphQLInt);
    });
  });
});