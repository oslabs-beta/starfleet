"use strict";

var _graphqlCompose = require("graphql-compose");

var _record = require("../record");

var _userModel = require("../../../__mocks__/userModel");

var _fieldsConverter = require("../../../fieldsConverter");

describe('Resolver helper `record` ->', () => {
  let UserTC;
  beforeEach(() => {
    _graphqlCompose.schemaComposer.clear();

    UserTC = (0, _fieldsConverter.convertModelToGraphQL)(_userModel.UserModel, 'User', _graphqlCompose.schemaComposer);
  });
  describe('recordHelperArgs()', () => {
    it('should throw error if `recordTypeName` not provided in opts', () => {
      expect(() => (0, _record.recordHelperArgs)(UserTC)).toThrowError('provide non-empty `recordTypeName`');
    });
    it('should return input field', () => {
      const args = (0, _record.recordHelperArgs)(UserTC, {
        recordTypeName: 'RecordUserType'
      });
      expect(args.record.type).toBeInstanceOf(_graphqlCompose.InputTypeComposer);
    });
    it('should reuse existed inputType', () => {
      const existedType = _graphqlCompose.schemaComposer.createInputTC({
        name: 'RecordUserType',
        fields: {}
      });

      _graphqlCompose.schemaComposer.set('RecordUserType', existedType);

      const args = (0, _record.recordHelperArgs)(UserTC, {
        recordTypeName: 'RecordUserType'
      });
      expect(args.record.type).toBe(existedType);
    });
    it('should for opts.isRequired=true return NonNullComposer', () => {
      const args = (0, _record.recordHelperArgs)(UserTC, {
        recordTypeName: 'RecordUserType',
        isRequired: true
      });
      expect(args.record.type).toBeInstanceOf(_graphqlCompose.NonNullComposer);
    });
    it('should remove fields via opts.removeFields', () => {
      const args = (0, _record.recordHelperArgs)(UserTC, {
        recordTypeName: 'RecordUserType',
        removeFields: ['name', 'age']
      });
      const inputTypeComposer = args.record.type;
      expect(inputTypeComposer.hasField('name')).toBe(false);
      expect(inputTypeComposer.hasField('age')).toBe(false);
      expect(inputTypeComposer.hasField('gender')).toBe(true);
    });
    it('should set required fields via opts.requiredFields', () => {
      const args = (0, _record.recordHelperArgs)(UserTC, {
        recordTypeName: 'RecordUserType',
        requiredFields: ['name', 'age']
      });
      const inputTypeComposer = args.record.type;
      expect(inputTypeComposer.getField('name').type).toBeInstanceOf(_graphqlCompose.NonNullComposer);
      expect(inputTypeComposer.getField('age').type).toBeInstanceOf(_graphqlCompose.NonNullComposer);
      expect(inputTypeComposer.getField('gender').type).not.toBeInstanceOf(_graphqlCompose.NonNullComposer);
    });
  });
});