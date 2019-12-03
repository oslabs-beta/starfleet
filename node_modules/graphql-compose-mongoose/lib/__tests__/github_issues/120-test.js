"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongodbMemoryServer = _interopRequireDefault(require("mongodb-memory-server"));

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
describe('issue #120 - check `connection` resolver with last/before', () => {
  const RecordSchema = new _mongoose.default.Schema({
    id: String,
    title: String
  });

  const Record = _mongoose.default.model('Record', RecordSchema);

  const RecordTC = (0, _index.composeWithMongoose)(Record);
  const resolver = RecordTC.getResolver('connection');
  beforeAll(async () => {
    for (let i = 1; i <= 9; i++) {
      await Record.create({
        _id: `10000000000000000000000${i}`,
        title: `${i}`
      });
    }
  });
  it('check last/before with sorting', async () => {
    const res1 = await resolver.resolve({
      args: {
        last: 2,
        before: '',
        sort: {
          _id: 1
        }
      }
    });
    expect(res1.edges.map(({
      cursor,
      node
    }) => ({
      cursor,
      node: node.toString()
    }))).toEqual([{
      cursor: 'eyJfaWQiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDgifQ==',
      node: '{ _id: 100000000000000000000008 }'
    }, {
      cursor: 'eyJfaWQiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDkifQ==',
      node: '{ _id: 100000000000000000000009 }'
    }]);
    const res2 = await resolver.resolve({
      args: {
        last: 2,
        before: 'eyJfaWQiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDgifQ==',
        sort: {
          _id: 1
        }
      }
    });
    expect(res2.edges.map(({
      cursor,
      node
    }) => ({
      cursor,
      node: node.toString()
    }))).toEqual([{
      cursor: 'eyJfaWQiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDYifQ==',
      node: '{ _id: 100000000000000000000006 }'
    }, {
      cursor: 'eyJfaWQiOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDcifQ==',
      node: '{ _id: 100000000000000000000007 }'
    }]);
  });
  it('check last/before without sorting', async () => {
    const res1 = await resolver.resolve({
      args: {
        last: 2,
        before: ''
      }
    });
    expect(res1.edges.map(({
      cursor,
      node
    }) => ({
      cursor,
      node: node.toString()
    }))).toEqual([{
      cursor: 'Nw==',
      node: "{ _id: 100000000000000000000008, title: '8', __v: 0 }"
    }, {
      cursor: 'OA==',
      node: "{ _id: 100000000000000000000009, title: '9', __v: 0 }"
    }]);
    const res2 = await resolver.resolve({
      args: {
        last: 2,
        before: 'Nw=='
      }
    });
    expect(res2.edges.map(({
      cursor,
      node
    }) => ({
      cursor,
      node: node.toString()
    }))).toEqual([{
      cursor: 'NQ==',
      node: "{ _id: 100000000000000000000006, title: '6', __v: 0 }"
    }, {
      cursor: 'Ng==',
      node: "{ _id: 100000000000000000000007, title: '7', __v: 0 }"
    }]);
  });
});