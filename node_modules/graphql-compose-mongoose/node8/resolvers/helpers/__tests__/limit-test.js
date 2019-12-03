"use strict";

var _limit = require("../limit");

describe('Resolver helper `limit` ->', () => {
  describe('limitHelperArgs()', () => {
    it('should return limit field', () => {
      const args = (0, _limit.limitHelperArgs)();
      expect(args.limit.type).toBe('Int');
    });
    it('should process `opts.defaultValue` arg', () => {
      expect((0, _limit.limitHelperArgs)().limit.defaultValue).toBe(1000);
      expect((0, _limit.limitHelperArgs)({
        defaultValue: 333
      }).limit.defaultValue).toBe(333);
    });
  });
  describe('limitHelper()', () => {
    let spyFn;
    let resolveParams;
    beforeEach(() => {
      spyFn = jest.fn();
      resolveParams = {
        query: {
          limit: spyFn
        }
      };
    });
    it('should not call query.limit if args.limit is empty', () => {
      (0, _limit.limitHelper)(resolveParams);
      expect(spyFn).not.toBeCalled();
    });
    it('should call query.limit if args.limit is provided', () => {
      resolveParams.args = {
        limit: 333
      };
      (0, _limit.limitHelper)(resolveParams);
      expect(spyFn).toBeCalledWith(333);
    });
    it('should convert string to int in args.limit', () => {
      resolveParams.args = {
        limit: '444'
      };
      (0, _limit.limitHelper)(resolveParams);
      expect(spyFn).toBeCalledWith(444);
    });
  });
});