"use strict";

var _graphqlCompose = require("graphql-compose");

var _graphql = require("graphql-compose/lib/graphql");

var _userModel = require("../../__mocks__/userModel");

var _findOne = _interopRequireDefault(require("../findOne"));

var _fieldsConverter = require("../../fieldsConverter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

beforeAll(() => _userModel.UserModel.base.connect());
afterAll(() => _userModel.UserModel.base.disconnect());
let UserTC;
let user1;
let user2;
beforeEach(async () => {
  _graphqlCompose.schemaComposer.clear();

  UserTC = (0, _fieldsConverter.convertModelToGraphQL)(_userModel.UserModel, 'User', _graphqlCompose.schemaComposer);
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
describe('findOne() ->', () => {
  it('should return Resolver object', () => {
    const resolver = (0, _findOne.default)(_userModel.UserModel, UserTC);
    expect(resolver).toBeInstanceOf(_graphqlCompose.Resolver);
  });
  describe('Resolver.args', () => {
    it('should have `filter` arg', () => {
      const resolver = (0, _findOne.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('filter')).toBe(true);
    });
    it('should have `filter` arg only with indexed fields', async () => {
      const resolver = (0, _findOne.default)(_userModel.UserModel, UserTC, {
        filter: {
          onlyIndexed: true,
          operators: false
        }
      });
      expect(resolver.getArgITC('filter').getFieldNames()).toEqual(expect.arrayContaining(['_id', 'name', 'employment']));
    });
    it('should have `filter` arg with required `name` field', async () => {
      const resolver = (0, _findOne.default)(_userModel.UserModel, UserTC, {
        filter: {
          requiredFields: 'name'
        }
      });
      expect(resolver.getArgITC('filter').getFieldType('name')).toBeInstanceOf(_graphql.GraphQLNonNull);
    });
    it('should have `skip` arg', () => {
      const resolver = (0, _findOne.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('skip')).toBe(true);
    });
    it('should have `sort` arg', () => {
      const resolver = (0, _findOne.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('sort')).toBe(true);
    });
  });
  describe('Resolver.resolve():Promise', () => {
    it('should be fulfilled promise', async () => {
      const result = (0, _findOne.default)(_userModel.UserModel, UserTC).resolve({});
      await expect(result).resolves.toBeDefined();
    });
    it('should return one document if args is empty', async () => {
      const result = await (0, _findOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {}
      });
      expect(typeof result).toBe('object');
      expect([user1.name, user2.name]).toContain(result.name);
    });
    it('should return document if provided existed id', async () => {
      const result = await (0, _findOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          id: user1._id
        }
      });
      expect(result.name).toBe(user1.name);
    });
    it('should skip records', async () => {
      const result = await (0, _findOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          skip: 2000
        }
      });
      expect(result).toBeNull();
    });
    it('should sort records', async () => {
      const result1 = await (0, _findOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          sort: {
            _id: 1
          }
        }
      });
      const result2 = await (0, _findOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          sort: {
            _id: -1
          }
        }
      });
      expect(`${result1._id}`).not.toBe(`${result2._id}`);
    });
    it('should return mongoose document', async () => {
      const result = await (0, _findOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          _id: user1._id
        }
      });
      expect(result).toBeInstanceOf(_userModel.UserModel);
    });
    it('should call `beforeQuery` method with non-executed `query` as arg', async () => {
      const result = await (0, _findOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          _id: user1._id
        },

        beforeQuery(query, rp) {
          expect(rp.model).toBe(_userModel.UserModel);
          expect(rp.query).toHaveProperty('exec');
          return query.where({
            _id: user2._id
          });
        }

      });
      expect(result._id).toEqual(user2._id);
    });
  });
  describe('Resolver.getType()', () => {
    it('should return model type', () => {
      const outputType = (0, _findOne.default)(_userModel.UserModel, UserTC).getType();
      expect(outputType).toBe(UserTC.getType());
    });
  });
});