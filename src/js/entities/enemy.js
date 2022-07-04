import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Entity } from "./entity.js";
import { EntityType } from "../entities/entityType.js";

class Enemy extends Entity {
  processOptions(options) {
    super.processOptions(options);
    this.killScore = Number.isNaN(options.killScore) ? 0 : options.killScore;
  }

  kill() {
    super.kill();
    GameEventHandler.emit(GameEvent.ENEMY_DIED, this);
  }

  canAttackEntity(target) {
    return target.type === EntityType.Player;
  }

  attackEntity(target) {
    super.attackEntity(target);
    if (target.isAlive && target.type === EntityType.Player) { target.kill(); }
  }
}

export { Enemy };
