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
describe('issue #136 - Mongoose virtuals', () => {
  const CommentSchema = new _mongoose.default.Schema({
    author: {
      type: _mongoose.default.Schema.Types.ObjectId,
      rel: 'Autor'
    },
    links: [String]
  });

  const Comment = _mongoose.default.model('Comment', CommentSchema);

  const CommentTC = (0, _index.composeWithMongoose)(Comment);
  CommentTC.wrapResolverAs('createManyFiltered', 'createMany', updateManyFiltered => {
    const recordsTC = CommentTC.getResolver('createMany').getArgITC('records');
    const clonedRecordTC = recordsTC.clone('createManyFilteredInput');
    clonedRecordTC.removeField('links').addFields({
      hi: 'String'
    });
    updateManyFiltered.extendArg('records', {
      type: clonedRecordTC.getTypePlural()
    });
    return updateManyFiltered.wrapResolve(next => async rp => {
      console.log(rp.args); // eslint-disable-line

      return next(rp);
    }).debug();
  });
  it('check that virtual field works', async () => {
    // INIT GRAPHQL SCHEMA
    _graphqlCompose.schemaComposer.Query.addFields({
      noop: 'String'
    });

    _graphqlCompose.schemaComposer.Mutation.addFields({
      createCommentsFiltered: CommentTC.getResolver('createManyFiltered'),
      createManyComments: CommentTC.getResolver('createMany')
    });

    const schema = _graphqlCompose.schemaComposer.buildSchema();

    const res = await _graphqlCompose.graphql.graphql({
      schema,
      source: 'mutation { createManyComments(records: [{ links: ["a"] }]) { createCount } }'
    });
    expect(res).toEqual({
      data: {
        createManyComments: {
          createCount: 1
        }
      }
    });
  });
});