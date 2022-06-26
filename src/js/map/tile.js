import { TileType, TileNames } from "./tileType.js";
import { Coordinate } from "./coordinate.js";

class Tile extends PIXI.Container {
  constructor(coordinate, type, id, size) {
    super();

    this.coordinate = coordinate;
    this.id = id;
    this.type = type;
    this.size = size;

    this.sprite = new PIXI.Sprite(this.getTextureForTileType(this.type));
    this.sprite.anchor.set(0.5);
    //this.sprite.beginFill(type === TileType. ? 0x000000 : 0xFFFFFF);
    //const halfSize = this.size/2;
    //this.sprite.drawRect(-Math.floor(halfSize), -Math.floor(halfSize),
    //  this.size, this.size);
    //this.sprite.endFill();
    this.addChild(this.sprite);

    //console.log("Created tile of type " + this.type + " '" +
    //  TileNames[this.type] + "' at coordinate " + this.coordinate.toString() +
    //  ", grid size " + size);
  }

  setType(type) {
    this.type = type;
    this.sprite.texture = this.getTextureForTileType(this.type);
  }

  getTextureForTileType(type) {
    if (type === TileType.None) {
      return PIXI.Texture.from("tile_void");
    }
    if (type === TileType.Floor) {
      return PIXI.Texture.from("tile_floor");
    }
    if (type === TileType.Wall) {
      return PIXI.Texture.from("tile_wall");
    }
    return null;
  }

  getDebugString() {
    return "Tile[" + this.id + "]" + this.coordinate.toString() + " '" +
      this.type + ":" + TileNames[this.type] + "'";
  }
}

export { Tile };
