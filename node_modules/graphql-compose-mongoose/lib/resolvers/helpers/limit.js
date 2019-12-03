"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.limitHelper = limitHelper;
exports.limitHelperArgs = exports.getLimitHelperArgsOptsMap = void 0;

// for merging, discriminators merge-able only
const getLimitHelperArgsOptsMap = () => ({
  defaultValue: 'number'
});

exports.getLimitHelperArgsOptsMap = getLimitHelperArgsOptsMap;

const limitHelperArgs = opts => {
  return {
    limit: {
      type: 'Int',
      defaultValue: opts && opts.defaultValue || 1000
    }
  };
};

exports.limitHelperArgs = limitHelperArgs;

function limitHelper(resolveParams) {
  const limit = parseInt(resolveParams.args && resolveParams.args.limit, 10) || 0;

  if (limit > 0) {
    resolveParams.query = resolveParams.query.limit(limit); // eslint-disable-line
  }
}