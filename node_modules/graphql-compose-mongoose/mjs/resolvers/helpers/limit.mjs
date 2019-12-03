// for merging, discriminators merge-able only
export const getLimitHelperArgsOptsMap = () => ({
  defaultValue: 'number'
});
export const limitHelperArgs = opts => {
  return {
    limit: {
      type: 'Int',
      defaultValue: opts && opts.defaultValue || 1000
    }
  };
};
export function limitHelper(resolveParams) {
  const limit = parseInt(resolveParams.args && resolveParams.args.limit, 10) || 0;

  if (limit > 0) {
    resolveParams.query = resolveParams.query.limit(limit); // eslint-disable-line
  }
}