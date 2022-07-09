class Stage {
  constructor(level, round) {
    this.level = level;
    this.round = round;
  }

  set(from) {
    this.level = from.level;
    this.round = from.round;
  }

  equals(other) {
    return this.level === other.level && this.round === other.round;
  }

  greaterThan(other) {
    return this.level > other.level || (this.level === other.level && this.round > other.round);
  }

  lessThan(other) {
    return this.level < other.level || (this.level === other.level && this.round < other.round);
  }

  toString() {
    return this.level + "-" + this.round;
  }
}

export { Stage };
