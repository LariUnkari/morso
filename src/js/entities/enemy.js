import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Entity } from "./entity.js";

class Enemy extends Entity {
  constructor(name, type, options) {
    super(name, type, options);

    this.processOptions(options);

    this.nextMoveTime = this.moveInterval;
  }

  processOptions(options) {
    super.processOptions(options);
    this.moveInterval = Number.isNaN(options.moveInterval) ? 0 : options.moveInterval;
    this.killScore = Number.isNaN(options.killScore) ? 0 : options.killScore;
  }

  kill() {
    super.kill();
    GameEventHandler.emit(GameEvent.ENEMY_DIED, this);
  }

  // Called each frame with delta time in milliseconds
  onUpdate(deltaTime) {
    super.onUpdate(deltaTime);

    if (this.canMove === true && this.moveInterval > 0 && this.isEnabled === true) {
      if (GameData.tickTime >= this.nextMoveTime) {
        this.nextMoveTime += this.moveInterval;
        this.onMoveTime();
      }
    }
  }

  onMoved() {
    if (GameData.player === null) {
      console.warn(this.name + ": Player not found!");
      return;
    }

    if (GameData.player.isAlive && this.coordinate.equals(GameData.player.coordinate)) {
      GameData.player.kill();
    }
  }

  onMoveTime() {
    // Do nothing, extending classes will add behaviour
  }
}

export { Enemy };
