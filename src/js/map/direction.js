import { Coordinate } from "./coordinate.js";

const Direction = {
  North:      new Coordinate(0,  -1),
  NorthEast:  new Coordinate(1,  -1),
  East:       new Coordinate(1,   0),
  SouthEast:  new Coordinate(1,   1),
  South:      new Coordinate(0,   1),
  SouthWest:  new Coordinate(-1,  1),
  West:       new Coordinate(-1,  0),
  NorthWest:  new Coordinate(-1, -1)
};

const GridDirections = [
  Direction.North, Direction.NorthEast, Direction.East, Direction.SouthEast,
  Direction.South, Direction.SouthWest, Direction.West, Direction.NorthWest
];

export { Direction, GridDirections };
