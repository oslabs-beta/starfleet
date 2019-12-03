"use strict";

var _graphqlCompose = require("graphql-compose");

var _userModel = require("../__mocks__/userModel");

var _fieldsConverter = require("../fieldsConverter");

var _mongoid = _interopRequireDefault(require("../types/mongoid"));

var _bsonDecimal = _interopRequireDefault(require("../types/bsonDecimal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-unused-expressions, no-template-curly-in-string */
describe('fieldConverter', () => {
  const fields = (0, _fieldsConverter.getFieldsFromModel)(_userModel.UserModel);
  const fieldNames = Object.keys(fields);
  describe('getFieldsFromModel()', () => {
    it('should get fieldsMap from mongoose model', () => {
      expect(Object.keys(fields)).toEqual(expect.arrayContaining(['name', 'createdAt', '_id']));
    });
    it('should skip double undescored fields', () => {
      const hiddenFields = fieldNames.filter(name => name.startsWith('__'));
      expect(hiddenFields).toHaveLength(0);
    });
    it('should throw Exception, if model does `schema.path` property', () => {
      expect(() => {
        const wrongArgs = [{
          a: 1
        }];
        (0, _fieldsConverter.getFieldsFromModel)(...wrongArgs);
      }).toThrowError(/incorrect mongoose model/);
      expect(() => {
        const wrongArgs = [{
          schema: {}
        }];
        (0, _fieldsConverter.getFieldsFromModel)(...wrongArgs);
      }).toThrowError(/incorrect mongoose model/);
    });
  });
  describe('deriveComplexType()', () => {
    it('should throw error on incorrect mongoose field', () => {
      const err = /incorrect mongoose field/;
      expect(() => {
        const wrongArgs = [];
        (0, _fieldsConverter.deriveComplexType)(...wrongArgs);
      }).toThrowError(err);
      expect(() => {
        const wrongArgs = [123];
        (0, _fieldsConverter.deriveComplexType)(...wrongArgs);
      }).toThrowError(err);
      expect(() => {
        const wrongArgs = [{
          a: 1
        }];
        (0, _fieldsConverter.deriveComplexType)(...wrongArgs);
      }).toThrowError(err);
      expect(() => {
        const wrongArgs = [{
          path: 'name'
        }];
        (0, _fieldsConverter.deriveComplexType)(...wrongArgs);
      }).toThrowError(err);
      expect(() => {
        (0, _fieldsConverter.deriveComplexType)({
          path: 'name',
          instance: 'Abc'
        });
      }).not.toThrowError(err);
    });
    it('should derive DOCUMENT_ARRAY', () => {
      expect((0, _fieldsConverter.deriveComplexType)(fields.languages)).toBe(_fieldsConverter.ComplexTypes.DOCUMENT_ARRAY);
      expect((0, _fieldsConverter.deriveComplexType)(fields.periods)).toBe(_fieldsConverter.ComplexTypes.DOCUMENT_ARRAY);
    });
    it('should derive EMBEDDED', () => {
      expect((0, _fieldsConverter.deriveComplexType)(fields.contacts)).toBe(_fieldsConverter.ComplexTypes.EMBEDDED);
      expect((0, _fieldsConverter.deriveComplexType)(fields.subDoc)).toBe(_fieldsConverter.ComplexTypes.EMBEDDED);
    });
    it('should derive DECIMAL', () => {
      expect((0, _fieldsConverter.deriveComplexType)(fields.salary)).toBe(_fieldsConverter.ComplexTypes.DECIMAL);
    });
    it('should derive ARRAY', () => {
      expect((0, _fieldsConverter.deriveComplexType)(fields.users)).toBe(_fieldsConverter.ComplexTypes.ARRAY);
      expect((0, _fieldsConverter.deriveComplexType)(fields.skills)).toBe(_fieldsConverter.ComplexTypes.ARRAY);
      expect((0, _fieldsConverter.deriveComplexType)(fields.employment)).toBe(_fieldsConverter.ComplexTypes.ARRAY);
    });
    it('should derive ENUM', () => {
      expect((0, _fieldsConverter.deriveComplexType)(fields.gender)).toBe(_fieldsConverter.ComplexTypes.ENUM);
      expect((0, _fieldsConverter.deriveComplexType)(fields.languages.schema.paths.ln)).toBe(_fieldsConverter.ComplexTypes.ENUM);
      expect((0, _fieldsConverter.deriveComplexType)(fields.languages.schema.paths.sk)).toBe(_fieldsConverter.ComplexTypes.ENUM);
    });
    it('should derive REFERENCE', () => {
      expect((0, _fieldsConverter.deriveComplexType)(fields.user)).toBe(_fieldsConverter.ComplexTypes.REFERENCE);
    });
    it('should derive SCALAR', () => {
      expect((0, _fieldsConverter.deriveComplexType)(fields.name)).toBe(_fieldsConverter.ComplexTypes.SCALAR);
      expect((0, _fieldsConverter.deriveComplexType)(fields.relocation)).toBe(_fieldsConverter.ComplexTypes.SCALAR);
      expect((0, _fieldsConverter.deriveComplexType)(fields.age)).toBe(_fieldsConverter.ComplexTypes.SCALAR);
      expect((0, _fieldsConverter.deriveComplexType)(fields.createdAt)).toBe(_fieldsConverter.ComplexTypes.SCALAR);
      expect((0, _fieldsConverter.deriveComplexType)(fields.gender)).not.toBe(_fieldsConverter.ComplexTypes.SCALAR);
      expect((0, _fieldsConverter.deriveComplexType)(fields.subDoc)).not.toBe(_fieldsConverter.ComplexTypes.SCALAR);
    });
    it('should derive MIXED mongoose type', () => {
      expect((0, _fieldsConverter.deriveComplexType)(fields.someDynamic)).toBe(_fieldsConverter.ComplexTypes.MIXED);
    });
  });
  describe('convertFieldToGraphQL()', () => {
    it('should convert any mongoose field to graphQL type', () => {
      const mongooseField = {
        path: 'strFieldName',
        instance: 'String'
      };
      expect((0, _fieldsConverter.convertFieldToGraphQL)(mongooseField, '', _graphqlCompose.schemaComposer)).toBe('String');
    });
    it('should add GraphQLMongoID to schemaComposer', () => {
      _graphqlCompose.schemaComposer.clear();

      expect(_graphqlCompose.schemaComposer.has('MongoID')).toBeFalsy();
      const mongooseField = {
        path: 'strFieldName',
        instance: 'ObjectID'
      };
      expect((0, _fieldsConverter.convertFieldToGraphQL)(mongooseField, '', _graphqlCompose.schemaComposer)).toBe('MongoID');
      expect(_graphqlCompose.schemaComposer.get('MongoID').getType()).toBe(_mongoid.default);
    });
    it('should use existed GraphQLMongoID in schemaComposer', () => {
      _graphqlCompose.schemaComposer.clear();

      expect(_graphqlCompose.schemaComposer.has('MongoID')).toBeFalsy();

      const customType = _graphqlCompose.schemaComposer.createScalarTC('MyMongoId');

      _graphqlCompose.schemaComposer.set('MongoID', customType);

      const mongooseField = {
        path: 'strFieldName',
        instance: 'ObjectID'
      };
      expect((0, _fieldsConverter.convertFieldToGraphQL)(mongooseField, '', _graphqlCompose.schemaComposer)).toBe('MongoID');
      expect(_graphqlCompose.schemaComposer.get('MongoID')).toBe(customType);

      _graphqlCompose.schemaComposer.delete('MongoID');
    });
    it('should convert any mongoose field to graphQL type', () => {
      _graphqlCompose.schemaComposer.clear();

      expect(_graphqlCompose.schemaComposer.has('BSONDecimal')).toBeFalsy();
      const mongooseField = {
        path: 'salary',
        instance: 'Decimal128'
      };
      expect((0, _fieldsConverter.convertFieldToGraphQL)(mongooseField, '', _graphqlCompose.schemaComposer)).toBe('BSONDecimal');
      expect(_graphqlCompose.schemaComposer.has('BSONDecimal')).toBeTruthy();
      expect(_graphqlCompose.schemaComposer.get('BSONDecimal').getType()).toBe(_bsonDecimal.default);
    });
  });
  describe('scalarToGraphQL()', () => {
    it('should properly convert mongoose scalar type to default graphQL types', () => {
      expect((0, _fieldsConverter.scalarToGraphQL)({
        instance: 'String'
      })).toBe('String');
      expect((0, _fieldsConverter.scalarToGraphQL)({
        instance: 'Number'
      })).toBe('Float');
      expect((0, _fieldsConverter.scalarToGraphQL)({
        instance: 'Boolean'
      })).toBe('Boolean');
      expect((0, _fieldsConverter.scalarToGraphQL)({
        instance: 'ObjectID'
      })).toBe('MongoID');
    });
    it('should properly convert mongoose scalar type to scalar graphql-compose types', () => {
      expect((0, _fieldsConverter.scalarToGraphQL)({
        instance: 'Date'
      })).toBe('Date');
      expect((0, _fieldsConverter.scalarToGraphQL)({
        instance: 'Buffer'
      })).toBe('Buffer');
      expect((0, _fieldsConverter.scalarToGraphQL)({
        instance: 'abrakadabra'
      })).toBe('JSON');
    });
  });
  describe('arrayToGraphQL()', () => {
    it('should produce GraphQLList', () => {
      const skillsType = (0, _fieldsConverter.arrayToGraphQL)(fields.skills, '', _graphqlCompose.schemaComposer);
      expect(skillsType).toEqual(['String']);
    });
  });
  describe('enumToGraphQL()', () => {
    it('should be instance of GraphQLEnumType', () => {
      const genderEnum = (0, _fieldsConverter.enumToGraphQL)(fields.gender, '', _graphqlCompose.schemaComposer);
      expect(genderEnum).toBeInstanceOf(_graphqlCompose.EnumTypeComposer);
    });
    it('should have type name `Enum${FieldName}`', () => {
      const genderEnum = (0, _fieldsConverter.enumToGraphQL)(fields.gender, '', _graphqlCompose.schemaComposer);
      expect(genderEnum.getTypeName()).toBe('EnumGender');
    });
    it('should pass all enum values to GQ type', () => {
      const genderEnum = (0, _fieldsConverter.enumToGraphQL)(fields.gender, '', _graphqlCompose.schemaComposer);
      expect(genderEnum.getFieldNames().length).toBe(fields.gender.enumValues.length);
      expect(genderEnum.getField('male').value).toBe(fields.gender.enumValues[0]);
    });
  });
  describe('embeddedToGraphQL()', () => {
    it('should set name to graphql type', () => {
      const embeddedTC = (0, _fieldsConverter.embeddedToGraphQL)(fields.contacts, '', _graphqlCompose.schemaComposer);
      expect(embeddedTC.getTypeName()).toBe('Contacts');
    });
    it('should have embedded fields', () => {
      const embeddedTC = (0, _fieldsConverter.embeddedToGraphQL)(fields.contacts, '', _graphqlCompose.schemaComposer);
      const embeddedFields = embeddedTC.getFields();
      expect(embeddedFields.email).toBeTruthy();
      expect(embeddedFields.locationId).toBeTruthy();
      expect(embeddedFields._id).toBeTruthy();
    });
    it('test object with field as array', () => {
      const someDeepTC = (0, _fieldsConverter.embeddedToGraphQL)(fields.someDeep, '', _graphqlCompose.schemaComposer);
      expect(someDeepTC.getTypeName()).toBe('SomeDeep');
      expect(someDeepTC.getField('periods').type).toBeInstanceOf(_graphqlCompose.ListComposer);
      const tc = someDeepTC.getFieldOTC('periods');
      expect(tc.getTypeName()).toBe('SomeDeepPeriods');
      expect(tc.hasField('from')).toBeTruthy();
      expect(tc.hasField('to')).toBeTruthy();
    });
  });
  describe('documentArrayToGraphQL()', () => {
    it('test schema as array', () => {
      const languagesTypeAsList = (0, _fieldsConverter.documentArrayToGraphQL)(fields.languages, '', _graphqlCompose.schemaComposer);
      const languagesType = languagesTypeAsList[0];
      const languagesFields = languagesType.getFields();
      expect(Array.isArray(languagesTypeAsList)).toBeTruthy();
      expect(languagesType.getTypeName()).toBe('Languages');
      expect(languagesFields._id).toBeTruthy();
    });
    it('test object as array', () => {
      const periodsTypeAsList = (0, _fieldsConverter.documentArrayToGraphQL)(fields.periods, '', _graphqlCompose.schemaComposer);
      const periodsType = periodsTypeAsList[0];
      const periodsFields = periodsType.getFields();
      expect(Array.isArray(periodsTypeAsList)).toBeTruthy();
      expect(periodsType.getTypeName()).toBe('Periods');
      expect(periodsFields.from).toBeTruthy();
      expect(periodsFields.to).toBeTruthy();
    });
  });
  describe('referenceToGraphQL()', () => {
    it('should return type of field', () => {
      expect((0, _fieldsConverter.referenceToGraphQL)(fields.user)).toBe('MongoID');
    });
  });
  describe('convertModelToGraphQL()', () => {
    const sc = new _graphqlCompose.SchemaComposer();
    const tc = (0, _fieldsConverter.convertModelToGraphQL)(_userModel.UserModel, 'User', sc);
    it('should work with String', () => {
      expect(tc.getFieldTypeName('name')).toBe('String');
      expect(tc.getFieldTypeName('skills')).toBe('[String]');
    });
    it('should work with Number', () => {
      expect(tc.getFieldTypeName('age')).toBe('Float');
    });
    it('should work with ObjectId', () => {
      expect(tc.getFieldTypeName('user')).toBe('MongoID');
    });
    it('should work with Enum', () => {
      expect(tc.getFieldTC('gender').getFieldNames()).toEqual(['male', 'female', 'ladyboy']);
      expect(tc.getFieldTC('employment').getFieldNames()).toEqual(['full', 'partial', 'remote']);
    });
    it('should work with Boolean', () => {
      expect(tc.getFieldTypeName('relocation')).toBe('Boolean');
    });
    it('should extract sub schemas', () => {
      const contactsTC = tc.getFieldOTC('contacts');
      expect(contactsTC.getFieldNames()).toEqual(['phones', 'email', 'skype', 'locationId', '_id']);
    });
    it('should skip __secretField', () => {
      expect(tc.hasField('__secretField')).toBeFalsy();
    });
    it('should work with Mixed', () => {
      expect(tc.getFieldTypeName('someDynamic')).toBe('JSON');
    });
    it('should work with Array', () => {
      expect(tc.getFieldTypeName('periods')).toBe('[UserPeriods]');
      expect(sc.getOTC('UserPeriods').getFieldNames()).toEqual(['from', 'to', '_id']);
      expect(tc.getFieldTypeName('someDeep')).toBe('UserSomeDeep');
      expect(tc.getFieldOTC('someDeep').getFieldTypeName('periods')).toBe('[UserSomeDeepPeriods]');
      expect(sc.getOTC('UserSomeDeepPeriods').getFieldNames()).toEqual(['from', 'to', '_id']);
    });
    it('should work with Decimal128', () => {
      expect(tc.getFieldTypeName('salary')).toBe('BSONDecimal');
    });
    it('should work with Map', () => {
      expect(tc.getFieldTypeName('mapField')).toBe('JSON');
      expect(tc.getFieldTypeName('mapFieldDeep')).toBe('UserMapFieldDeep');
      expect(tc.getFieldOTC('mapFieldDeep').getFieldTypeName('subField')).toBe('JSON');
    });
  });
});