import { Coordinate } from "../map/coordinate.js";
import { TileType } from "../map/tileType.js";

class Entity extends PIXI.Container {
  constructor(spriteName, options) {
    super();

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

  setCoordinate(coordinate, map) {
    this.coordinate = coordinate;
    this.position.copyFrom(
      map.getGridPositionFromCoordinatesWithOffset(coordinate));
  }

  move(direction, map) {
    this.setCoordinate(this.coordinate.plus(direction), map);
  }

  tryMove(direction, map) {
    const desiredPos = this.coordinate.plus(direction);
    if (map.isCoordinateOutOfBounds(desiredPos)) { return; }

    const tile = map.getTileAtCoordinates(desiredPos);
    if (tile === null || tile.type == TileType.None) { return; }

    if (tile.type === TileType.Wall && this.canPush) {
      if (!this.tryPush(tile, direction, map)) { return; }
    }

    this.move(direction, map);
  }

  tryPush(fromTile, direction, map) {
    if (direction.x === 0 && direction.y === 0) {
      return false;
    }

    let tile;
    let validPush = false;
    const coordinate = fromTile.coordinate.plus(direction);

    while (!map.isCoordinateOutOfBounds(coordinate)) {
      tile = map.getTileAtCoordinates(coordinate);

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
}

export { Entity };
