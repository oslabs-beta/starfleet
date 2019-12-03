"use strict";

var _graphqlCompose = require("graphql-compose");

var _sort = require("../sort");

var _userModel = require("../../../__mocks__/userModel");

var _fieldsConverter = require("../../../fieldsConverter");

var _utils = require("../../../utils");

describe('Resolver helper `sort` ->', () => {
  let UserTC;
  beforeEach(() => {
    _graphqlCompose.schemaComposer.clear();

    UserTC = (0, _fieldsConverter.convertModelToGraphQL)(_userModel.UserModel, 'User', _graphqlCompose.schemaComposer);
  });
  describe('getSortTypeFromModel()', () => {
    it('should return EnumType', () => {
      const typeName = 'SortType';
      const etc = (0, _sort.getSortTypeFromModel)(typeName, _userModel.UserModel, _graphqlCompose.schemaComposer);
      expect(etc).toBeInstanceOf(_graphqlCompose.EnumTypeComposer);
      expect(etc.getTypeName()).toBe(typeName);
    });
    it('should reuse existed EnumType', () => {
      const typeName = 'SortType';

      const existedETC = _graphqlCompose.schemaComposer.getOrCreateETC(typeName);

      const etc = (0, _sort.getSortTypeFromModel)(typeName, _userModel.UserModel, _graphqlCompose.schemaComposer);
      expect(etc).toBe(existedETC);
    });
    it('should have proper enum values', () => {
      const etc = (0, _sort.getSortTypeFromModel)('SortType', _userModel.UserModel, _graphqlCompose.schemaComposer);
      const indexedFields = (0, _utils.getIndexesFromModel)(_userModel.UserModel); // only indexed fields in enum

      const ascDescNum = indexedFields.length * 2;
      expect(etc.getFieldNames()).toHaveLength(ascDescNum); // should have ASC DESC keys

      const enumNames = etc.getFieldNames();
      expect(enumNames).toEqual(expect.arrayContaining(['_ID_ASC', '_ID_DESC'])); // should have ASC criteria for mongoose

      const complexASC = etc.getField('NAME__AGE_ASC');
      expect(complexASC.value).toEqual({
        name: 1,
        age: -1
      }); // should have DESC criteria for mongoose

      const complexDESC = etc.getField('NAME__AGE_DESC');
      expect(complexDESC.value).toEqual({
        name: -1,
        age: 1
      });
    });
  });
  describe('sortHelperArgs()', () => {
    it('should throw error if first arg is not ObjectTypeComposer', () => {
      expect(() => {
        const wrongArgs = [{}];
        (0, _sort.sortHelperArgs)(...wrongArgs);
      }).toThrowError('should be instance of ObjectTypeComposer');
    });
    it('should throw error if second arg is not Mongoose model', () => {
      expect(() => {
        const wrongArgs = [UserTC, {}];
        (0, _sort.sortHelperArgs)(...wrongArgs);
      }).toThrowError('should be instance of Mongoose Model');
    });
    it('should throw error if `sortTypeName` not provided in opts', () => {
      expect(() => (0, _sort.sortHelperArgs)(UserTC, _userModel.UserModel)).toThrowError('provide non-empty `sortTypeName`');
    });
    it('should return sort field', () => {
      const args = (0, _sort.sortHelperArgs)(UserTC, _userModel.UserModel, {
        sortTypeName: 'SortInput'
      });
      expect(args.sort.type).toBeInstanceOf(_graphqlCompose.EnumTypeComposer);
    });
  });
  describe('sortHelper()', () => {
    let spyFn;
    let resolveParams;
    beforeEach(() => {
      spyFn = jest.fn();
      resolveParams = {
        query: {
          sort: spyFn
        }
      };
    });
    it('should not call query.sort if args.sort is empty', () => {
      (0, _sort.sortHelper)(resolveParams);
      expect(spyFn).not.toHaveBeenCalled();
    });
    it('should call query.sort if args.sort is provided', () => {
      const sortValue = {
        _id: 1
      };
      resolveParams.args = {
        sort: sortValue
      };
      (0, _sort.sortHelper)(resolveParams);
      expect(spyFn).toBeCalledWith(sortValue);
    });
  });
});