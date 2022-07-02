import { Coordinate } from "./coordinate.js";

const Direction = {
  North:      new Coordinate(0, -1),
  East:       new Coordinate(1, 0),
  South:      new Coordinate(0, 1),
  West:       new Coordinate(-1, 0)
};

const GridDirections = [
  Direction.North, Direction.East, Direction.South, Direction.West
];

export { Direction, GridDirections };
