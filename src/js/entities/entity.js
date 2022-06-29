import GameData from "../gameData.js";
import { Coordinate } from "../map/coordinate.js";
import { TileType } from "../map/tileType.js";
import { EntityType } from "../entities/entityType.js";
import { MathUtil } from "../utility/mathUtil.js";

class Entity extends PIXI.Container {
  constructor(name, type, options) {
    super();

    this.name = name;
    this.type = type;
    this.spriteName = "placeholder";

    this.processOptions(options);

    this.sprite = new PIXI.Sprite(PIXI.Texture.from(this.spriteName));
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.canPush = options.canPush === true;
    this.isAlive = true;
    this.isEnabled = false;
    this.coordinate = new Coordinate(-1, -1);
  }

  processOptions(options) {
    this.debug = options.debug === true;
    this.canMove = options.canMove === true;
    if (options.spriteName !== undefined) { this.setSpriteName(options.spriteName); }
  }

  setSpriteName(spriteName) {
      if (GameData.resources[spriteName] === undefined) {
        console.warn("Unable to find sprite by the name of '" + spriteName + "'!");
        return;
      }

      this.spriteName = spriteName;
  }

  updateSprite() {
    console.log(this.name + ": Setting sprite to '" + this.spriteName + "'");
    this.sprite.texture = PIXI.Texture.from(this.spriteName);
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
    GameData.map.removeOccupationOfCoordinate(this.coordinate, this);
  }

  revive() {
    this.isAlive = true;
    this.sprite.tint = 0xFFFFFF;
  }

  setCoordinate(coordinate, removeOccupation, setOccupation) {
    if (this.coordinate.equals(coordinate)) { return; }

    if (removeOccupation) {
      GameData.map.removeOccupationOfCoordinate(this.coordinate, this);
    }
    if (setOccupation) {
      GameData.map.setOccupationOfCoordinate(coordinate, this);
    }

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
      if (GameData.map.isCoordinateOutOfBounds(nextCoordinate)) { break; }
      tile = GameData.map.getTileAtCoordinates(nextCoordinate);
    }

    return false;
  }

  move(direction) {
    this.setCoordinate(this.coordinate.plus(direction), true, true);
    this.onMoved();
  }

  onMoved() {
    // Do nothing, extending classes will add behaviour
  }

  checkMove(direction) {
    const result = { isValid:false, tile:null, entity:null };
    if (this.canMove !== true) { return result; }

    const desiredPos = this.coordinate.plus(direction);
    if (GameData.map.isCoordinateOutOfBounds(desiredPos)) { return result; }

    result.tile = GameData.map.getTileAtCoordinates(desiredPos);
    result.entity = GameData.map.getOccupationOfCoordinate(desiredPos);

    if (result.tile === null || result.tile.type !== TileType.Floor) { return result; }
    if (result.entity && !this.canAttackEntity(result.entity)) { return result; }

    result.isValid = true;
    return result;
  }

  tryMove(direction) {
    const moveTest = this.checkMove(direction);

    if (!moveTest.isValid) {
      if (moveTest.tile && moveTest.tile.type === TileType.Wall) {
        if (!this.tryPush(moveTest.tile, direction)) { return false; }
      } else { return false; }
    }

    if (moveTest.entity) { this.attackEntity(moveTest.entity); }

    this.move(direction);
    return true;
  }

  canAttackEntity(target) {
    return false;
  }

  attackEntity(target) {
    // Do nothing, extending classes will add behaviour
  }

  checkPush(fromTile, direction) {
    const result = { isValid:false, tile:null, entity:null };

    if (this.canMove !== true) { return result; }
    if (this.canPush !== true) { return result; }
    if (direction.x === 0 && direction.y === 0) { return result; }

    let tile;
    const coordinate = fromTile.coordinate.plus(direction);

    while (!GameData.map.isCoordinateOutOfBounds(coordinate)) {
      tile = GameData.map.getTileAtCoordinates(coordinate);

      if (tile === undefined) {
        console.error("Error getting tile to push at " + coordinate.toString());
        break;
      }

      if (tile.type === TileType.Floor) {
        result.tile = tile;
        result.entity = GameData.map.getOccupationOfCoordinate(coordinate);

        if (result.entity) {
          result.isValid = MathUtil.getBitFromMask(EntityType.Enemy, result.entity.type);
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
    const pushTest = this.checkPush(fromTile, direction);

    if (pushTest.isValid === true) {
      pushTest.tile.setType(TileType.Wall);
      fromTile.setType(TileType.Floor);

      if (pushTest.entity) { pushTest.entity.kill(); }
    }

    return pushTest.isValid;
  }

  // Called each frame with delta time in milliseconds
  onUpdate(deltaTime) {
    // Do nothing, extending classes will add behaviour
  }
}

export { Entity };
