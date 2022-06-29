import GameConfiguration from "../gameConfiguration.js";
import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Enemy } from "./enemy.js";
import { EntityType, EntityIds } from "../entities/entityType.js";
import { Direction, GridDirections } from "../map/direction.js";
import { MathUtil } from "../utility/mathUtil.js";

class Monster extends Enemy {
  constructor(name, type, options) {
    super(name, type, options);

    this.stuckMemoryCount = 0;
    this.stuckCoordinates = {};
  }

  processOptions(options) {
    super.processOptions(options);

    this.growthDuration = options.growthDuration;
    this.growthTime = this.growthDuration === undefined ? undefined :
      GameData.tickTime + MathUtil.getRandomValueInRangeInt(this.growthDuration);

    this.eggDuration = options.layEggDuration;
    this.eggTime = this.eggDuration === undefined ? undefined :
      GameData.tickTime + MathUtil.getRandomValueInRangeInt(this.eggDuration);
    this.eggLimit = options.layEggLimit;
    this.eggsLayed = Number.isNaN(this.eggLimit) ? undefined : 0;

    this.incubateDuration = options.incubateDuration;
    this.hatchTime = this.incubateDuration === undefined ? undefined :
      GameData.tickTime + MathUtil.getRandomValueInRangeInt(this.incubateDuration);

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

  canLayEgg() {
    if (this.eggLimit > 0) { return this.eggsLayed < this.eggLimit; }
    return true;
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
      if (GameData.tickTime >= this.hatchTime) {
        const hatchTime = this.hatchTime;
        this.changeType(EntityType.MonsterSmall);
        this.growthTime = hatchTime +
          MathUtil.getRandomValueInRangeInt(this.growthDuration);
        this.nextMoveTime = hatchTime - hatchTime % this.moveInterval + 2 * this.moveInterval;
        console.log(this.name + ": I hatched!");
      }
    }
    else if (this.type === EntityType.MonsterSmall) {
      if (GameData.tickTime >= this.growthTime) {
        const growthTime = this.growthTime;
        this.changeType(EntityType.MonsterBig);
        this.eggTime = growthTime + MathUtil.getRandomValueInRangeInt(this.eggDuration);
        console.log(this.name + ": I grew bigger!");
      }
    }
    else if (this.type === EntityType.MonsterBig) {
      if (this.canLayEgg() && GameData.tickTime >= this.eggTime) {
        this.layEgg();
        this.eggTime += MathUtil.getRandomValueInRangeInt(this.eggDuration);
        console.log(this.name + ": I layed an egg! " + this.eggsLayed + "/" + this.eggLimit + " egg limit");
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
