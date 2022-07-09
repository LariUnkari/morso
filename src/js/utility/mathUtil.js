class MathUtil {
  // Gets the boolean value of a specific bit from any bitmask
  getBitFromMask(bit, mask) {
    return ((mask >> bit) & 1) === 1;
  }

  // Gets a random integer value between parameters min (inclusive) and max (inclusive) in range object
  getRandomValueInRangeInt(range) {
    return Math.floor(this.getValueInRangeAt(Math.random(), range));
  }

  // Gets a random float value between parameters min (inclusive) and max (exclusive) in range object
  getRandomValueInRangeFloat(range) {
    return this.getValueInRangeAt(Math.random(), range);
  }

  // Gets a random float value between parameters min (inclusive) and max (exclusive) in range object
  getValueInRangeAt(position, range) {
    return range.min + position * (range.max - range.min);
  }
}

export default (new MathUtil());
