import GameConfiguration from "../gameConfiguration.js";
import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Enemy } from "./enemy.js";
import { EntityType, EntityIds } from "../entities/entityType.js";
import { Direction, GridDirections } from "../map/direction.js";

class Monster extends Enemy {
  constructor(name, type, options) {
    super(name, type, options);

    if (this.type === EntityType.MonsterEgg) {
      this.growthTime = GameData.tickTime + this.growthInterval;
    }
    if (this.type === EntityType.MonsterSmall) {
      this.growthTime = GameData.tickTime + this.growthInterval;
    }
    if (this.type === EntityType.MonsterBig) {
      this.eggsLayed = 0;
      this.eggTime = GameData.tickTime + this.eggInterval;
    }

    this.stuckMemoryCount = 0;
    this.stuckCoordinates = {};
  }

  processOptions(options) {
    super.processOptions(options);

    this.growthInterval = Number.isNaN(options.growthTime) ? 30000 : options.growthTime;
    this.eggInterval = Number.isNaN(options.eggTime) ? 40000 : options.eggTime;
    this.eggLimit = Number.isNaN(options.eggLimit) ? 0 : options.eggLimit;
    this.stuckMemoryDuration =
      Number.isNaN(options.stuckMemoryDuration) ? 7 : options.stuckMemoryDuration;
  }

  changeType(newType) {
    if (((newType >> EntityType.Enemy) & 1) !== 1) {
      console.warn(this.name + ": Can't change from enemy type " + this.type +
        " '" + EntityIds[this.type] + "' to a non-enemy type " + newType +
        " '" + EntityIds[newType] + "'!");
      return;
    }

    this.type = newType;
    const options = GameConfiguration.entities[EntityIds[this.type]];
    this.processOptions(options);
    this.updateSprite();
  }

  layEgg() {
    this.eggsLayed++;
    const options = GameConfiguration.entities[EntityIds[EntityType.MonsterEgg]];
    const egg = new Monster(this.name + "-" + this.eggsLayed, EntityType.MonsterEgg, options);
    egg.setCoordinate(this.coordinate);
    egg.enable();
    GameEventHandler.emit(GameEvent.ENEMY_SPAWNED, egg);
  }

  onUpdate(deltaTime) {
    super.onUpdate(deltaTime);

    if (this.type === EntityType.MonsterEgg) {
      if (GameData.tickTime >= this.growthTime) {
        this.changeType(EntityType.MonsterSmall);
        this.nextMoveTime = this.growthTime + this.moveInterval;
        this.growthTime += this.growthInterval;
        console.log(this.name + ": I hatched!");
      }
    }
    else if (this.type === EntityType.MonsterSmall) {
      if (GameData.tickTime >= this.growthTime) {
        this.changeType(EntityType.MonsterBig);
        this.eggsLayed = 0;
        this.eggTime = this.growthTime + this.eggInterval;
        console.log(this.name + ": I grew bigger!");
      }
    }
    else if (this.type === EntityType.MonsterBig) {
      if (this.eggsLayed < this.eggLimit && GameData.tickTime >= this.eggTime) {
        this.layEgg();
        this.eggTime += this.eggInterval;
          console.log(this.name + ": I layed an egg!");
      }
    }
  }

  onMoveTime() {
    this.handleStuckMemory();

    if (GameData.player === null) {
      console.warn(this.name + ": Player not found!");
      return;
    }

    if (GameData.player.coordinate.equals(this.coordinate)) {
      return;
    }

    let desiredDirection = this.getPlayerBestDirection();
    let targetCoordinate = this.coordinate.plus(desiredDirection);

    if (this.checkVisibilityTo(desiredDirection, GameData.player.coordinate)) {
      if (!this.tryMove(desiredDirection)) {
        console.warn(this.name + ": Unable to move to visible direction to " + targetCoordinate.toString());
      }
      return;
    }

    if (this.checkWasStuckAt(targetCoordinate)) {
      desiredDirection = null;
    } else {
      if (this.tryMove(desiredDirection)) {
        return;
      }
    }

    const directions = [];
    let validDirs = 0;

    for (let dir of GridDirections) {
      if (dir.equals(desiredDirection)) { continue; } // Was already unable to move there
      targetCoordinate = this.coordinate.plus(dir);

      if (this.checkMove(dir)) {
        validDirs++;

        if (!this.checkWasStuckAt(targetCoordinate)) { directions.push(dir); }
      }
    }

    if (validDirs <= 1) {
      this.stuckCoordinates[GameData.map.getCoordinateId(this.coordinate)] = { coordinate:this.coordinate, time:GameData.tickTime };
      this.stuckMemoryCount = Object.keys(this.stuckCoordinates).length;
    }

    if (directions.length === 0) { return; }

    if (directions.length === 1) {
      this.move(directions[0]);
      return;
    }

    const dirIndex = Math.floor(directions.length * Math.random());
    this.move(directions[dirIndex]);
  }

  getPlayerBestDirection() {
    const diff = GameData.player.coordinate.minus(this.coordinate);

    if (Math.abs(diff.x) > Math.abs(diff.y)) {
      return diff.x < 0 ? Direction.Left : Direction.Right;
    } else {
      return diff.y < 0 ? Direction.Up : Direction.Down;
    }
  }

  checkWasStuckAt(coordinate) {
    return this.stuckCoordinates[GameData.map.getCoordinateId(coordinate)] !== undefined;
  }

  handleStuckMemory() {
    if (this.stuckMemoryCount === 0) { return; }

    let timePassed;
    let forgetList = [];

    for (let id of Object.keys(this.stuckCoordinates)) {
      timePassed = GameData.tickTime - this.stuckCoordinates[id].time;

      if (timePassed >= this.moveInterval * this.stuckMemoryDuration) {
        forgetList.push(id);
      }
    }

    for (let id of forgetList) {
      delete this.stuckCoordinates[id];
    }

    this.stuckMemoryCount = Object.keys(this.stuckCoordinates).length;
  }
}

export { Monster };
