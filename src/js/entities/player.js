import { Coordinate } from "../map/coordinate.js";
import { TileType } from "../map/tileType.js";

class Player extends PIXI.Container {
  constructor(resources) {
    super();

    this.resources = resources;
    this.sprite = new PIXI.Sprite(resources.player.texture);
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.coordinate = new Coordinate(0, 0);
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
    if (map.isCoordinateOutOfBounds(desiredPos)) {
      //console.log("Unable to move to out of bounds position " + desiredPos.x + "," + desiredPos.y);
      return;
    }

    const tile = map.getTileAtCoordinates(desiredPos);
    if (tile.type === TileType.Wall) {
      //console.log("Checking if wall at " + desiredPos.x + "," + desiredPos.y + " can be pushed");
      if (!this.tryPush(tile, direction, map)) {
        //console.log("Unable to move to obstructed position " + desiredPos.x + "," + desiredPos.y);
        return;
      }

      //console.log("Pushed tile at " + desiredPos.x + "," + desiredPos.y);
    }

    //console.log("Able to move to " + desiredPos.x + "," + desiredPos.y);
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

      //console.log("Checking to push " + tile.getDebugString());
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

export { Player };
