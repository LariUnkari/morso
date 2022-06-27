import { Coordinate } from "./coordinate.js";

const Direction = {
  Left:new Coordinate(-1, 0),
  Up:new Coordinate(0, -1),
  Right:new Coordinate(1, 0),
  Down:new Coordinate(0, 1)
};

const GridDirections = [
  Direction.Left, Direction.Up, Direction.Right, Direction.Down
];

export { Direction, GridDirections };
