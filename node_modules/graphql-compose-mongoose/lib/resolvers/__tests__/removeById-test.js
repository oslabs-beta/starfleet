"use strict";

var _graphqlCompose = require("graphql-compose");

var _graphql = require("graphql-compose/lib/graphql");

var _userModel = require("../../__mocks__/userModel");

var _removeById = _interopRequireDefault(require("../removeById"));

var _mongoid = _interopRequireDefault(require("../../types/mongoid"));

var _fieldsConverter = require("../../fieldsConverter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
beforeAll(() => _userModel.UserModel.base.connect());
afterAll(() => _userModel.UserModel.base.disconnect());
describe('removeById() ->', () => {
  let UserTC;
  beforeEach(() => {
    _graphqlCompose.schemaComposer.clear();

    UserTC = (0, _fieldsConverter.convertModelToGraphQL)(_userModel.UserModel, 'User', _graphqlCompose.schemaComposer);
    UserTC.setRecordIdFn(source => source ? `${source._id}` : '');
  });
  let user;
  beforeEach(async () => {
    await _userModel.UserModel.deleteMany({});
    user = new _userModel.UserModel({
      name: 'userName1',
      skills: ['js', 'ruby', 'php', 'python'],
      gender: 'male',
      relocation: true
    });
    await user.save();
  });
  it('should return Resolver object', () => {
    const resolver = (0, _removeById.default)(_userModel.UserModel, UserTC);
    expect(resolver).toBeInstanceOf(_graphqlCompose.Resolver);
  });
  describe('Resolver.args', () => {
    it('should have non-null `_id` arg', () => {
      const resolver = (0, _removeById.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('_id')).toBe(true);
      const argConfig = resolver.getArgConfig('_id');
      expect(argConfig.type).toBeInstanceOf(_graphql.GraphQLNonNull);
      expect(argConfig.type.ofType).toBe(_mongoid.default);
    });
  });
  describe('Resolver.resolve():Promise', () => {
    it('should be promise', () => {
      const result = (0, _removeById.default)(_userModel.UserModel, UserTC).resolve({});
      expect(result).toBeInstanceOf(Promise);
      result.catch(() => 'catch error if appear, hide it from mocha');
    });
    it('should rejected with Error if args._id is empty', async () => {
      const result = (0, _removeById.default)(_userModel.UserModel, UserTC).resolve({
        args: {}
      });
      await expect(result).rejects.toMatchSnapshot();
    });
    it('should return payload.recordId', async () => {
      const result = await (0, _removeById.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          _id: user.id
        }
      });
      expect(result.recordId).toBe(user.id);
    });
    it('should remove document in database', async () => {
      await (0, _removeById.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          _id: user.id
        }
      });
      await expect(_userModel.UserModel.findOne({
        _id: user._id
      })).resolves.toBeNull();
    });
    it('should return payload.record', async () => {
      const result = await (0, _removeById.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          _id: user.id
        }
      });
      expect(result.record.id).toBe(user.id);
    });
    it('should pass empty projection to findById and got full document data', async () => {
      const result = await (0, _removeById.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          _id: user.id
        },
        projection: {
          record: {
            name: true
          }
        }
      });
      expect(result.record.id).toBe(user.id);
      expect(result.record.name).toBe(user.name);
      expect(result.record.gender).toBe(user.gender);
    });
    it('should return mongoose document', async () => {
      const result = await (0, _removeById.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          _id: user.id
        }
      });
      expect(result.record).toBeInstanceOf(_userModel.UserModel);
    });
    it('should call `beforeRecordMutate` method with founded `record` and `resolveParams` as args', async () => {
      let beforeMutationId;
      const result = await (0, _removeById.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          _id: user.id
        },
        context: {
          ip: '1.1.1.1'
        },
        beforeRecordMutate: (record, rp) => {
          beforeMutationId = record.id;
          record.someDynamic = rp.context.ip;
          return record;
        }
      });
      expect(result.record).toBeInstanceOf(_userModel.UserModel);
      expect(result.record.someDynamic).toBe('1.1.1.1');
      expect(beforeMutationId).toBe(user.id);
      const empty = await _userModel.UserModel.collection.findOne({
        _id: user._id
      });
      expect(empty).toBe(null);
    });
    it('`beforeRecordMutate` may reject operation', async () => {
      const result = (0, _removeById.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          _id: user.id
        },
        context: {
          readOnly: true
        },
        beforeRecordMutate: (record, rp) => {
          if (rp.context.readOnly) {
            return Promise.reject(new Error('Denied due context ReadOnly'));
          }

          return record;
        }
      });
      await expect(result).rejects.toMatchSnapshot();
      const exist = await _userModel.UserModel.collection.findOne({
        _id: user._id
      });
      expect(exist.name).toBe(user.name);
    });
    it('should call `beforeQuery` method with non-executed `query` as arg', async () => {
      const mongooseActions = [];

      _userModel.UserModel.base.set('debug', function debugMongoose(...args) {
        mongooseActions.push(args);
      });

      const resolveParams = {
        args: {
          _id: 'INVALID_ID'
        },
        context: {
          ip: '1.1.1.1'
        },

        beforeQuery(query, rp) {
          expect(rp.model).toBe(_userModel.UserModel);
          expect(rp.query).toHaveProperty('exec');
          return query.where({
            _id: user._id,
            canDelete: false
          });
        }

      };
      const result = await (0, _removeById.default)(_userModel.UserModel, UserTC).resolve(resolveParams);
      expect(mongooseActions).toEqual([['users', 'findOne', {
        _id: user._id,
        canDelete: false
      }, {
        projection: {}
      }]]);
      expect(result).toBeNull();
    });
  });
  describe('Resolver.getType()', () => {
    it('should have correct output type name', () => {
      const outputType = (0, _removeById.default)(_userModel.UserModel, UserTC).getType();
      expect(outputType.name).toBe(`RemoveById${UserTC.getTypeName()}Payload`);
    });
    it('should have recordId field', () => {
      const outputType = (0, _removeById.default)(_userModel.UserModel, UserTC).getType();

      const typeComposer = _graphqlCompose.schemaComposer.createObjectTC(outputType);

      expect(typeComposer.hasField('recordId')).toBe(true);
      expect(typeComposer.getFieldType('recordId')).toBe(_mongoid.default);
    });
    it('should have record field', () => {
      const outputType = (0, _removeById.default)(_userModel.UserModel, UserTC).getType();

      const typeComposer = _graphqlCompose.schemaComposer.createObjectTC(outputType);

      expect(typeComposer.hasField('record')).toBe(true);
      expect(typeComposer.getFieldType('record')).toBe(UserTC.getType());
    });
    it('should reuse existed outputType', () => {
      const outputTypeName = `RemoveById${UserTC.getTypeName()}Payload`;

      const existedType = _graphqlCompose.schemaComposer.createObjectTC(outputTypeName);

      _graphqlCompose.schemaComposer.set(outputTypeName, existedType);

      const outputType = (0, _removeById.default)(_userModel.UserModel, UserTC).getType();
      expect(outputType).toBe(existedType.getType());
    });
  });
});