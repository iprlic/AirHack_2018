/**
 * Takes an array of objects and sorts the array depending
 * on a key that must be present in every object.
 *
 * @param {Object[]} objArray - The array to be sorted
 * @param {string} key - The object key to sort the array by
 * @param {boolean} [ascending=true] - Determines whether sorting should be ascending or descending
 * @return {Object[]} An array of objects sorted by key
 */
const sortByObjectKey = (objArray, key, ascending = true) => {
  const directionFactor = ascending ? 1 : -1;
  return objArray.concat().sort(function(a, b) {
    if (a[key] < b[key]) {
      return -1 * directionFactor;
    } else if (a[key] > b[key]) {
      return directionFactor;
    } else {
      return 0;
    }
  });
};

export { sortByObjectKey };
