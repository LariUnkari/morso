import MathUtil from "../utility/mathUtil.js";
import { Coordinate } from "./coordinate.js";
import { Tile } from "./tile.js";
import { TileType } from "./tileType.js";

const GRID_SCALE = 32;

class Map extends PIXI.Container {
  constructor(width, height) {
    super();

    this.grid = { width, height };
    this.dimensions = { width:width*GRID_SCALE, height:height*GRID_SCALE };

    console.log("Creating map of dimensions " + this.grid.width + "x" +
      this.grid.height + " on scale " + GRID_SCALE + ", dimensions " +
      this.dimensions.width + "x" + this.dimensions.height);

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

    this.occupiedTiles = {};
  }

  generate(wallRatio) {
    this.wallRatio = wallRatio && !Number.isNaN(wallRatio) ? wallRatio :
      MathUtil.getRandomValueInRangeFloat(GameConfiguration.map.wallRatioRange);

    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {
        this.tiles[x][y].setType(this.getRandomTileType(this.wallRatio));
      }
    }
  }

  clear() {
    this.wallRatio = 0;
    this.occupiedTiles = {};
    
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

  isCoordinateOccupied(coordinate) {
    return this.occupiedTiles[this.getCoordinateId(coordinate)] !== undefined;
  }

  getOccupationOfCoordinate(coordinate) {
    if (this.isCoordinateOutOfBounds(coordinate)) { return null; }

    const coordinateId = this.getCoordinateId(coordinate);
    return this.occupiedTiles[coordinateId];
  }

  setOccupationOfCoordinate(coordinate, occupier) {
    if (!occupier || this.isCoordinateOutOfBounds(coordinate)) { return; }

    const coordinateId = this.getCoordinateId(coordinate);
    const previousOccupier = this.occupiedTiles[coordinateId];

    if (!previousOccupier) {
      this.occupiedTiles[coordinateId] = occupier;
    } else {
      console.warn("Unable to set a occupier '" + occupier.entityName + "' to coordinate '" +
        coordinateId + "' " + coordinate.toString() + ", expected undefined, found " +
        previousOccupier.entityName);
    }
  }

  removeOccupationOfCoordinate(coordinate, occupier) {
    if (!occupier || this.isCoordinateOutOfBounds(coordinate)) { return; }

    const coordinateId = this.getCoordinateId(coordinate);
    const previousOccupier = this.occupiedTiles[coordinateId];

    if (occupier === previousOccupier) {
      this.occupiedTiles[coordinateId] = undefined;
    } else {
      console.warn("Unable to remove a non-matching occupier from coordinate '" +
        coordinateId + "' " + coordinate.toString() + ", expected " + occupier.entityName +
        ", found " + (previousOccupier ? "'" + previousOccupier.entityName + "'" : "undefined"));
    }
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

  getRandomTileType(wallRatio) {
    return Math.random() < wallRatio ? TileType.Wall : TileType.Floor;
  }
}

export { Map };
