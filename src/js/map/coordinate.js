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

  getManhattanDistanceTo(toCoordinate) {
    const diff = this.minus(toCoordinate);
    return Math.abs(diff.x) + Math.abs(diff.y);

  // North is 0, South is 180, East side is positive, West side negative from zero
  getAngleOnGrid() {
    if (this.x === 0 && this.y === 0) return 0;
    if (this.x === 0) { return this.y > 0 ? 180 : 0; }
    if (this.y === 0) { return this.x > 0 ? 90 : -90; }
    return Math.atan2(this.x, -this.y) * 180 / Math.PI;
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
