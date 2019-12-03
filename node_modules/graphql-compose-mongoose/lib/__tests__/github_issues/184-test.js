"use strict";

var _toMongoDottedObject = require("../../utils/toMongoDottedObject");

describe('toMongoDottedObject()', () => {
  it('should handle operators using date object values when nested', () => {
    expect((0, _toMongoDottedObject.toMongoDottedObject)({
      a: {
        dateField: {
          $gte: new Date(100)
        }
      }
    })).toEqual({
      'a.dateField': {
        $gte: new Date(100)
      }
    });
  });
});