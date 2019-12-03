"use strict";

var _graphqlCompose = require("graphql-compose");

var _graphql = require("graphql-compose/lib/graphql");

var _userModel = require("../../__mocks__/userModel");

var _postModel = require("../../__mocks__/postModel");

var _findById = _interopRequireDefault(require("../findById"));

var _mongoid = _interopRequireDefault(require("../../types/mongoid"));

var _fieldsConverter = require("../../fieldsConverter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

beforeAll(() => _userModel.UserModel.base.connect());
afterAll(() => _userModel.UserModel.base.disconnect());
describe('findById() ->', () => {
  let UserTC;
  let PostTypeComposer;
  beforeEach(() => {
    _graphqlCompose.schemaComposer.clear();

    UserTC = (0, _fieldsConverter.convertModelToGraphQL)(_userModel.UserModel, 'User', _graphqlCompose.schemaComposer);
    PostTypeComposer = (0, _fieldsConverter.convertModelToGraphQL)(_postModel.PostModel, 'Post', _graphqlCompose.schemaComposer);
  });
  let user;
  let post;
  beforeEach(async () => {
    await _userModel.UserModel.deleteMany({});
    user = new _userModel.UserModel({
      name: 'nodkz'
    });
    await user.save();
    await _postModel.PostModel.deleteMany({});
    post = new _postModel.PostModel({
      _id: 1,
      title: 'Post 1'
    });
    await post.save();
  });
  it('should return Resolver object', () => {
    const resolver = (0, _findById.default)(_userModel.UserModel, UserTC);
    expect(resolver).toBeInstanceOf(_graphqlCompose.Resolver);
  });
  describe('Resolver.args', () => {
    it('should have non-null `_id` arg', () => {
      const resolver = (0, _findById.default)(_userModel.UserModel, UserTC);
      expect(resolver.hasArg('_id')).toBe(true);
      const argConfig = resolver.getArgConfig('_id');
      expect(argConfig.type).toBeInstanceOf(_graphql.GraphQLNonNull);
      expect(argConfig.type.ofType).toBe(_mongoid.default);
    });
  });
  describe('Resolver.resolve():Promise', () => {
    it('should be fulfilled promise', async () => {
      const result = (0, _findById.default)(_userModel.UserModel, UserTC).resolve({});
      await expect(result).resolves.toBeDefined();
    });
    it('should be rejected if args.id is not objectId', async () => {
      const result = (0, _findById.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          _id: 1
        }
      });
      await expect(result).rejects.toBeDefined();
    });
    it('should return null if args.id is empty', async () => {
      const result = await (0, _findById.default)(_userModel.UserModel, UserTC).resolve({});
      expect(result).toBe(null);
    });
    it('should return document if provided existed id', async () => {
      const result = await (0, _findById.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          _id: user._id
        }
      });
      expect(result.name).toBe(user.name);
    });
    it('should return mongoose document', async () => {
      const result = await (0, _findById.default)(_userModel.UserModel, UserTC).resolve({
        args: {
          _id: user._id
        }
      });
      expect(result).toBeInstanceOf(_userModel.UserModel);
    });
    it('should return mongoose Post document', async () => {
      const result = await (0, _findById.default)(_postModel.PostModel, PostTypeComposer).resolve({
        args: {
          _id: 1
        }
      });
      expect(result).toBeInstanceOf(_postModel.PostModel);
    });
    it('should call `beforeQuery` method with non-executed `query` as arg', async () => {
      let beforeQueryCalled = false;
      const result = await (0, _findById.default)(_postModel.PostModel, PostTypeComposer).resolve({
        args: {
          _id: 1
        },
        beforeQuery: (query, rp) => {
          expect(query).toHaveProperty('exec');
          expect(rp.model).toBe(_postModel.PostModel);
          beforeQueryCalled = true;
          return {
            overrides: true
          };
        }
      });
      expect(beforeQueryCalled).toBe(true);
      expect(result).toEqual({
        overrides: true
      });
    });
  });
});