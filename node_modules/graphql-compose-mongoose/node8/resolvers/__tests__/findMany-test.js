"use strict";

var _graphqlCompose = require("graphql-compose");

var _userModel = require("../../__mocks__/userModel");

var _findMany = _interopRequireDefault(require("../findMany"));

var _fieldsConverter = require("../../fieldsConverter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

beforeAll(() => _userModel.UserModel.base.connect());
afterAll(() => _userModel.UserModel.base.disconnect());
describe('findMany() ->', () => {
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
    const resolver = (0, _findMany.default)(_userModel.UserModel, UserTC);
    expect(resolver).toBeInstanceOf(_graphqlCompose.Resolver);
  });
  it('Resolver object should have `filter` arg', () => {
    const resolver = (0, _findMany.default)(_userModel.UserModel, UserTC);
    expect(resolver.hasArg('filter')).toBe(true);
  });
  it('Resolver object should have `limit` arg', () => {
    const resolver = (0, _findMany.default)(_userModel.UserModel, UserTC);
    expect(resolver.hasArg('limit')).toBe(true);
  });
  it('Resolver object should have `skip` arg', () => {
    const resolver = (0, _findMany.default)(_userModel.UserModel, UserTC);
    expect(resolver.hasArg('skip')).toBe(true);
  });
  it('Resolver object should have `sort` arg', () => {
    const resolver = (0, _findMany.default)(_userModel.UserModel, UserTC);
    expect(resolver.hasArg('sort')).toBe(true);
  });
  describe('Resolver.resolve():Promise', () => {
    it('should be fulfilled Promise', async () => {
      const result = (0, _findMany.default)(_userModel.UserModel, UserTC).resolve({});
      await expect(result).resolves.toBeDefined();
    });
    it('should return array of documents if args is empty', async () => {
      const result = await (0, _findMany.default)(_userModel.UserModel, UserTC).resolve({});
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result.map(d => d.name)).toEqual(expect.arrayContaining([user1.name, user2.name]));
    });
    it('should limit records', async () => {
      const result = await (0, _findMany.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          limit: 1
        }
      });
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
    });
    it('should skip records', async () => {
      const result = await (0, _findMany.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          skip: 1000
        }
      });
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
    });
    it('should sort records', async () => {
      const result1 = await (0, _findMany.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          sort: {
            _id: 1
          }
        }
      });
      const result2 = await (0, _findMany.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          sort: {
            _id: -1
          }
        }
      });
      expect(`${result1[0]._id}`).not.toBe(`${result2[0]._id}`);
    });
    it('should return mongoose documents', async () => {
      const result = await (0, _findMany.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          limit: 2
        }
      });
      expect(result[0]).toBeInstanceOf(_userModel.UserModel);
      expect(result[1]).toBeInstanceOf(_userModel.UserModel);
    });
    it('should call `beforeQuery` method with non-executed `query` as arg', async () => {
      const result = await (0, _findMany.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          limit: 2
        },

        beforeQuery(query, rp) {
          expect(rp.model).toBe(_userModel.UserModel);
          expect(rp.query).toHaveProperty('exec');
          return [{
            overridden: true
          }];
        }

      });
      expect(result).toEqual([{
        overridden: true
      }]);
    });
  });
});