"use strict";

var _graphqlCompose = require("graphql-compose");

var _index = require("../../index");

var _userModel = require("../../__mocks__/userModel");

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
beforeAll(() => _userModel.UserModel.base.connect());
afterAll(() => _userModel.UserModel.base.disconnect());
const UserTC = (0, _index.composeWithMongoose)(_userModel.UserModel);

_graphqlCompose.schemaComposer.Query.addFields({
  users: UserTC.getResolver('findMany')
});

describe('issue #92 - How to verify the fields?', () => {
  UserTC.wrapResolverResolve('createOne', next => rp => {
    if (rp.args.record.age < 21) throw new Error('You are too young');
    if (rp.args.record.age > 60) throw new Error('You are too old');
    return next(rp);
  });

  _graphqlCompose.schemaComposer.Mutation.addFields({
    addUser: UserTC.getResolver('createOne')
  });

  const schema = _graphqlCompose.schemaComposer.buildSchema();

  it('correct request', async () => {
    const result = await _graphqlCompose.graphql.graphql(schema, `
          mutation {
            addUser(record: { name: "User1", age: 30 }) {
              record {
                name
                age
              }
            }
          }
        `);
    expect(result).toEqual({
      data: {
        addUser: {
          record: {
            age: 30,
            name: 'User1'
          }
        }
      }
    });
  });
  it('wrong request', async () => {
    const result = await _graphqlCompose.graphql.graphql(schema, `
          mutation {
            addUser(record: { name: "User1", age: 10 }) {
              record {
                name
                age
              }
            }
          }
        `);
    expect(result).toEqual({
      data: {
        addUser: null
      },
      errors: expect.anything()
    });
    expect(result.errors[0].message).toBe('You are too young');
  });
});