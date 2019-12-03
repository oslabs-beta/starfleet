"use strict";

var _graphqlCompose = require("graphql-compose");

var _graphql = require("graphql-compose/lib/graphql");

var _userModel = require("../../__mocks__/userModel");

var _updateOne = _interopRequireDefault(require("../updateOne"));

var _mongoid = _interopRequireDefault(require("../../types/mongoid"));

var _fieldsConverter = require("../../fieldsConverter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
beforeAll(() => _userModel.UserModel.base.connect());
afterAll(() => _userModel.UserModel.base.disconnect());
describe('updateOne() ->', () => {
  let UserTC;
  beforeEach(() => {
    _graphqlCompose.schemaComposer.clear();

    UserTC = (0, _fieldsConverter.convertModelToGraphQL)(_userModel.UserModel, 'User', _graphqlCompose.schemaComposer);
    UserTC.setRecordIdFn(source => source ? `${source._id}` : '');
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
    const resolver = (0, _updateOne.default)(_userModel.UserModel, UserTC);
    expect(resolver).toBeInstanceOf(_graphqlCompose.Resolver);
  });
  describe('Resolver.args', () => {
    it('should have `filter` arg', () => {
      const resolver = (0, _updateOne.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('filter')).toBe(true);
    });
    it('should have `skip` arg', () => {
      const resolver = (0, _updateOne.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('skip')).toBe(true);
    });
    it('should have `sort` arg', () => {
      const resolver = (0, _updateOne.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('sort')).toBe(true);
    });
    it('should have required `record` arg', () => {
      const resolver = (0, _updateOne.default)(_userModel.UserModel, UserTC);
      const argConfig = resolver.getArgConfig('record');
      expect(argConfig.type).toBeInstanceOf(_graphql.GraphQLNonNull);
      expect(argConfig.type.ofType.name).toBe('UpdateOneUserInput');
    });
  });
  describe('Resolver.resolve():Promise', () => {
    it('should be promise', () => {
      const result = (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({});
      expect(result).toBeInstanceOf(Promise);
      result.catch(() => 'catch error if appear, hide it from mocha');
    });
    it('should rejected with Error if args.filter is empty', async () => {
      const result = (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {}
      });
      await expect(result).rejects.toMatchSnapshot();
    });
    it('should return payload.recordId', async () => {
      const result = await (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          }
        }
      });
      expect(result.recordId).toBe(user1.id);
    });
    it('should change data via args.record in model', async () => {
      const result = await (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          },
          record: {
            name: 'newName'
          }
        }
      });
      expect(result.record.name).toBe('newName');
    });
    it('should change data via args.record in database', async () => {
      const checkedName = 'nameForMongoDB';
      await (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
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
    it('should return payload.record', async () => {
      const result = await (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          }
        }
      });
      expect(result.record.id).toBe(user1.id);
    });
    it('should skip records', async () => {
      const result1 = await (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            relocation: true
          },
          skip: 0
        }
      });
      const result2 = await (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            relocation: true
          },
          skip: 1
        }
      });
      expect(result1.record.id).not.toBe(result2.record.id);
    });
    it('should sort records', async () => {
      const result1 = await (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            relocation: true
          },
          sort: {
            _id: 1
          }
        }
      });
      const result2 = await (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            relocation: true
          },
          sort: {
            _id: -1
          }
        }
      });
      expect(result1.record.id).not.toBe(result2.record.id);
    });
    it('should pass empty projection to findOne and got full document data', async () => {
      const result = await (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
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
      const result = await (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          }
        }
      });
      expect(result.record).toBeInstanceOf(_userModel.UserModel);
    });
    it('should call `beforeRecordMutate` method with founded `record`  and `resolveParams` as args', async () => {
      let beforeMutationId;
      const result = await (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
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
    });
    it('`beforeRecordMutate` may reject operation', async () => {
      const result = (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          },
          record: {
            name: 'new name'
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
      const result = await (0, _updateOne.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          filter: {
            _id: user1.id
          },
          record: {
            name: 'new name'
          }
        },
        beforeQuery: (query, rp) => {
          expect(query).toHaveProperty('exec');
          expect(rp.model).toBe(_userModel.UserModel);
          beforeQueryCalled = true; // modify query before execution

          return query.where({
            _id: user2.id
          });
        }
      });
      expect(result).toHaveProperty('record._id', user2._id);
      expect(beforeQueryCalled).toBe(true);
    });
  });
  describe('Resolver.getType()', () => {
    it('should have correct output type name', () => {
      const outputType = (0, _updateOne.default)(_userModel.UserModel, UserTC).getType();
      expect(outputType.name).toBe(`UpdateOne${UserTC.getTypeName()}Payload`);
    });
    it('should have recordId field', () => {
      const outputType = (0, _updateOne.default)(_userModel.UserModel, UserTC).getType();

      const recordIdField = _graphqlCompose.schemaComposer.createObjectTC(outputType).getFieldConfig('recordId');

      expect(recordIdField.type).toBe(_mongoid.default);
    });
    it('should have record field', () => {
      const outputType = (0, _updateOne.default)(_userModel.UserModel, UserTC).getType();

      const recordField = _graphqlCompose.schemaComposer.createObjectTC(outputType).getFieldConfig('record');

      expect(recordField.type).toBe(UserTC.getType());
    });
    it('should reuse existed outputType', () => {
      const outputTypeName = `UpdateOne${UserTC.getTypeName()}Payload`;

      const existedType = _graphqlCompose.schemaComposer.createObjectTC(outputTypeName);

      _graphqlCompose.schemaComposer.set(outputTypeName, existedType);

      const outputType = (0, _updateOne.default)(_userModel.UserModel, UserTC).getType();
      expect(outputType).toBe(existedType.getType());
    });
  });
});