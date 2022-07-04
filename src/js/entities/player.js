import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import InputHandler from "../input/inputHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Entity } from "./entity.js";
import { EntityType } from "../entities/entityType.js";
import { Direction } from "../map/direction.js";
import { MathUtil } from "../utility/mathUtil.js";

class Player extends Entity {
  constructor(name, type, options) {
    super(name, type, options);
    console.log("Player created");

    InputHandler.setupInputKey("MoveWest",  0x25, this.onInputLeft.bind(this));
    InputHandler.setupInputKey("MoveNorth", 0x26, this.onInputUp.bind(this));
    InputHandler.setupInputKey("MoveEast",  0x27, this.onInputRight.bind(this));
    InputHandler.setupInputKey("MoveSouth", 0x28, this.onInputDown.bind(this));
  }

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

  onInputLeft(isDown) {
    if (this.isEnabled) {
      if (isDown) { this.tryMove(Direction.West); }
    }
  }

  onInputUp(isDown) {
    if (this.isEnabled) {
      if (isDown) { this.tryMove(Direction.North); }
    }
  }

  onInputRight(isDown) {
    if (this.isEnabled) {
      if (isDown) { this.tryMove(Direction.East); }
    }
  }

  onInputDown(isDown) {
    if (this.isEnabled) {
      if (isDown) { this.tryMove(Direction.South); }
    }
  }
}

export { Player };
