class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  offset(coordinate) {
    this.x += coordinate.x;
    this.y += coordinate.y;
  }

  // Returns a new Coordinate with summed parameters
  plus(coordinate) {
    return new Coordinate(this.x + coordinate.x, this.y + coordinate.y);
  }

  // Returns a new Coordinate with subtracted parameters
  minus(coordinate) {
    return new Coordinate(this.x - coordinate.x, this.y - coordinate.y);
  }

  equals(coordinate) {
    return coordinate !== undefined && coordinate !== null &&
      this.x === coordinate.x && this.y === coordinate.y;
  }

  toString() {
    return "(x:" + this.x + ", y:" + this.y + ")";
  }
}

export { Coordinate };
