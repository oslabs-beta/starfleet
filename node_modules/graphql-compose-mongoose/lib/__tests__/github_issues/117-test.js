"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongodbMemoryServer = _interopRequireDefault(require("mongodb-memory-server"));

var _index = require("../../index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
let mongoServer;
beforeAll(async () => {
  mongoServer = new _mongodbMemoryServer.default();
  const mongoUri = await mongoServer.getConnectionString();
  await _mongoose.default.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});
afterAll(() => {
  _mongoose.default.disconnect();

  mongoServer.stop();
});
describe('issue #117', () => {
  it('`populate()` method for arrays is broken', async () => {
    const PlayerSchema = new _mongoose.default.Schema({
      name: {
        type: String,
        required: true
      },
      surname: {
        type: String,
        required: true
      },
      sex: {
        type: String,
        required: true,
        enum: ['m', 'f']
      }
    });
    const GameSchema = new _mongoose.default.Schema({
      players: {
        required: true,
        type: [{
          type: _mongoose.default.Schema.Types.ObjectId,
          ref: 'PlayerModel'
        }]
      }
    });

    const GameModel = _mongoose.default.model('GameModel', GameSchema);

    const PlayerModel = _mongoose.default.model('PlayerModel', PlayerSchema);

    const player1 = await PlayerModel.create({
      name: '1',
      surname: '1',
      sex: 'm'
    });
    const player2 = await PlayerModel.create({
      name: '2',
      surname: '2',
      sex: 'f'
    });
    const game = await GameModel.create({
      players: [player1, player2]
    });
    const id = game._id;
    const g1 = await GameModel.findOne({
      _id: id
    }).populate('players');
    expect(g1.toJSON()).toEqual({
      __v: 0,
      _id: expect.anything(),
      players: [{
        __v: 0,
        _id: expect.anything(),
        name: '1',
        sex: 'm',
        surname: '1'
      }, {
        __v: 0,
        _id: expect.anything(),
        name: '2',
        sex: 'f',
        surname: '2'
      }]
    });
    (0, _index.composeWithMongoose)(GameModel);
    const g2 = await GameModel.findOne({
      _id: id
    }).populate('players'); // WAS SUCH ERROR
    // expect(g2.toJSON()).toEqual({ __v: 0, _id: expect.anything(), players: [] });
    // EXPECTED BEHAVIOR

    expect(g2.toJSON()).toEqual({
      __v: 0,
      _id: expect.anything(),
      players: [{
        __v: 0,
        _id: expect.anything(),
        name: '1',
        sex: 'm',
        surname: '1'
      }, {
        __v: 0,
        _id: expect.anything(),
        name: '2',
        sex: 'f',
        surname: '2'
      }]
    });
  });
});