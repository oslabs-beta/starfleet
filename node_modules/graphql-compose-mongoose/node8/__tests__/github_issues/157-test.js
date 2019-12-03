"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongodbMemoryServer = _interopRequireDefault(require("mongodb-memory-server"));

var _graphqlCompose = require("graphql-compose");

var _index = require("../../index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-await-in-loop */
let mongoServer;
beforeAll(async () => {
  mongoServer = new _mongodbMemoryServer.default();
  const mongoUri = await mongoServer.getConnectionString();
  await _mongoose.default.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }); // mongoose.set('debug', true);
});
afterAll(() => {
  _mongoose.default.disconnect();

  mongoServer.stop();
}); // May require additional time for downloading MongoDB binaries

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
describe('issue #157 - Optional enum error', () => {
  const Visit = _mongoose.default.model('visit', new _mongoose.default.Schema({
    url: {
      type: String,
      required: true
    },
    referredBy: {
      type: String,
      enum: ['WEBSITE', 'NEWSPAPER']
    }
  }));

  it('check ', async () => {
    const VisitTC = (0, _index.composeWithMongoose)(Visit);
    const referredBy = VisitTC.getFieldType('referredBy');
    expect(referredBy).toBeInstanceOf(_graphqlCompose.graphql.GraphQLEnumType);

    const etc = _graphqlCompose.schemaComposer.createEnumTC(referredBy);

    expect(etc.getFieldNames()).toEqual(['WEBSITE', 'NEWSPAPER']);
    etc.addFields({
      EMPTY_STRING: {
        value: ''
      },
      NULL: {
        value: null
      }
    });
    expect(etc.getFieldNames()).toEqual(['WEBSITE', 'NEWSPAPER', 'EMPTY_STRING', 'NULL']);
  });
});