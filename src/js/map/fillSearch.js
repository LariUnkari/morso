import { Direction, CardinalDirections } from "./direction.js";

var fillSearchNearestTileOfType = (coordinate, type, map) => {
  console.log("FillSearch: finding tile of type " + type +
    " nearest to " + coordinate.toString());

  const result = { found:false, tile:null };
  fillSearchNearestTileOfTypeStepper(coordinate, type, map, {}, result);
  return result.found ? result.tile : null;
};

var fillSearchNearestTileOfTypeStepper = (coordinate, type, map, closed, result) => {
  console.log("FillSearch: stepping to tile " + coordinate.toString());
  result.tile = map.getTileAtCoordinates(coordinate);

  if (tile.type === type) {
    console.log("FillSearch: tile was of type " + type);
    result.found = true;
    return;
  }

  closed[tile.id] = tile;

  let nextCoordinate;
  for (let direction of CardinalDirections) {
    nextCoordinate = coordinate.plus(direction);
    
    if (map.isCoordinateOutOfBounds(nextCoordinate)) { continue; }
    if (closed[map.getCoordinateId(nextCoordinate)] !== undefined) { continue; }

    fillSearchNearestTileOfTypeStepper(nextCoordinate, type, map, closed, result);
    if (result.found === true) { break; }
  }
};

export { fillSearchNearestTileOfType };
