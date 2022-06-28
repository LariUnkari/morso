import GameConfiguration from "../gameConfiguration.js";
import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Coordinate } from "../map/coordinate.js";
import { Direction } from "../map/direction.js";
import { Map } from "../map/map.js";
import { TileType } from "../map/tileType.js";
import { Player } from "../entities/player.js";
import { Monster } from "../entities/monster.js";
import { EntityType, EntityIds } from "../entities/entityType.js";
import { FillSearch } from "../map/fillSearch.js";
import { InputHandler } from "../input/inputHandler.js";

class GameView extends PIXI.Container {
  constructor() {
    super();

    GameData.player = new Player("Player", EntityType.Player,
      GameConfiguration.entities[EntityIds[EntityType.Player]]);
    GameData.player.visible = false;
    GameData.map = new Map(40, 21, undefined);
    GameData.map.visible = false;
    this.addChild(GameData.map, GameData.player);

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
    GameData.map.generate();
    GameData.map.visible = true;

    let startTile = FillSearch.findNearestTileOfType(GameData.map,
      new Coordinate(5, 10), TileType.Floor);

    GameData.player.setCoordinate(startTile.coordinate);
    GameData.player.visible = true;
    GameData.player.revive();
    GameData.player.enable();

    let monster, type, options, x, y;
    const enemyCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < enemyCount; i++) {
      type = i === 0 ? EntityType.MonsterSmall : EntityType.MonsterBig;
      options = GameConfiguration.entities[EntityIds[type]];

      monster = new Monster("Monster" + (i + 1), type, options);
      this.addChild(monster);
      GameData.enemies[i] = monster;

      x = GameData.map.grid.width - 2 - Math.floor(3 * Math.random());
      y = Math.floor((i + 1) * GameData.map.grid.height / (enemyCount + 1));

      startTile = FillSearch.findNearestTileOfType(GameData.map,
        new Coordinate(x, y), TileType.Floor);
      monster.setCoordinate(startTile.coordinate);
      monster.enable();

      GameData.isGameOn = true;
    }
  }

  quitGame() {
    GameData.map.clear();
    GameData.map.visible = false;
    GameData.player.disable();
    GameData.player.visible = false;
    for (let i = 0; i < GameData.enemies.length; i++) {
      this.removeChild(GameData.enemies[i]);
    }
    GameData.enemies = [];
    GameData.gameTime = 0;
    GameData.tickTime = 0;

    GameEventHandler.emit(GameEvent.GAME_ENDED);
  }

  // Called each frame with delta time in milliseconds
  onUpdate(deltaTime) {
    //console.log("Game tick time is now " + tickTime + "ms, enemies: " + GameData.enemies.length);
    if (!GameData.isGameOn) { return; }

    GameData.gameTime += deltaTime;
    GameData.tickTime = Math.floor(GameData.gameTime);

    for (let i = 0; i < GameData.enemies.length; i++) {
      GameData.enemies[i].onUpdate(deltaTime);
    }
  }

  onInputLeft(isDown) {
    if (GameData.player.isEnabled) {
      if (isDown) { GameData.player.tryMove(Direction.Left); }
    }
  }

  onInputUp(isDown) {
    if (GameData.player.isEnabled) {
      if (isDown) { GameData.player.tryMove(Direction.Up); }
    }
  }

  onInputRight(isDown) {
    if (GameData.player.isEnabled) {
      if (isDown) { GameData.player.tryMove(Direction.Right); }
    }
  }

  onInputDown(isDown) {
    if (GameData.player.isEnabled) {
      if (isDown) { GameData.player.tryMove(Direction.Down); }
    }
  }
}

export { GameView };
