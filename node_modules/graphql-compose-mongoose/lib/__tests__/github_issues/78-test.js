"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongodbMemoryServer = _interopRequireDefault(require("mongodb-memory-server"));

var _graphqlCompose = require("graphql-compose");

var _index = require("../../index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
}); // May require additional time for downloading MongoDB binaries

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
describe('issue #78 - Mongoose and Discriminators', () => {
  const options = {
    discriminatorKey: 'kind'
  };
  const eventSchema = new _mongoose.default.Schema({
    refId: String
  }, options);

  const Event = _mongoose.default.model('GenericEvent', eventSchema);

  const clickedLinkSchema = new _mongoose.default.Schema({
    url: String
  }, options);
  const ClickedLinkEvent = Event.discriminator('ClickedLinkEvent', clickedLinkSchema);
  const EventTC = (0, _index.composeWithMongoose)(Event);
  const ClickedLinkEventTC = (0, _index.composeWithMongoose)(ClickedLinkEvent);
  it('creating Types from models', () => {
    expect(EventTC.getFieldNames()).toEqual(['refId', '_id', 'kind']);
    expect(ClickedLinkEventTC.getFieldNames()).toEqual(['url', '_id', 'refId', 'kind']);
  });
  it('manually override resolver output type for findMany', async () => {
    const EventDescriminatorType = new _graphqlCompose.graphql.GraphQLUnionType({
      name: 'EventDescriminator',
      types: [EventTC.getType(), ClickedLinkEventTC.getType()],
      resolveType: value => {
        if (value.kind === 'ClickedLinkEvent') {
          return ClickedLinkEventTC.getType();
        }

        return EventTC.getType();
      }
    });
    EventTC.getResolver('findMany').setType(new _graphqlCompose.graphql.GraphQLList(EventDescriminatorType)); // let's check graphql response

    await Event.create({
      refId: 'aaa'
    });
    await Event.create({
      refId: 'bbb'
    });
    await ClickedLinkEvent.create({
      refId: 'ccc',
      url: 'url1'
    });
    await ClickedLinkEvent.create({
      refId: 'ddd',
      url: 'url2'
    });

    _graphqlCompose.schemaComposer.Query.addFields({
      eventFindMany: EventTC.getResolver('findMany')
    });

    const schema = _graphqlCompose.schemaComposer.buildSchema();

    const res = await _graphqlCompose.graphql.graphql(schema, `{
    eventFindMany {
        __typename
        ... on GenericEvent {
        refId
        }
        ... on ClickedLinkEvent {
        refId
        url
        }
    }
    }`);
    expect(res).toEqual({
      data: {
        eventFindMany: [{
          __typename: 'GenericEvent',
          refId: 'aaa'
        }, {
          __typename: 'GenericEvent',
          refId: 'bbb'
        }, {
          __typename: 'ClickedLinkEvent',
          refId: 'ccc',
          url: 'url1'
        }, {
          __typename: 'ClickedLinkEvent',
          refId: 'ddd',
          url: 'url2'
        }]
      }
    });
  });
});