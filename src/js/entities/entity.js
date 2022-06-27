import GameData from "../gameData.js";
import { Coordinate } from "../map/coordinate.js";
import { TileType } from "../map/tileType.js";
import { EntityType } from "../entities/entityType.js";

class Entity extends PIXI.Container {
  constructor(name, type, spriteName, options) {
    super();

    this.name = name;
    this.type = type;
    this.sprite = new PIXI.Sprite(PIXI.Texture.from(spriteName));
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.canPush = options.canPush === true;
    this.isAlive = true;
    this.isEnabled = false;
    this.coordinate = new Coordinate(0, 0);
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  kill() {
    this.isAlive = false;
    this.sprite.tint = 0x333333;
    this.disable();
  }

  revive() {
    this.isAlive = true;
    this.sprite.tint = 0xFFFFFF;
  }

  setCoordinate(coordinate) {
    this.coordinate = coordinate;
    this.position.copyFrom(
      GameData.map.getGridPositionFromCoordinatesWithOffset(coordinate));
  }

  checkVisibilityTo(direction, toCoordinate) {
    // Neighbouring tile is always visible
    let dist = this.coordinate.getManhattanDistanceTo(toCoordinate);
    if (dist === 1) { return true; }

    // Check if too far off direct grid line (adjacent is ok)
    const diff = toCoordinate.minus(this.coordinate);
    if ((direction.x !== 0 && Math.abs(diff.y) > 1) ||
        (direction.y !== 0 && Math.abs(diff.x) > 1)) {
      return false;
    }

    // Check along the direction line if visible tiles continue adjacent to target
    let nextCoordinate = this.coordinate.plus(direction);
    let tile = GameData.map.getTileAtCoordinates(nextCoordinate);
    while (tile !== null && tile.type === TileType.Floor) {
      if (dist <= 1) {
        return true;
      }

      dist--;
      nextCoordinate = nextCoordinate.plus(direction);
      tile = GameData.map.getTileAtCoordinates(nextCoordinate);
    }

    return false;
  }

  move(direction) {
    this.setCoordinate(this.coordinate.plus(direction));
    this.onMoved();
  }

  onMoved() {
    // Do nothing, extending classes will add behaviour
  }

  checkMove(direction) {
    const desiredPos = this.coordinate.plus(direction);
    if (GameData.map.isCoordinateOutOfBounds(desiredPos)) { return false; }

    const tile = GameData.map.getTileAtCoordinates(desiredPos);
    if (tile === null || tile.type == TileType.None) { return false; }

    if (tile.type === TileType.Wall) {
      if (!this.canPush || !this.couldPush(tile, direction)) { return false; }
    }

    return true;
  }

  tryMove(direction) {
    const desiredPos = this.coordinate.plus(direction);
    if (GameData.map.isCoordinateOutOfBounds(desiredPos)) { return false; }

    const tile = GameData.map.getTileAtCoordinates(desiredPos);
    if (tile === null || tile.type == TileType.None) { return false; }

    if (tile.type === TileType.Wall) {
      if (!this.canPush || !this.tryPush(tile, direction)) { return false; }
    }

    this.move(direction);
    return true;
  }

  checkPush(fromTile, direction) {
    if (direction.x === 0 && direction.y === 0) {
      return false;
    }

    let tile;
    const result = { isValid:false, tile:null, entity:null };
    const coordinate = fromTile.coordinate.plus(direction);

    while (!GameData.map.isCoordinateOutOfBounds(coordinate)) {
      tile = GameData.map.getTileAtCoordinates(coordinate);

      if (tile === undefined) {
        console.error("Error getting tile to push at " + coordinate.toString());
        break;
      }

      if (tile.type === TileType.Floor) {
        result.target = tile;

        for (let entity of GameData.getAllEntities()) {
          if (entity.coordinate.equals(coordinate)) {
            result.entity = entity;
          }
        }

        if (result.entity !== null) {
          result.isValid = (result.entity.type >> (EntityType.Enemy - 1)) & 1 === 1;
        } else {
          result.isValid = true;
        }

        break;
      }

      coordinate.offset(direction);
    }

    return result;
  }

  tryPush(fromTile, direction) {
    const push = this.checkPush(fromTile, direction);

    if (push.isValid === true) {
      push.target.setType(TileType.Wall);
      fromTile.setType(TileType.Floor);

      if (push.entity !== null) {
        push.entity.kill();
      }
    }

    return push.isValid;
  }

  // Called each frame with delta time in milliseconds
  onUpdate(deltaTime) {
    // Do nothing, extending classes will add behaviour
  }
}

export { Entity };
