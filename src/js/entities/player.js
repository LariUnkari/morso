import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Entity } from "./entity.js";
import { EntityType } from "../entities/entityType.js";
import { MathUtil } from "../utility/mathUtil.js";

class Player extends Entity {
  enable() {
    console.log("Player enabled");
    super.enable();
  }

  disable() {
    console.log("Player disabled");
    super.disable();
  }

  kill() {
    super.kill();
    GameEventHandler.emit(GameEvent.PLAYER_DIED, this);
  }

  canAttackEntity(target) {
    return MathUtil.getBitFromMask(EntityType.Enemy, target.type);
  }

  attackEntity(target) {
    this.kill();
  }
}

export { Player };
