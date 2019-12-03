"use strict";

var _mongoose = require("mongoose");

var _graphqlCompose = require("graphql-compose");

var _graphql = require("graphql-compose/lib/graphql");

var _userModel = require("../../__mocks__/userModel");

var _updateMany = _interopRequireDefault(require("../updateMany"));

var _fieldsConverter = require("../../fieldsConverter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

beforeAll(() => _userModel.UserModel.base.connect());
afterAll(() => _userModel.UserModel.base.disconnect());
describe('updateMany() ->', () => {
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
      relocation: true
    });
    await user1.save();
    await user2.save();
  });
  it('should return Resolver object', () => {
    const resolver = (0, _updateMany.default)(_userModel.UserModel, UserTC);
    expect(resolver).toBeInstanceOf(_graphqlCompose.Resolver);
  });
  describe('Resolver.args', () => {
    it('should have `filter` arg', () => {
      const resolver = (0, _updateMany.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('filter')).toBe(true);
    });
    it('should have `limit` arg', () => {
      const resolver = (0, _updateMany.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('limit')).toBe(true);
    });
    it('should have `skip` arg', () => {
      const resolver = (0, _updateMany.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('skip')).toBe(true);
    });
    it('should have `sort` arg', () => {
      const resolver = (0, _updateMany.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('sort')).toBe(true);
    });
    it('should have `record` arg', () => {
      const resolver = (0, _updateMany.default)(_userModel.UserModel, UserTC);
      const argConfig = resolver.getArgConfig('record');
      expect(argConfig.type).toBeInstanceOf(_graphql.GraphQLNonNull);
      expect(argConfig.type.ofType.name).toBe('UpdateManyUserInput');
    });
  });
  describe('Resolver.resolve():Promise', () => {
    it('should be promise', () => {
      const result = (0, _updateMany.default)(_userModel.UserModel, UserTC).resolve({});
      expect(result).toBeInstanceOf(Promise);
      result.catch(() => 'catch error if appear, hide it from mocha');
    });
    it('should rejected with Error if args.record is empty', async () => {
      const result = (0, _updateMany.default)(_userModel.UserModel, UserTC).resolve({
        args: {}
      });
      await expect(result).rejects.toMatchSnapshot();
    });
    it('should change data via args.record in database', async () => {
      const checkedName = 'nameForMongoDB';
      await (0, _updateMany.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          },
          record: {
            name: checkedName
          }
        }
      });
      await expect(_userModel.UserModel.findOne({
        _id: user1._id
      })).resolves.toEqual(expect.objectContaining({
        name: checkedName
      }));
    });
    it('should return payload.numAffected', async () => {
      const result = await (0, _updateMany.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          record: {
            gender: 'female'
          }
        }
      });
      expect(result.numAffected).toBe(2);
    });
    it('should call `beforeQuery` method with non-executed `query` as arg', async () => {
      let beforeQueryCalled = false;
      const result = await (0, _updateMany.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          record: {
            gender: 'female'
          }
        },
        beforeQuery: (query, rp) => {
          expect(query).toBeInstanceOf(_mongoose.Query);
          expect(rp.model).toBe(_userModel.UserModel);
          beforeQueryCalled = true; // modify query before execution

          return query.where({
            _id: user1.id
          });
        }
      });
      expect(beforeQueryCalled).toBe(true);
      expect(result.numAffected).toBe(1);
    });
  });
  describe('Resolver.getType()', () => {
    it('should have correct output type name', () => {
      const outputType = (0, _updateMany.default)(_userModel.UserModel, UserTC).getType();
      expect(outputType.name).toBe(`UpdateMany${UserTC.getTypeName()}Payload`);
    });
    it('should have numAffected field', () => {
      const outputType = (0, _updateMany.default)(_userModel.UserModel, UserTC).getType();

      const numAffectedField = _graphqlCompose.schemaComposer.createObjectTC(outputType).getFieldConfig('numAffected');

      expect(numAffectedField.type).toBe(_graphql.GraphQLInt);
    });
    it('should reuse existed outputType', () => {
      const outputTypeName = `UpdateMany${UserTC.getTypeName()}Payload`;

      const existedType = _graphqlCompose.schemaComposer.createObjectTC(outputTypeName);

      _graphqlCompose.schemaComposer.set(outputTypeName, existedType);

      const outputType = (0, _updateMany.default)(_userModel.UserModel, UserTC).getType();
      expect(outputType).toBe(existedType.getType());
    });
  });
});