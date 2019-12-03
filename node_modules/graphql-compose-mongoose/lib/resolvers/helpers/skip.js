"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skipHelper = skipHelper;
exports.skipHelperArgs = void 0;

const skipHelperArgs = () => {
  return {
    skip: {
      type: 'Int'
    }
  };
};

exports.skipHelperArgs = skipHelperArgs;

function skipHelper(resolveParams) {
  const skip = parseInt(resolveParams && resolveParams.args && resolveParams.args.skip, 10);

  if (skip > 0) {
    resolveParams.query = resolveParams.query.skip(skip); // eslint-disable-line
  }
}