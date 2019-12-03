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
describe('issue #128 - OR/AND filter args not working with some other filter args', () => {
  const RecordSchema = new _mongoose.default.Schema({
    id: String,
    name: String,
    pets: [String],
    friends: [String]
  });

  const Record = _mongoose.default.model('Record', RecordSchema);

  const RecordTC = (0, _index.composeWithMongoose)(Record);
  const resolver = RecordTC.getResolver('findMany');
  beforeAll(async () => {
    for (let i = 1; i <= 9; i++) {
      await Record.create({
        _id: `10000000000000000000000${i}`,
        name: `Name ${i}`,
        pets: [`Pet ${i}`],
        friends: [`Friend ${i}`]
      });
    }
  });
  it('check with OR filter arg', async () => {
    const res1 = await resolver.resolve({
      args: {
        filter: {
          OR: [{
            _operators: {
              pets: {
                in: ['Pet 2']
              }
            }
          }, {
            _operators: {
              friends: {
                in: ['Friend 4']
              }
            }
          }]
        }
      }
    });
    expect(res1.map(({
      pets,
      friends
    }) => ({
      pets: [...pets],
      friends: [...friends]
    }))).toEqual([{
      pets: ['Pet 2'],
      friends: ['Friend 2']
    }, {
      pets: ['Pet 4'],
      friends: ['Friend 4']
    }]);
  });
  it('check with AND filter arg', async () => {
    const res1 = await resolver.resolve({
      args: {
        filter: {
          OR: [{
            _operators: {
              pets: {
                in: ['Pet 2']
              }
            }
          }, {
            name: 'Name 4'
          }]
        }
      }
    });
    expect(res1.map(({
      pets,
      friends
    }) => ({
      pets: [...pets],
      friends: [...friends]
    }))).toEqual([{
      pets: ['Pet 2'],
      friends: ['Friend 2']
    }, {
      pets: ['Pet 4'],
      friends: ['Friend 4']
    }]);
  });
  it('check without OR filter arg', async () => {
    const res1 = await resolver.resolve({
      args: {
        filter: {
          _operators: {
            pets: {
              in: ['Pet 2']
            }
          }
        }
      }
    });
    expect(res1.map(res => ({
      pets: [...res.pets],
      friends: [...res.friends]
    }))).toEqual([{
      pets: ['Pet 2'],
      friends: ['Friend 2']
    }]);
  });
});