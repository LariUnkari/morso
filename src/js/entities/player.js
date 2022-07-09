import MathUtil from "../utility/mathUtil.js";
import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import InputHandler from "../input/inputHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Entity } from "./entity.js";
import { EntityType } from "../entities/entityType.js";
import { Direction } from "../map/direction.js";

class Player extends Entity {
  constructor(name, type, options) {
    super(name, type, options);
    console.log("Player created");

    this.inputDirection = null;
    this.moveWestInput = InputHandler.setupInputKey("MoveWest", 0x25, this.onInputWest.bind(this));
    this.moveEastInput = InputHandler.setupInputKey("MoveEast", 0x27, this.onInputEast.bind(this));
    this.moveNorthInput = InputHandler.setupInputKey("MoveNorth", 0x26, this.onInputNorth.bind(this));
    this.moveSouthInput = InputHandler.setupInputKey("MoveSouth", 0x28, this.onInputSouth.bind(this));
  }

  enable() {
    console.log("Player enabled");
    super.enable();
  }

  disable() {
    console.log("Player disabled");
    super.disable();
  }

  kill(instigator) {
    super.kill(instigator);
  }

  onDeath(instigator) {
    super.onDeath(instigator);
    GameEventHandler.emit(GameEvent.PLAYER_DIED, instigator);
  }

  canAttackEntity(target) {
    return MathUtil.getBitFromMask(EntityType.Enemy, target.type);
  }

  attackEntity(target) {
    this.kill(target);
  }

  onMoveTime() {
    if (this.inputDirection !== null) {
      this.tryMove(this.inputDirection);
    }
  }

  onInputNorth(isDown) {
    this.inputDirection = isDown ? Direction.North : this.getInputDirection();
    if (isDown) { this.tryMoveQuick(this.inputDirection); }
  }

  onInputSouth(isDown) {
    this.inputDirection = isDown ? Direction.South : this.getInputDirection();
    if (isDown) { this.tryMoveQuick(this.inputDirection); }
  }

  onInputEast(isDown) {
    this.inputDirection = isDown ? Direction.East : this.getInputDirection();
    if (isDown) { this.tryMoveQuick(this.inputDirection); }
  }

  onInputWest(isDown) {
    this.inputDirection = isDown ? Direction.West : this.getInputDirection();
    if (isDown) { this.tryMoveQuick(this.inputDirection); }
  }

  getInputDirection() {
    if (this.moveNorthInput.isDown) { return Direction.North; }
    if (this.moveSouthInput.isDown) { return Direction.South; }
    if (this.moveEastInput.isDown) { return Direction.East; }
    if (this.moveWestInput.isDown) { return Direction.West; }
    return null;
  }

  tryMoveQuick(direction) {
    if (this.tryMove(direction)) { this.nextMoveTime += this.moveInterval; }
  }
}

export { Player };
