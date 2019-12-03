"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _graphql = require("graphql-compose/lib/graphql");

var _mongoid = _interopRequireDefault(require("../mongoid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ObjectId = _mongoose.default.Types.ObjectId;
describe('GraphQLMongoID', () => {
  describe('serialize', () => {
    it('pass ObjectId', () => {
      const id = new ObjectId('5a0d77aa7e65a808ad24937f');
      expect(_mongoid.default.serialize(id)).toBe('5a0d77aa7e65a808ad24937f');
    });
    it('pass String', () => {
      const id = '5a0d77aa7e65a808ad249000';
      expect(_mongoid.default.serialize(id)).toBe('5a0d77aa7e65a808ad249000');
    });
  });
  describe('parseValue', () => {
    it('pass ObjectId', () => {
      const id = new ObjectId('5a0d77aa7e65a808ad24937f');
      expect(_mongoid.default.parseValue(id)).toBe(id);
    });
    it('pass ObjectId as string', () => {
      const id = '5a0d77aa7e65a808ad249000';
      expect(_mongoid.default.parseValue(id)).toEqual(id);
    });
    it('pass integer', () => {
      const id = 123;
      expect(_mongoid.default.parseValue(id)).toEqual(id);
    });
    it('pass any custom string', () => {
      const id = 'custom_id';
      expect(_mongoid.default.parseValue(id)).toEqual(id);
    });
  });
  describe('parseLiteral', () => {
    it('parse a ast STRING literal', async () => {
      const ast = {
        kind: _graphql.Kind.STRING,
        value: '5a0d77aa7e65a808ad249000'
      };

      const id = _mongoid.default.parseLiteral(ast);

      expect(id).toEqual('5a0d77aa7e65a808ad249000');
    });
    it('parse a ast INT literal', async () => {
      const ast = {
        kind: _graphql.Kind.INT,
        value: 123
      };

      const id = _mongoid.default.parseLiteral(ast);

      expect(id).toEqual(123);
    });
  });
});