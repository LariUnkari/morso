import { Coordinate } from "./coordinate.js";
import { Tile } from "./tile.js";
import { TileType } from "./tileType.js";

const GRID_SCALE = 32;
const WALL_RATIO_RANGE = { min:0.1, max:0.4 };

class Map extends PIXI.Container {
  constructor(width, height, wall_ratio) {
    super();

    this.grid = { width, height };
    this.dimensions = { width:width*GRID_SCALE, height:height*GRID_SCALE };
    this.wall_ratio = wall_ratio === undefined || Number.isNaN(wall_ratio) ?
      this.getRandomWallRatio() : this.getConstrainedWallRatio(wall_ratio);

    console.log("Creating map of dimensions " + this.grid.width + "x" +
      this.grid.height + " on scale " + GRID_SCALE + ", dimensions " +
      this.dimensions.width + "x" + this.dimensions.height + ", wall ratio: " +
      this.wall_ratio);

    this.gridContainer = new PIXI.Container();
    this.gridContainer.position.set(
      Math.floor(0.5 * GRID_SCALE), Math.floor(0.5 * GRID_SCALE));
    this.addChild(this.gridContainer);

    let coordinate, id, newTile, gridPos;
    this.tiles = [];

    for (let x = 0; x < this.grid.width; x++) {
      this.tiles[x] = [];

      for (let y = 0; y < this.grid.height; y++) {
        coordinate = new Coordinate(x, y);
        id = this.getCoordinateId(coordinate);
        newTile = new Tile(coordinate, TileType.None, id, GRID_SCALE);
        this.tiles[x][y] = newTile;

        gridPos = this.getGridPositionFromCoordinates(coordinate);
        newTile.position.set(gridPos.x, gridPos.y);
        this.gridContainer.addChild(newTile);
      }
    }
  }

  generate() {
    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {
        this.tiles[x][y].setType(this.getRandomTileType());
      }
    }
  }

  clear() {
    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {
        this.tiles[x][y].setType(TileType.None);
      }
    }
  }

  isCoordinateOutOfBounds(coordinate) {
    return coordinate.x < 0 || coordinate.x >= this.grid.width ||
           coordinate.y < 0 || coordinate.y >= this.grid.height;
  }

  getCoordinateId(coordinate) {
    return (this.grid.width * coordinate.y + coordinate.x).toString();
  }

  getGridPositionFromCoordinatesWithOffset(coordinate) {
    return {
      x:this.gridContainer.x + coordinate.x * GRID_SCALE,
      y:this.gridContainer.y + coordinate.y * GRID_SCALE};
  }

  getGridPositionFromCoordinates(coordinate) {
    return { x:coordinate.x * GRID_SCALE, y:coordinate.y * GRID_SCALE };
  }

  getTileAtCoordinates(coordinate) {
    return this.tiles[coordinate.x][coordinate.y];
  }

  getConstrainedWallRatio(input) {
    console.log("Getting constrained wall ratio from " + input);
    return Math.min(Math.max(input, WALL_RATIO_RANGE.min), WALL_RATIO_RANGE.max);
  }

  getRandomWallRatio() {
    console.log("Getting random wall ratio between " + WALL_RATIO_RANGE.min +
      " and " + WALL_RATIO_RANGE.max);
    return WALL_RATIO_RANGE.min +
      Math.random() * (WALL_RATIO_RANGE.max - WALL_RATIO_RANGE.min);
  }

  getRandomTileType() {
    return Math.random() < this.wall_ratio ? TileType.Wall : TileType.Floor;
  }
}

export { Map };
