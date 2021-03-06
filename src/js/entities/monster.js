import MathUtil from "../utility/mathUtil.js";
import GameConfiguration from "../gameConfiguration.js";
import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Enemy } from "./enemy.js";
import { EntityType, EntityIds } from "../entities/entityType.js";
import { Direction, GridDirections } from "../map/direction.js";
import { GridMemory } from "../utility/gridMemory.js";

class Monster extends Enemy {
  constructor(name, type, options) {
    super(name, type, options);

    this.stuckMemoryCount = 0;
    this.stuckCoordinates = new GridMemory();
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
    if (!MathUtil.getBitFromMask(EntityType.Enemy, newType)) {
      console.warn(this.entityName + ": Can't change from enemy type " + this.type +
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
    if (GameData.getEnemyCount(true) >= GameConfiguration.entities.enemyLimit) {
      return false;
    }

    if (this.eggLimit > 0) { return this.eggsLayed < this.eggLimit; }

    return true;
  }

  layEgg(coordinate) {
    this.eggsLayed++;
    const options = GameConfiguration.entities[EntityIds[EntityType.MonsterEgg]];
    const egg = new Monster(this.entityName + "-" + this.eggsLayed, EntityType.MonsterEgg, options);
    egg.setCoordinate(coordinate, false, true);
    egg.enable();
    GameEventHandler.emit(GameEvent.ENEMY_SPAWNED, egg);
  }

  onUpdate(deltaTime) {
    super.onUpdate(deltaTime);

    // Handle egg laying and growth
    if (this.type === EntityType.MonsterEgg) {
      if (GameData.tickTime >= this.hatchTime) {
        const hatchTime = this.hatchTime;
        this.changeType(EntityType.MonsterSmall);
        this.growthTime = hatchTime +
          MathUtil.getRandomValueInRangeInt(this.growthDuration);
        this.nextMoveTime = hatchTime - hatchTime % this.moveInterval + 2 * this.moveInterval;
        console.log(this.entityName + ": I hatched!");
      }
    }
    else if (this.type === EntityType.MonsterSmall) {
      if (GameData.tickTime >= this.growthTime) {
        const growthTime = this.growthTime;
        this.changeType(EntityType.MonsterBig);
        this.eggTime = growthTime + MathUtil.getRandomValueInRangeInt(this.eggDuration);
        console.log(this.entityName + ": I grew bigger!");
      }
    }
  }

  onMoveTime() {
    super.onMoveTime();

    this.handleStuckMemory();

    if (GameData.player === null) {
      console.warn(this.entityName + ": Player not found!");
      return;
    }

    if (GameData.player.coordinate.equals(this.coordinate)) {
      return;
    }

    const directions = this.getMoveDirections();

    if (directions.length === 0) { return; }
    if (directions.length === 1) {
      this.moveAndAttack(directions[0].direction, directions[0].entity);
      return;
    }

    const dirIndex = Math.floor(directions.length * Math.random());
    this.moveAndAttack(directions[dirIndex].direction, directions[dirIndex].entity);
  }

  getMoveDirections() {
    let desiredDirection = this.getBestDirectionToPlayer();
    let targetCoordinate = this.coordinate.plus(desiredDirection);
    let moveTest;

    if (this.checkVisibilityTo(desiredDirection, GameData.player.coordinate)) {
      moveTest = this.checkMove(desiredDirection);

      if (moveTest.isValid) {
        return [{direction:desiredDirection, entity:moveTest.entity}];
      }

      if (!moveTest.entity) {
        console.warn(this.entityName + ": Unable to move to visible direction to " +
          targetCoordinate.toString());
      }

      return [];
    }

    if (this.checkWasStuckAt(targetCoordinate)) {
      desiredDirection = null;
    } else {
      moveTest = this.checkMove(desiredDirection);
      if (moveTest.isValid) { return [{direction:desiredDirection, entity:moveTest.entity}]; }
    }

    const directions = [];
    let validDirs = 0;

    for (let dir of GridDirections) {
      // Was already unable to move there
      if (!desiredDirection || desiredDirection.equals(dir)) { continue; }

      moveTest = this.checkMove(dir);

      if (moveTest.isValid) {
        validDirs++;
        targetCoordinate = this.coordinate.plus(dir);
        if (!this.checkWasStuckAt(targetCoordinate)) {
          directions.push({direction:dir, entity:moveTest.entity});
        }
      }
    }

    const coordinateId = GameData.map.getCoordinateId(this.coordinate);

    if (validDirs <= 1) {
      this.stuckCoordinates.setEntry(coordinateId, this.coordinate, GameData.tickTime, null);
      this.stuckMemoryCount = this.stuckCoordinates.getKeys().length;
    }

    return directions;
  }

  move(direction) {
    const leavePosition = this.coordinate;
    super.move(direction);

    if (this.type === EntityType.MonsterBig) {
      if (this.canLayEgg() && GameData.tickTime >= this.eggTime) {
        this.layEgg(leavePosition);
        this.eggTime += MathUtil.getRandomValueInRangeInt(this.eggDuration);
        console.log(this.entityName + ": I layed an egg! " + this.eggsLayed + "/" + this.eggLimit + " egg limit");
      }
    }
  }

  getBestDirectionToPlayer() {
    const diff = GameData.player.coordinate.minus(this.coordinate);

    if (diff.x === 0 && diff.y === 0) { return diff; }
    
    const index = Math.round(diff.getAngleOnGrid() / 45);
    return GridDirections[index < 0 ? 8 + index : index];
  }

  checkWasStuckAt(coordinate) {
    return this.stuckCoordinates.hasEntry(GameData.map.getCoordinateId(coordinate));
  }

  handleStuckMemory() {
    if (this.stuckMemoryCount === 0) { return; }

    let stuckEntry, timePassed;
    let forgetList = [];

    for (let id of this.stuckCoordinates.getKeys()) {
      stuckEntry = this.stuckCoordinates.getEntry(id);
      timePassed = GameData.tickTime - stuckEntry.time;

      if (timePassed >= this.moveInterval * this.stuckMemoryDuration) {
        forgetList.push(id);
      }
    }

    for (let id of forgetList) {
      this.stuckCoordinates.removeEntry(id);
    }

    this.stuckMemoryCount = this.stuckCoordinates.getKeys().length;
  }
}

export { Monster };
