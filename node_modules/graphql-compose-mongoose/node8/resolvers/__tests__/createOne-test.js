"use strict";

var _graphqlCompose = require("graphql-compose");

var _graphql = require("graphql-compose/lib/graphql");

var _userModel = require("../../__mocks__/userModel");

var _createOne = _interopRequireDefault(require("../createOne"));

var _fieldsConverter = require("../../fieldsConverter");

var _mongoid = _interopRequireDefault(require("../../types/mongoid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
beforeAll(() => _userModel.UserModel.base.connect());
afterAll(() => _userModel.UserModel.base.disconnect());
describe('createOne() ->', () => {
  let UserTC;
  beforeEach(() => {
    _graphqlCompose.schemaComposer.clear();

    UserTC = (0, _fieldsConverter.convertModelToGraphQL)(_userModel.UserModel, 'User', _graphqlCompose.schemaComposer);
    UserTC.setRecordIdFn(source => source ? `${source._id}` : '');
  });
  beforeEach(async () => {
    await _userModel.UserModel.deleteMany({});
  });
  it('should return Resolver object', () => {
    const resolver = (0, _createOne.default)(_userModel.UserModel, UserTC);
    expect(resolver).toBeInstanceOf(_graphqlCompose.Resolver);
  });
  describe('Resolver.args', () => {
    it('should have required `record` arg', () => {
      const resolver = (0, _createOne.default)(_userModel.UserModel, UserTC);
      const argConfig = resolver.getArgConfig('record');
      expect(argConfig.type).toBeInstanceOf(_graphql.GraphQLNonNull);
      expect(argConfig.type.ofType.name).toBe('CreateOneUserInput');
    });
  });
  describe('Resolver.resolve():Promise', () => {
    it('should be promise', () => {
      const result = (0, _createOne.default)(_userModel.UserModel, UserTC).resolve({});
      expect(result).toBeInstanceOf(Promise);
      result.catch(() => 'catch error if appear, hide it from mocha');
    });
    it('should rejected with Error if args.record is empty', async () => {
      const result = (0, _createOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {}
      });
      await expect(result).rejects.toMatchSnapshot();
    });
    it('should return payload.recordId', async () => {
      const result = await (0, _createOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          record: {
            name: 'newName'
          }
        }
      });
      expect(result.recordId).toBeTruthy();
    });
    it('should create document with args.record', async () => {
      const result = await (0, _createOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          record: {
            name: 'newName'
          }
        }
      });
      expect(result.record.name).toBe('newName');
    });
    it('should save document to database', async () => {
      const checkedName = 'nameForMongoDB';
      const res = await (0, _createOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          record: {
            name: checkedName
          }
        }
      });
      const doc = await _userModel.UserModel.collection.findOne({
        _id: res.record._id
      });
      expect(doc.name).toBe(checkedName);
    });
    it('should return payload.record', async () => {
      const result = await (0, _createOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          record: {
            name: 'NewUser'
          }
        }
      });
      expect(result.record.id).toBe(result.recordId);
    });
    it('should return mongoose document', async () => {
      const result = await (0, _createOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          record: {
            name: 'NewUser'
          }
        }
      });
      expect(result.record).toBeInstanceOf(_userModel.UserModel);
    });
    it('should call `beforeRecordMutate` method with created `record` and `resolveParams` as args', async () => {
      const result = await (0, _createOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          record: {
            name: 'NewUser'
          }
        },
        context: {
          ip: '1.1.1.1'
        },
        beforeRecordMutate: (record, rp) => {
          record.name = 'OverridedName';
          record.someDynamic = rp.context.ip;
          return record;
        }
      });
      expect(result.record).toBeInstanceOf(_userModel.UserModel);
      expect(result.record.name).toBe('OverridedName');
      expect(result.record.someDynamic).toBe('1.1.1.1');
    });
  });
  describe('Resolver.getType()', () => {
    it('should have correct output type name', () => {
      const outputType = (0, _createOne.default)(_userModel.UserModel, UserTC).getType();
      expect(outputType.name).toBe(`CreateOne${UserTC.getTypeName()}Payload`);
    });
    it('should have recordId field', () => {
      const outputType = (0, _createOne.default)(_userModel.UserModel, UserTC).getType();

      const recordIdField = _graphqlCompose.schemaComposer.createObjectTC(outputType).getFieldConfig('recordId');

      expect(recordIdField.type).toBe(_mongoid.default);
    });
    it('should have record field', () => {
      const outputType = (0, _createOne.default)(_userModel.UserModel, UserTC).getType();

      const recordField = _graphqlCompose.schemaComposer.createObjectTC(outputType).getFieldConfig('record');

      expect(recordField.type).toBe(UserTC.getType());
    });
    it('should reuse existed outputType', () => {
      const outputTypeName = `CreateOne${UserTC.getTypeName()}Payload`;

      const existedType = _graphqlCompose.schemaComposer.createObjectTC(outputTypeName);

      _graphqlCompose.schemaComposer.set(outputTypeName, existedType);

      const outputType = (0, _createOne.default)(_userModel.UserModel, UserTC).getType();
      expect(outputType).toBe(existedType.getType());
    });
  });
});