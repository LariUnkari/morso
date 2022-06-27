import GameData from "../gameData.js";
import { Enemy } from "./enemy.js";
import { EntityType } from "../entities/entityType.js";
import { Direction, GridDirections } from "../map/direction.js";

class Monster extends Enemy {
  constructor(name, type, spriteName, options) {
    super(name, type, spriteName, options);

    if (this.type === EntityType.MonsterSmall) {
      this.growthInterval = Number.isNaN(options.growthTime) ? 30000 : options.growthTime;
      this.growthTime = this.growthInterval;
    }
    if (this.type === EntityType.MonsterBig) {
      this.eggInterval = Number.isNaN(options.eggTime) ? 40000 : options.eggTime;
      this.eggTime = this.eggInterval;
    }

    this.stuckMemoryDuration =
      Number.isNaN(options.stuckMemoryDuration) ? 7 : options.stuckMemoryDuration;
    this.stuckMemoryCount = 0;
    this.stuckCoordinates = {};
  }

  onUpdate(deltaTime) {
    super.onUpdate(deltaTime);

    if (this.type === EntityType.MonsterSmall) {
      if (GameData.tickTime >= this.growthTime) {
        console.log(this.name + ": Growing big, IF I ONLY KNEW HOW");
        this.growthTime += this.growthInterval;
      }
    }
    if (this.type === EntityType.MonsterBig) {
      if (GameData.tickTime >= this.eggTime) {
        console.log(this.name + ": Laying an egg, IF I ONLY KNEW HOW");
        this.eggTime += this.eggInterval;
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
