import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Entity } from "./entity.js";

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

  onMoved() {
    if (this.isAlive) {
      for (let enemy of GameData.enemies) {
        if (this.coordinate.equals(enemy.coordinate)) {
          this.kill();
          break;
        }
      }
    }
  }
}

export { Player };
