"use strict";

var _graphqlCompose = require("graphql-compose");

var _characterModels = require("../discriminators/__mocks__/characterModels");

var _movieModel = require("../discriminators/__mocks__/movieModel");

var _composeWithMongooseDiscriminators = require("../composeWithMongooseDiscriminators");

var _discriminators = require("../discriminators");

beforeAll(() => _movieModel.MovieModel.base.connect());
afterAll(() => _movieModel.MovieModel.base.disconnect());
const {
  CharacterModel,
  PersonModel
} = (0, _characterModels.getCharacterModels)('type');
describe('composeWithMongooseDiscriminators ->', () => {
  beforeEach(() => {
    _graphqlCompose.schemaComposer.clear();
  });
  describe('basics', () => {
    it('should create and return a DiscriminatorTypeComposer', () => {
      expect((0, _composeWithMongooseDiscriminators.composeWithMongooseDiscriminators)(CharacterModel)).toBeInstanceOf(_discriminators.DiscriminatorTypeComposer);
    });
    it('should return a ObjectTypeComposer as childTC on discriminator() call', () => {
      expect((0, _composeWithMongooseDiscriminators.composeWithMongooseDiscriminators)(CharacterModel).discriminator(PersonModel)).toBeInstanceOf(_graphqlCompose.ObjectTypeComposer);
    });
  });
  describe('composeWithMongoose customisationOptions', () => {
    it('required input fields, should be passed down to resolvers', () => {
      const typeComposer = (0, _composeWithMongooseDiscriminators.composeWithMongooseDiscriminators)(CharacterModel, {
        inputType: {
          fields: {
            required: ['kind']
          }
        }
      });
      const filterArgInFindOne = typeComposer.getResolver('findOne').getArg('filter');

      const inputComposer = _graphqlCompose.schemaComposer.createInputTC(filterArgInFindOne.type);

      expect(inputComposer.isFieldNonNull('kind')).toBe(true);
    });
    it('should proceed customizationOptions.inputType.fields.required', () => {
      const itc = (0, _composeWithMongooseDiscriminators.composeWithMongooseDiscriminators)(CharacterModel, {
        inputType: {
          fields: {
            required: ['name', 'friends']
          }
        }
      }).getInputTypeComposer();
      expect(itc.isFieldNonNull('name')).toBe(true);
      expect(itc.isFieldNonNull('friends')).toBe(true);
    });
    it('should be passed down record opts to resolvers', () => {
      const typeComposer = (0, _composeWithMongooseDiscriminators.composeWithMongooseDiscriminators)(CharacterModel, {
        resolvers: {
          createOne: {
            record: {
              removeFields: ['friends'],
              requiredFields: ['name']
            }
          }
        }
      });
      const createOneRecordArgTC = typeComposer.getResolver('createOne').getArgITC('record');
      expect(createOneRecordArgTC.isFieldNonNull('name')).toBe(true);
      expect(createOneRecordArgTC.hasField('friends')).toBe(false);
    });
    it('should pass down records opts to createMany resolver', () => {
      const typeComposer = (0, _composeWithMongooseDiscriminators.composeWithMongooseDiscriminators)(CharacterModel, {
        resolvers: {
          createMany: {
            records: {
              removeFields: ['friends'],
              requiredFields: ['name']
            }
          }
        }
      });
      const createManyRecordsArgTC = typeComposer.getResolver('createMany').getArgITC('records');
      expect(createManyRecordsArgTC.isFieldNonNull('name')).toBe(true);
      expect(createManyRecordsArgTC.hasField('friends')).toBe(false);
    });
  });
});