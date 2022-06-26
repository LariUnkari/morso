import { Coordinate } from "../map/coordinate.js";
import { Direction, CardinalDirections } from "../map/direction.js";
import { Map } from "../map/map.js";
import { TileType } from "../map/tileType.js";
import { Player } from "../entities/player.js";
import { FillSearch } from "../map/fillSearch.js";
import { InputHandler } from "../input/inputHandler.js";

class GameView extends PIXI.Container {
  constructor() {
    super();

    this.enemies = [];

    this.player = new Player("entity_player", { canPush:true });
    this.player.visible = false;
    this.map = new Map(40, 21, undefined);
    this.addChild(this.map, this.player);

    this.inputHandler = new InputHandler();

    this.arrowLeft = this.inputHandler.setupInputKey(
      "ArrowLeft", 0x25, this.onInputLeft.bind(this));
    this.arrowUp = this.inputHandler.setupInputKey(
      "ArrowUp", 0x26, this.onInputUp.bind(this));
    this.arrowRight = this.inputHandler.setupInputKey(
      "ArrowRight", 0x27, this.onInputRight.bind(this));
    this.arrowDown = this.inputHandler.setupInputKey(
      "ArrowDown", 0x28, this.onInputDown.bind(this));
  }

  startGame() {
    this.map.generate();
    const startTile = FillSearch.findNearestTileOfType(
      new Coordinate(5, 10), TileType.Floor, this.map);
    this.player.setCoordinate(startTile.coordinate, this.map);
    this.player.visible = true;
    this.player.enable();
  }

  quitGame() {
    this.map.clear();
    this.player.disable();
    this.player.visible = false;
  }

  onInputLeft(isDown) {
    //console.log("Input! Left: " + (isDown ? "down" : "up"));
    if (this.player.isEnabled) {
      if (isDown) { this.player.tryMove(Direction.Left, this.map); }
    }
  }

  onInputUp(isDown) {
    //console.log("Input! Up: " + (isDown ? "down" : "up"));
    if (this.player.isEnabled) {
      if (isDown) { this.player.tryMove(Direction.Up, this.map); }
    }
  }

  onInputRight(isDown) {
    //console.log("Input! Right: " + (isDown ? "down" : "up"));
    if (this.player.isEnabled) {
      if (isDown) { this.player.tryMove(Direction.Right, this.map); }
    }
  }

  onInputDown(isDown) {
    //console.log("Input! Down: " + (isDown ? "down" : "up"));
    if (this.player.isEnabled) {
      if (isDown) { this.player.tryMove(Direction.Down, this.map); }
    }
  }
}

export { GameView };
