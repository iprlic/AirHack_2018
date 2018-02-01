/**
 * Resolves a promise hash
 *
 * @param {Object} hash - The promise hash
 * @return {Object} THe resolved hash
 */
const promiseHash = async function(hash) {
  const keys = Object.keys(hash);
  const values = keys.map(key => hash[key]);

  const resolvedValues = await Promise.all(values);

  const resolvedHash = {};
  keys.forEach((key, index) => (resolvedHash[key] = resolvedValues[index]));

  return resolvedHash;
};

export { promiseHash };
