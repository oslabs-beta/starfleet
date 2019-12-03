"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _graphql = require("graphql-compose/lib/graphql");

var _bsonDecimal = _interopRequireDefault(require("../bsonDecimal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Decimal128 = _mongoose.default.Types.Decimal128;
describe('GraphQLBSONDecimal', () => {
  describe('serialize', () => {
    it('pass Decimal128', () => {
      const amount = Decimal128.fromString('90000000000000000000000000000000.09');
      expect(_bsonDecimal.default.serialize(amount)).toBe('90000000000000000000000000000000.09');
    });
    it('pass String', () => {
      const amount = '90000000000000000000000000000000.09';
      expect(_bsonDecimal.default.serialize(amount)).toBe('90000000000000000000000000000000.09');
    });
  });
  describe('parseValue', () => {
    it('pass Decimal128', () => {
      const amount = Decimal128.fromString('90000000000000000000000000000000.09');
      expect(_bsonDecimal.default.parseValue(amount)).toBeInstanceOf(Decimal128);
    });
    it('pass String', () => {
      const amount = '90000000000000000000000000000000.09';
      expect(_bsonDecimal.default.parseValue(amount)).toBeInstanceOf(Decimal128);
    });
    it('pass Integer', () => {
      const amount = 123;
      expect(_bsonDecimal.default.parseValue(amount)).toBeInstanceOf(Decimal128);
    });
    it('pass any custom string value', () => {
      const id = 'custom_id';
      expect(() => _bsonDecimal.default.parseValue(id)).toThrow('not a valid Decimal128 string');
    });
  });
  describe('parseLiteral', () => {
    it('parse a ast STRING literal', async () => {
      const ast = {
        kind: _graphql.Kind.STRING,
        value: '90000000000000000000000000000000.09'
      };

      const amount = _bsonDecimal.default.parseLiteral(ast);

      expect(amount).toBeInstanceOf(Decimal128);
      expect(amount.toString()).toEqual('90000000000000000000000000000000.09');
    });
    it('parse a ast INT literal', async () => {
      const ast = {
        kind: _graphql.Kind.INT,
        value: '123'
      };

      const amount = _bsonDecimal.default.parseLiteral(ast);

      expect(amount).toBeInstanceOf(Decimal128);
      expect(amount.toString()).toEqual('123');
    });
  });
});