import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Coordinate } from "../map/coordinate.js";
import { Direction } from "../map/direction.js";
import { Map } from "../map/map.js";
import { TileType } from "../map/tileType.js";
import { Player } from "../entities/player.js";
import { Monster } from "../entities/monster.js";
import { EntityType } from "../entities/entityType.js";
import { FillSearch } from "../map/fillSearch.js";
import { InputHandler } from "../input/inputHandler.js";

class GameView extends PIXI.Container {
  constructor() {
    super();

    GameData.player = new Player("Player", EntityType.Player,
      { spriteName:"entity_player", canPush:true });
    GameData.player.visible = false;
    GameData.map = new Map(40, 21, undefined);
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

    let startTile = FillSearch.findNearestTileOfType(GameData.map,
      new Coordinate(5, 10), TileType.Floor);

    GameData.player.setCoordinate(startTile.coordinate);
    GameData.player.visible = true;
    GameData.player.revive();
    GameData.player.enable();

    let monster, type, spriteName, moveInterval, growthTime, eggTime, killScore, x, y;
    const enemyCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < enemyCount; i++) {
      type = i === 0 ? EntityType.MonsterSmall : EntityType.MonsterBig;
      spriteName = i === 0 ? "entity_monster_small" : "entity_monster_big";
      moveInterval = i === 0 ? 500 : 1000;
      growthTime = i === 0 ? 30000 : undefined;
      eggTime = i === 0 ? undefined : 40000;
      killScore = i === 0 ? 150 : 100;

      monster = new Monster("Monster" + (i + 1), type,
        {
           spriteName, moveInterval, growthTime, eggTime, killScore,
           canMove:true, stuckMemoryDuration:7
        });
      GameData.enemies[i] = monster;
      this.addChild(monster);

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
