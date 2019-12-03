"use strict";

var _graphqlCompose = require("graphql-compose");

var _characterModels = require("../__mocks__/characterModels");

var _composeWithMongooseDiscriminators = require("../../composeWithMongooseDiscriminators");

const {
  CharacterModel,
  PersonModel,
  DroidModel
} = (0, _characterModels.getCharacterModels)('type');
beforeAll(() => _graphqlCompose.schemaComposer.clear());
describe('composeChildTC ->', () => {
  const CharacterDTC = (0, _composeWithMongooseDiscriminators.composeWithMongooseDiscriminators)(CharacterModel);
  const PersonTC = CharacterDTC.discriminator(PersonModel);
  const DroidTC = CharacterDTC.discriminator(DroidModel);
  it('should set DInterface to childTC', () => {
    expect(DroidTC.hasInterface(CharacterDTC.getDInterface())).toBeTruthy();
    expect(PersonTC.hasInterface(CharacterDTC.getDInterface())).toBeTruthy();
  });
  it('should copy all baseFields from BaseDTC to ChildTCs', () => {
    expect(DroidTC.getFieldNames()).toEqual(expect.arrayContaining(CharacterDTC.getFieldNames()));
    expect(PersonTC.getFieldNames()).toEqual(expect.arrayContaining(CharacterDTC.getFieldNames()));
  });
  it('should make childTC have same fieldTypes as baseTC', () => {
    const characterFields = CharacterDTC.getFieldNames();

    for (const field of characterFields) {
      expect(DroidTC.getFieldType(field)).toEqual(CharacterDTC.getFieldType(field));
      expect(PersonTC.getFieldType(field)).toEqual(CharacterDTC.getFieldType(field));
    }
  });
  it('should operate normally like any other ObjectTypeComposer', () => {
    const fields = PersonTC.getFieldNames();
    PersonTC.addFields({
      field: {
        type: 'String'
      }
    });
    expect(PersonTC.getFieldNames()).toEqual(fields.concat(['field']));
    PersonTC.removeField('field');
    expect(PersonTC.getFieldNames()).toEqual(fields);
  });
});