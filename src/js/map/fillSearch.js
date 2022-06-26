import { Direction, CardinalDirections } from "./direction.js";

var findNearestTileOfType = (coordinate, type, map) => {

  const result = { found:false, tile:null };
  findNearestTileOfTypeStepper(coordinate, type, map, {}, result);
  return result.found ? result.tile : null;
};

var findNearestTileOfTypeStepper = (coordinate, type, map, closed, result) => {
  result.tile = map.getTileAtCoordinates(coordinate);

  if (result.tile.type === type) {
    result.found = true;
    return;
  }

  closed[result.tile.id] = result.tile;

  let nextCoordinate;
  for (let direction of CardinalDirections) {
    nextCoordinate = coordinate.plus(direction);

    if (map.isCoordinateOutOfBounds(nextCoordinate)) { continue; }
    if (closed[map.getCoordinateId(nextCoordinate)] !== undefined) { continue; }

    findNearestTileOfTypeStepper(nextCoordinate, type, map, closed, result);
    if (result.found === true) { break; }
  }
};

const FillSearch = { findNearestTileOfType, findNearestTileOfTypeStepper };

export { FillSearch };
