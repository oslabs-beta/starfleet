"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "mongoose", {
  enumerable: true,
  get: function () {
    return _mongoose.default;
  }
});
exports.Types = exports.Schema = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongodbMemoryServer = _interopRequireDefault(require("mongodb-memory-server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign, no-console */
const {
  Schema,
  Types
} = _mongoose.default;
exports.Types = Types;
exports.Schema = Schema;
_mongoose.default.Promise = Promise;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const originalConnect = _mongoose.default.connect;

_mongoose.default.connect = async () => {
  const mongoServer = new _mongodbMemoryServer.default();
  const mongoUri = await mongoServer.getConnectionString(true); // originalConnect.bind(mongoose)(mongoUri, { useMongoClient: true }); // mongoose 4

  originalConnect.bind(_mongoose.default)(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }); // mongoose 5

  _mongoose.default.connection.on('error', e => {
    if (e.message.code === 'ETIMEDOUT') {
      console.error(e);
    } else {
      throw e;
    }
  });

  _mongoose.default.connection.once('open', () => {// console.log(`MongoDB successfully connected to ${mongoUri}`);
  });

  _mongoose.default.connection.once('disconnected', () => {
    // console.log('MongoDB disconnected!');
    mongoServer.stop();
  });
};