"use strict";

exports.__esModule = true;
exports.default = void 0;

var _graphqlCompose = require("graphql-compose");

var _mongooseCommon = require("./mongooseCommon");

var _fieldsConverter = require("../fieldsConverter");

// name: 'EnumLanguageName',
// description: 'Language names (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)',
const enumLanguageName = {
  en: {
    description: 'English'
  },
  ru: {
    description: 'Russian'
  },
  zh: {
    description: 'Chinese'
  }
};
const enumLanguageSkill = {
  basic: {
    description: 'can read'
  },
  fluent: {
    description: 'can talk'
  },
  native: {
    description: 'since birth'
  }
};
const LanguageSchema = new _mongooseCommon.Schema({
  ln: {
    type: String,
    description: 'Language names (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)',
    enum: Object.keys(enumLanguageName)
  },
  sk: {
    type: String,
    description: 'Language skills',
    enum: Object.keys(enumLanguageSkill)
  }
});
var _default = LanguageSchema; // Such way we can set Type name for Schema which is used in another schema.
// Otherwise by default it will have name `${ParentSchemaName}${ParentSchemaFieldName}`

exports.default = _default;
(0, _fieldsConverter.convertSchemaToGraphQL)(LanguageSchema, 'Language', _graphqlCompose.schemaComposer);