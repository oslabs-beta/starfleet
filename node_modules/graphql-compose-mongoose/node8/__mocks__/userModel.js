"use strict";

exports.__esModule = true;
exports.UserModel = exports.UserSchema = void 0;

var _mongooseCommon = require("./mongooseCommon");

var _contactsSchema = _interopRequireDefault(require("./contactsSchema"));

var _enumEmployment = _interopRequireDefault(require("./enumEmployment"));

var _languageSchema = _interopRequireDefault(require("./languageSchema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserSchema = new _mongooseCommon.Schema({
  subDoc: {
    field1: String,
    field2: {
      field21: String,
      field22: String
    }
  },
  user: {
    type: _mongooseCommon.Schema.Types.ObjectId,
    ref: 'UserModel'
  },
  users: {
    type: [_mongooseCommon.Schema.Types.ObjectId],
    ref: 'UserModel'
  },
  name: {
    type: String,
    description: 'Person name'
  },
  age: {
    type: Number,
    description: 'Full years'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'ladyboy']
  },
  skills: {
    type: [String],
    default: [],
    description: 'List of skills'
  },
  employment: {
    type: [{
      type: String,
      enum: Object.keys(_enumEmployment.default)
    }],
    description: 'List of desired employment types',
    index: true
  },
  relocation: {
    type: Boolean,
    description: 'Does candidate relocate to another region'
  },
  contacts: {
    type: _contactsSchema.default,
    default: {},
    description: 'Contacts of person (phone, skype, mail and etc)'
  },
  languages: {
    type: [_languageSchema.default],
    default: [],
    description: 'Knowledge of languages'
  },
  __secretField: {
    type: String
  },
  someDynamic: {
    type: _mongooseCommon.Schema.Types.Mixed,
    description: "Some mixed value, that served with @taion's `graphql-type-json`"
  },
  periods: [{
    from: Number,
    to: Number
  }],
  someDeep: {
    periods: [{
      from: Number,
      to: Number
    }]
  },
  salary: {
    type: _mongooseCommon.Schema.Types.Decimal128
  },
  mapField: {
    type: Map,
    of: String
  },
  mapFieldDeep: {
    subField: {
      type: Map,
      of: String
    }
  } // createdAt, created via option `timastamp: true` (see bottom)
  // updatedAt, created via option `timastamp: true` (see bottom)

}, {
  timestamps: true,
  // add createdAt, updatedAt fields
  toJSON: {
    getters: true
  },
  toObject: {
    virtuals: true
  }
});
exports.UserSchema = UserSchema;
UserSchema.set('autoIndex', false);
UserSchema.index({
  name: 1,
  age: -1
}); // eslint-disable-next-line

UserSchema.virtual('nameVirtual').get(function () {
  return `VirtualFieldValue${this._id}`;
});

const UserModel = _mongooseCommon.mongoose.model('User', UserSchema);

exports.UserModel = UserModel;