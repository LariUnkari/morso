const MathUtil = {
  // Gets the boolean value of a specific bit from any bitmask
  getBitFromMask: (bit, mask) => {
    return ((mask >> bit) & 1) === 1;
  },

  // Gets a random integer value between parameters min (inclusive) and max (inclusive) in range object
  getRandomValueInRangeInt: (range) => {
    return range.min + Math.floor(Math.random() * (range.max + 1 - range.min));
  },

  // Gets a random float value between parameters min (inclusive) and max (exclusive) in range object
  getRandomValueInRangeFloat: (range) => {
    return range.min + Math.random() * (range.max - range.min);
  }
};

export { MathUtil };
