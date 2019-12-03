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

describe('issue #93', () => {
  it('$or, $and operator for filtering', async () => {
    _graphqlCompose.schemaComposer.Query.addFields({
      users: UserTC.getResolver('findMany')
    });

    const schema = _graphqlCompose.schemaComposer.buildSchema();

    await _userModel.UserModel.create({
      _id: '100000000000000000000301',
      name: 'User301',
      age: 301
    });
    await _userModel.UserModel.create({
      _id: '100000000000000000000302',
      name: 'User302',
      age: 302,
      gender: 'male'
    });
    await _userModel.UserModel.create({
      _id: '100000000000000000000303',
      name: 'User303',
      age: 302,
      gender: 'female'
    });
    const res = await _graphqlCompose.graphql.graphql(schema, `
        {
          users(filter: { OR: [{ age: 301 }, { AND: [{ gender: male }, { age: 302 }] }] }) {
            name
          }
        }
      `);
    expect(res).toEqual({
      data: {
        users: [{
          name: 'User301'
        }, {
          name: 'User302'
        }]
      }
    });
  });
});