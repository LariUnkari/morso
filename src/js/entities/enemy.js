import GameData from "../gameData.js";
import { Entity } from "./entity.js";

class Enemy extends Entity {
  constructor(name, spriteName, options) {
    super(name, spriteName, options);

    this.canMove = options.canMove === true;
    this.moveInterval = Number.isNaN(options.moveInterval) ? 1000 : options.moveInterval;
    this.killScore = Number.isNaN(options.killScore) ? 0 : options.killScore;

    this.nextMoveTime = this.moveInterval;
  }

  // Called each frame with delta time in milliseconds
  onUpdate(deltaTime) {
    super.onUpdate(deltaTime);

    if (this.canMove) {
      if (GameData.tickTime >= this.nextMoveTime) {
        this.nextMoveTime += this.moveInterval;
        this.onMoveTime();
      }
    }
  }

  onMoveTime() {
    // Do nothing, extending classes will add behaviour
  }
}

export { Enemy };
