"use strict";

var _projection = require("../projection");

describe('Resolver helper `projection` ->', () => {
  describe('projectionHelper()', () => {
    let spyFn;
    let resolveParams;
    beforeEach(() => {
      spyFn = jest.fn();
      resolveParams = {
        query: {
          select: spyFn
        }
      };
    });
    it('should not call query.select if projection is empty', () => {
      (0, _projection.projectionHelper)(resolveParams);
      expect(spyFn).not.toBeCalled();
    });
    it('should call query.select if projection is provided', () => {
      resolveParams.projection = {
        name: 1,
        age: 1
      };
      (0, _projection.projectionHelper)(resolveParams);
      expect(spyFn).toBeCalledWith({
        name: true,
        age: true
      });
    });
    it('should make projection fields flat', () => {
      resolveParams.projection = {
        name: {
          first: 1,
          last: 1
        }
      };
      (0, _projection.projectionHelper)(resolveParams);
      expect(spyFn).toBeCalledWith({
        name: true
      });
    });
    it('should not call query.select if projection has * key', () => {
      resolveParams.projection = {
        '*': true
      };
      (0, _projection.projectionHelper)(resolveParams);
      expect(spyFn).not.toBeCalled();
    });
    describe('projection operators', () => {
      // see more details here https://docs.mongodb.com/v3.2/reference/operator/projection/meta/
      it('should pass $meta unflatted', () => {
        resolveParams.projection = {
          score: {
            $meta: 'textScore'
          }
        };
        (0, _projection.projectionHelper)(resolveParams);
        expect(spyFn).toBeCalledWith({
          score: {
            $meta: 'textScore'
          }
        });
      });
      it('should pass $slice unflatted', () => {
        resolveParams.projection = {
          comments: {
            $slice: 5
          }
        };
        (0, _projection.projectionHelper)(resolveParams);
        expect(spyFn).toBeCalledWith({
          comments: {
            $slice: 5
          }
        });
      });
      it('should pass $elemMatch unflatted', () => {
        resolveParams.projection = {
          students: {
            $elemMatch: {
              school: 102
            }
          }
        };
        (0, _projection.projectionHelper)(resolveParams);
        expect(spyFn).toBeCalledWith({
          students: {
            $elemMatch: {
              school: 102
            }
          }
        });
      });
    });
  });
});