"use strict";

var _graphqlCompose = require("graphql-compose");

var _userModel = require("../../__mocks__/userModel");

var _removeOne = _interopRequireDefault(require("../removeOne"));

var _mongoid = _interopRequireDefault(require("../../types/mongoid"));

var _fieldsConverter = require("../../fieldsConverter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
beforeAll(() => _userModel.UserModel.base.connect());
afterAll(() => _userModel.UserModel.base.disconnect());
describe('removeOne() ->', () => {
  let UserTC;
  beforeEach(() => {
    _graphqlCompose.schemaComposer.clear();

    UserTC = (0, _fieldsConverter.convertModelToGraphQL)(_userModel.UserModel, 'User', _graphqlCompose.schemaComposer);
    UserTC.setRecordIdFn(source => source ? `${source._id}` : '');
  });
  let user1;
  let user2;
  let user3;
  beforeEach(async () => {
    await _userModel.UserModel.deleteMany({});
    user1 = new _userModel.UserModel({
      name: 'userName1',
      gender: 'male',
      relocation: true,
      age: 28
    });
    user2 = new _userModel.UserModel({
      name: 'userName2',
      gender: 'female',
      relocation: true,
      age: 29
    });
    user3 = new _userModel.UserModel({
      name: 'userName3',
      gender: 'female',
      relocation: true,
      age: 30
    });
    await Promise.all([user1.save(), user2.save(), user3.save()]);
  });
  it('should return Resolver object', () => {
    const resolver = (0, _removeOne.default)(_userModel.UserModel, UserTC);
    expect(resolver).toBeInstanceOf(_graphqlCompose.Resolver);
  });
  describe('Resolver.args', () => {
    it('should have `filter` arg', () => {
      const resolver = (0, _removeOne.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('filter')).toBe(true);
    });
    it('should not have `skip` arg due mongoose error: ' + 'skip cannot be used with findOneAndRemove', () => {
      const resolver = (0, _removeOne.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('skip')).toBe(false);
    });
    it('should have `sort` arg', () => {
      const resolver = (0, _removeOne.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('sort')).toBe(true);
    });
  });
  describe('Resolver.resolve():Promise', () => {
    it('should be promise', () => {
      const result = (0, _removeOne.default)(_userModel.UserModel, UserTC).resolve({});
      expect(result).toBeInstanceOf(Promise);
      result.catch(() => 'catch error if appears, hide it from mocha');
    });
    it('should return payload.recordId if record existed in db', async () => {
      const result = await (0, _removeOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          }
        }
      });
      expect(result.recordId).toBe(user1.id);
    });
    it('should remove document in database', async () => {
      const checkedName = 'nameForMongoDB';
      await (0, _removeOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          },
          input: {
            name: checkedName
          }
        }
      });
      await expect(_userModel.UserModel.findOne({
        _id: user1._id
      })).resolves.toBeNull();
    });
    it('should return payload.record', async () => {
      const result = await (0, _removeOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          }
        }
      });
      expect(result.record.id).toBe(user1.id);
    });
    it('should sort records', async () => {
      const result1 = await (0, _removeOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            relocation: true
          },
          sort: {
            age: 1
          }
        }
      });
      expect(result1.record.age).toBe(user1.age);
      const result2 = await (0, _removeOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            relocation: true
          },
          sort: {
            age: -1
          }
        }
      });
      expect(result2.record.age).toBe(user3.age);
    });
    it('should pass empty projection to findOne and got full document data', async () => {
      const result = await (0, _removeOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          }
        },
        projection: {
          record: {
            name: true
          }
        }
      });
      expect(result.record.id).toBe(user1.id);
      expect(result.record.name).toBe(user1.name);
      expect(result.record.gender).toBe(user1.gender);
    });
    it('should return mongoose document', async () => {
      const result = await (0, _removeOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          }
        }
      });
      expect(result.record).toBeInstanceOf(_userModel.UserModel);
    });
    it('should rejected with Error if args.filter is empty', async () => {
      const result = (0, _removeOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {}
      });
      await expect(result).rejects.toMatchSnapshot();
    });
    it('should call `beforeRecordMutate` method with founded `record` and `resolveParams` as args', async () => {
      let beforeMutationId;
      const result = await (0, _removeOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          }
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
      expect(beforeMutationId).toBe(user1.id);
      const empty = await _userModel.UserModel.collection.findOne({
        _id: user1._id
      });
      expect(empty).toBe(null);
    });
    it('`beforeRecordMutate` may reject operation', async () => {
      const result = (0, _removeOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          }
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
        _id: user1._id
      });
      expect(exist.name).toBe(user1.name);
    });
    it('should call `beforeQuery` method with non-executed `query` as arg', async () => {
      let beforeQueryCalled = false;
      const result = await (0, _removeOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: 'INVALID_ID'
          }
        },
        beforeQuery: (query, rp) => {
          expect(query).toHaveProperty('exec');
          expect(rp.model).toBe(_userModel.UserModel);
          beforeQueryCalled = true; // modify query before execution

          return query.where({
            _id: user1.id
          });
        }
      });
      expect(result).toHaveProperty('record._id', user1._id);
      expect(beforeQueryCalled).toBe(true);
    });
  });
  describe('Resolver.getType()', () => {
    it('should have correct output type name', () => {
      const outputType = (0, _removeOne.default)(_userModel.UserModel, UserTC).getType();
      expect(outputType.name).toBe(`RemoveOne${UserTC.getTypeName()}Payload`);
    });
    it('should have recordId field', () => {
      const outputType = (0, _removeOne.default)(_userModel.UserModel, UserTC).getType();

      const recordIdField = _graphqlCompose.schemaComposer.createObjectTC(outputType).getFieldConfig('recordId');

      expect(recordIdField.type).toBe(_mongoid.default);
    });
    it('should have record field', () => {
      const outputType = (0, _removeOne.default)(_userModel.UserModel, UserTC).getType();

      const recordField = _graphqlCompose.schemaComposer.createObjectTC(outputType).getFieldConfig('record');

      expect(recordField.type).toBe(UserTC.getType());
    });
    it('should reuse existed outputType', () => {
      const outputTypeName = `RemoveOne${UserTC.getTypeName()}Payload`;

      const existedType = _graphqlCompose.schemaComposer.createObjectTC(outputTypeName);

      _graphqlCompose.schemaComposer.set(outputTypeName, existedType);

      const outputType = (0, _removeOne.default)(_userModel.UserModel, UserTC).getType();
      expect(outputType).toBe(existedType.getType());
    });
  });
});