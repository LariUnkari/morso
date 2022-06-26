import { Entity } from "./entity.js";

class Enemy extends Entity {
  constructor(spriteName, options) {
    super(spriteName, options);

    this.killScore = Number.isNaN(options.killScore) ? 0 : options.killScore;
  }
}

export { Enemy };
