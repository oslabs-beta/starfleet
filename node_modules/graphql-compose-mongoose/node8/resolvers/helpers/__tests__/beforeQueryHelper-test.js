"use strict";

var _beforeQueryHelper = require("../beforeQueryHelper");

var _userModel = require("../../../__mocks__/userModel");

describe('Resolver helper `beforeQueryHelper` ->', () => {
  let spyExec;
  let spyWhere;
  let resolveParams;
  beforeEach(() => {
    spyWhere = jest.fn();
    spyExec = jest.fn(() => Promise.resolve('EXEC_RETURN'));
    resolveParams = {
      query: {
        exec: spyExec,
        where: spyWhere
      },
      model: _userModel.UserModel
    };
  });
  it('should return query.exec() if `resolveParams.beforeQuery` is empty', async () => {
    const result = await (0, _beforeQueryHelper.beforeQueryHelper)(resolveParams);
    expect(result).toBe('EXEC_RETURN');
  });
  it('should call the `exec` method of `beforeQuery` return', async () => {
    resolveParams.beforeQuery = function beforeQuery() {
      return {
        exec: () => Promise.resolve('changed')
      };
    };

    const result = await (0, _beforeQueryHelper.beforeQueryHelper)(resolveParams);
    expect(result).toBe('changed');
  });
  it('should return the complete payload if not a Query', async () => {
    resolveParams.beforeQuery = function beforeQuery() {
      return 'NOT_A_QUERY';
    };

    expect((await (0, _beforeQueryHelper.beforeQueryHelper)(resolveParams))).toBe('NOT_A_QUERY');
  });
});