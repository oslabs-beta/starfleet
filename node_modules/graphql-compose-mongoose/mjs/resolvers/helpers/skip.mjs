export const skipHelperArgs = () => {
  return {
    skip: {
      type: 'Int'
    }
  };
};
export function skipHelper(resolveParams) {
  const skip = parseInt(resolveParams && resolveParams.args && resolveParams.args.skip, 10);

  if (skip > 0) {
    resolveParams.query = resolveParams.query.skip(skip); // eslint-disable-line
  }
}