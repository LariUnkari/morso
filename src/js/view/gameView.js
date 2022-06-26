import GameData from "../gameData.js";
import { Coordinate } from "../map/coordinate.js";
import { Direction, CardinalDirections } from "../map/direction.js";
import { Map } from "../map/map.js";
import { TileType } from "../map/tileType.js";
import { Player } from "../entities/player.js";
import { MonsterBig } from "../entities/monsterBig.js";
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

    let startTile = FillSearch.findNearestTileOfType(
      new Coordinate(5, 10), TileType.Floor, this.map);

    this.player.setCoordinate(startTile.coordinate, this.map);
    this.player.visible = true;
    this.player.enable();

    let monster, x, y;
    const enemyCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < enemyCount; i++) {
      this.enemies[i] = monster;
      monster = new MonsterBig("MonsterBig" + (i + 1), "entity_monster_big",
        { canMove:true, moveInterval:800, killScore:100 });
      this.addChild(monster);

      x = this.map.grid.width - 2 - Math.floor(3 * Math.random());
      y = Math.floor((i + 1) * this.map.grid.height / (enemyCount + 1));

      startTile = FillSearch.findNearestTileOfType(new Coordinate(x, y),
        TileType.Floor, this.map);
      monster.setCoordinate(startTile.coordinate, this.map);
    }
  }

  quitGame() {
    this.map.clear();
    this.player.disable();
    this.player.visible = false;
    for (let i = 0; i < this.enemies.length; i++) {
      this.removeChild(this.enemies[i]);
    }
    this.enemies = [];
  }

  // Called each frame with delta time in milliseconds
  onUpdate(deltaTime) {
    //console.log("Game tick time is now " + tickTime + "ms, enemies: " + GameData.enemies.length);
    for (let i = 0; i < GameData.enemies.length; i++) {
      GameData.enemies[i].onUpdate(deltaTime);
    }
  }

  onInputLeft(isDown) {
    if (this.player.isEnabled) {
      if (isDown) { this.player.tryMove(Direction.Left, this.map); }
    }
  }

  onInputUp(isDown) {
    if (this.player.isEnabled) {
      if (isDown) { this.player.tryMove(Direction.Up, this.map); }
    }
  }

  onInputRight(isDown) {
    if (this.player.isEnabled) {
      if (isDown) { this.player.tryMove(Direction.Right, this.map); }
    }
  }

  onInputDown(isDown) {
    if (this.player.isEnabled) {
      if (isDown) { this.player.tryMove(Direction.Down, this.map); }
    }
  }
}

export { GameView };
