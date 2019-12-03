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
describe('issue #135 - Mongoose virtuals', () => {
  const RecordSchema = new _mongoose.default.Schema({
    id: String,
    title: String
  }); // ADD VIRTUAL FIELDS VIA loadClass METHOD
  // see https://mongoosejs.com/docs/api.html#schema_Schema-loadClass

  class RecordDoc {
    get virtualField123() {
      // $FlowFixMe
      return `Improved ${this.title}`;
    }

  }

  RecordSchema.loadClass(RecordDoc); // ADD MOCK DATA TO DB

  const Record = _mongoose.default.model('Record', RecordSchema);

  beforeAll(async () => {
    for (let i = 1; i <= 3; i++) {
      // $FlowFixMe
      await Record.create({
        _id: `10000000000000000000000${i}`,
        title: `Title ${i}`
      });
    }
  }); // ADD VIRTUAL FIELD DEFINITION <-------------------   JUST ADD FIELD DEFINITION 🛑🛑🛑
  // no need to define resolve method explicitly

  const RecordTC = (0, _index.composeWithMongoose)(Record);
  RecordTC.addFields({
    virtualField123: {
      type: 'String'
    }
  }); // INIT GRAPHQL SCHEMA

  _graphqlCompose.schemaComposer.Query.addFields({
    findMany: RecordTC.getResolver('findMany')
  });

  const schema = _graphqlCompose.schemaComposer.buildSchema();

  it('check that virtual field works', async () => {
    const res = await _graphqlCompose.graphql.graphql({
      schema,
      source: 'query { findMany { id title virtualField123 } }'
    });
    expect(res).toEqual({
      data: {
        findMany: [{
          id: null,
          title: 'Title 1',
          virtualField123: 'Improved Title 1'
        }, {
          id: null,
          title: 'Title 2',
          virtualField123: 'Improved Title 2'
        }, {
          id: null,
          title: 'Title 3',
          virtualField123: 'Improved Title 3'
        }]
      }
    });
  });
});