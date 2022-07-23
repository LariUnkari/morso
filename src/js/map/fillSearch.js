import { Direction, GridDirections } from "./direction.js";

var findNearestTileOfType = (map, coordinate, type, allowOccupied) => {

  const result = { found:false, tile:null };
  findNearestTileOfTypeStepper(map, coordinate, type, allowOccupied, {}, result);
  return result.found ? result.tile : null;
};

var findNearestTileOfTypeStepper = (map, coordinate, type, allowOccupied, closed, result) => {
  result.tile = map.getTileAtCoordinates(coordinate);

  if (result.tile.type === type) {
    if (allowOccupied || !map.isCoordinateOccupied(coordinate)) {
      result.found = true;
      return;
    }
  }

  closed[result.tile.id] = result.tile;

  let nextCoordinate;
  for (let direction of GridDirections) {
    nextCoordinate = coordinate.plus(direction);

    if (map.isCoordinateOutOfBounds(nextCoordinate)) { continue; }
    if (closed[map.getCoordinateId(nextCoordinate)] !== undefined) { continue; }

    findNearestTileOfTypeStepper(map, nextCoordinate, type, allowOccupied, closed, result);
    if (result.found === true) { break; }
  }
};

const FillSearch = { findNearestTileOfType, findNearestTileOfTypeStepper };

export { FillSearch };
