import { Coordinate } from "../map/coordinate.js";
import { Direction, CardinalDirections } from "../map/direction.js";
import { Map } from "../map/map.js";
import { Player } from "../entities/player.js";
import { InputHandler } from "../input/inputHandler.js";

class GameView extends PIXI.Container {
  constructor(resources) {
    super();

    this.resources = resources;
    this.inputHandler = new InputHandler();
    this.map = new Map(40, 21, undefined, this.resources);
    this.player = new Player(this.map, resources);
    this.addChild(this.map, this.player);

    this.player.setCoordinate(new Coordinate(5, 10), this.map);

    this.arrowLeft = this.inputHandler.setupInputKey(
      "ArrowLeft", 0x25, this.onInputLeft.bind(this));
    this.arrowUp = this.inputHandler.setupInputKey(
      "ArrowUp", 0x26, this.onInputUp.bind(this));
    this.arrowRight = this.inputHandler.setupInputKey(
      "ArrowRight", 0x27, this.onInputRight.bind(this));
    this.arrowDown = this.inputHandler.setupInputKey(
      "ArrowDown", 0x28, this.onInputDown.bind(this));
  }

  onInputLeft(isDown) {
    //console.log("Input! Left: " + (isDown ? "down" : "up"));
    if (isDown) { this.player.tryMove(Direction.Left, this.map); }
  }

  onInputUp(isDown) {
    //console.log("Input! Up: " + (isDown ? "down" : "up"));
    if (isDown) { this.player.tryMove(Direction.Up, this.map); }
  }

  onInputRight(isDown) {
    //console.log("Input! Right: " + (isDown ? "down" : "up"));
    if (isDown) { this.player.tryMove(Direction.Right, this.map); }
  }

  onInputDown(isDown) {
    //console.log("Input! Down: " + (isDown ? "down" : "up"));
    if (isDown) { this.player.tryMove(Direction.Down, this.map); }
  }
}

export { GameView };
