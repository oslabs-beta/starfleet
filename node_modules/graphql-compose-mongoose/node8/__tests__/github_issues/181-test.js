"use strict";

var _graphqlCompose = require("graphql-compose");

var _filterOperators = require("../../resolvers/helpers/filterOperators");

beforeEach(() => {
  _graphqlCompose.schemaComposer.clear();

  _graphqlCompose.schemaComposer.createInputTC({
    name: 'UserFilterInput',
    fields: {
      _id: 'String',
      employment: 'String',
      name: 'String',
      age: 'Int',
      skills: ['String']
    }
  });
});
describe(`issue #181 - Cannot read property '_operators' of null`, () => {
  it('should call query.find if operator value is null', () => {
    const filter = {
      [_filterOperators.OPERATORS_FIELDNAME]: {
        age: {
          ne: null
        }
      }
    };
    expect((0, _filterOperators.processFilterOperators)(filter)).toEqual({
      age: {
        $ne: null
      }
    });
  });
});