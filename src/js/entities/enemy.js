import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Entity } from "./entity.js";
import { EntityType } from "../entities/entityType.js";

class Enemy extends Entity {
  constructor(name, type, options) {
    super(name, type, options);

    GameEventHandler.emit(GameEvent.ENEMY_SPAWNED, this);
  }

  processOptions(options) {
    super.processOptions(options);
    this.killScore = Number.isNaN(options.killScore) ? 0 : options.killScore;
  }

  onDeath(instigator) {
    super.onDeath(instigator);
    GameEventHandler.emit(GameEvent.ENEMY_DIED, [this, instigator]);
  }

  canAttackEntity(target) {
    return target.type === EntityType.Player;
  }

  attackEntity(target) {
    super.attackEntity(target);
    if (target.isAlive && target.type === EntityType.Player) { target.kill(this); }
  }
}

export { Enemy };
