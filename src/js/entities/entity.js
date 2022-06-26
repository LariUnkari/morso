import GameData from "../gameData.js";
import { Coordinate } from "../map/coordinate.js";
import { TileType } from "../map/tileType.js";

class Entity extends PIXI.Container {
  constructor(name, spriteName, options) {
    super();

    this.name = name;
    this.sprite = new PIXI.Sprite(PIXI.Texture.from(spriteName));
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.canPush = options.canPush === true;
    this.isEnabled = false;
    this.coordinate = new Coordinate(0, 0);
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  setCoordinate(coordinate) {
    this.coordinate = coordinate;
    this.position.copyFrom(
      GameData.map.getGridPositionFromCoordinatesWithOffset(coordinate));
  }

  move(direction) {
    this.setCoordinate(this.coordinate.plus(direction));
  }

  tryMove(direction) {
    const desiredPos = this.coordinate.plus(direction);
    if (GameData.map.isCoordinateOutOfBounds(desiredPos)) { return; }

    const tile = GameData.map.getTileAtCoordinates(desiredPos);
    if (tile === null || tile.type == TileType.None) { return; }

    if (tile.type === TileType.Wall && this.canPush) {
      if (!this.tryPush(tile, direction)) { return; }
    }

    this.move(direction);
  }

  tryPush(fromTile, direction) {
    if (direction.x === 0 && direction.y === 0) {
      return false;
    }

    let tile;
    let validPush = false;
    const coordinate = fromTile.coordinate.plus(direction);

    while (!GameData.map.isCoordinateOutOfBounds(coordinate)) {
      tile = GameData.map.getTileAtCoordinates(coordinate);

      if (tile === undefined) {
        console.error("Error getting tile to push at " + coordinate.toString());
        return false;
      }

      if (tile.type === TileType.Floor) {
        validPush = true;
        break;
      }

      coordinate.offset(direction);
    }

    if (validPush) {
      tile.setType(TileType.Wall);
      fromTile.setType(TileType.Floor);
    }

    return validPush;
  }

  // Called each frame with delta time in milliseconds
  onUpdate(deltaTime) {
    // Do nothing, extending classes will add behaviour
  }
}

export { Entity };
