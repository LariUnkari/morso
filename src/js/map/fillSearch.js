import { Direction, CardinalDirections } from "./direction.js";

var findNearestTileOfType = (map, coordinate, type) => {

  const result = { found:false, tile:null };
  findNearestTileOfTypeStepper(map, coordinate, type, {}, result);
  return result.found ? result.tile : null;
};

var findNearestTileOfTypeStepper = (map, coordinate, type, closed, result) => {
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

    findNearestTileOfTypeStepper(map, nextCoordinate, type, closed, result);
    if (result.found === true) { break; }
  }
};

const FillSearch = { findNearestTileOfType, findNearestTileOfTypeStepper };

export { FillSearch };
