import GameData from "../gameData.js";
import { Enemy } from "./enemy.js";
import { Direction, GridDirections } from "../map/direction.js";

class MonsterBig extends Enemy {
  constructor(name, spriteName, options) {
    super(name, spriteName, options);

    this.stuckMemoryCount = 0;
    this.stuckCoordinates = {};
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
      if (directions.length > 0) { this.move(directions[0]); }
      return;
    }

    const dir = directions[Math.floor(directions.length * Math.random())];
    this.move(dir);
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

      if (timePassed >= this.moveInterval * 7) {
        forgetList.push(id);
      }
    }

    for (let id of forgetList) {
      delete this.stuckCoordinates[id];
    }

    this.stuckMemoryCount = Object.keys(this.stuckCoordinates).length;
  }
}

export { MonsterBig };
