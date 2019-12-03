"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _graphql = require("graphql-compose/lib/graphql");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Decimal128 = _mongoose.default.Types.Decimal128;
const GraphQLBSONDecimal = new _graphql.GraphQLScalarType({
  name: 'BSONDecimal',
  description: 'The `Decimal` scalar type uses the IEEE 754 decimal128 ' + 'decimal-based floating-point numbering format. ' + 'Supports 34 decimal digits of precision, a max value of ' + 'approximately 10^6145, and min value of approximately -10^6145',
  serialize: String,

  parseValue(value) {
    if (typeof value === 'string') {
      return Decimal128.fromString(value);
    }

    if (typeof value === 'number') {
      return Decimal128.fromString(value.toString());
    }

    if (value instanceof Decimal128) {
      return value;
    }

    throw new TypeError('Field error: value is an invalid Decimal');
  },

  parseLiteral(ast) {
    if (ast.kind === _graphql.Kind.STRING || ast.kind === _graphql.Kind.INT) {
      return Decimal128.fromString(ast.value);
    }

    return null;
  }

});
var _default = GraphQLBSONDecimal;
exports.default = _default;