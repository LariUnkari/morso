import GameConfiguration from "../gameConfiguration.js";
import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Coordinate } from "../map/coordinate.js";
import { Map } from "../map/map.js";
import { TileType } from "../map/tileType.js";
import { Player } from "../entities/player.js";
import { Monster } from "../entities/monster.js";
import { EntityType, EntityIds } from "../entities/entityType.js";
import { FillSearch } from "../map/fillSearch.js";

class GameView extends PIXI.Container {
  constructor() {
    super();

    GameData.player = new Player("Player", EntityType.Player,
      GameConfiguration.entities[EntityIds[EntityType.Player]]);
    GameData.player.visible = false;
    GameData.map = new Map(40, 21, undefined);
    GameData.map.visible = false;
    this.addChild(GameData.map, GameData.player);
  }

  startRound(stage) {
    GameData.map.generate();
    GameData.map.visible = true;

    this.spawnPlayer();

    let x, y, type;
    const enemyCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < enemyCount; i++) {
      x = GameData.map.grid.width - 2 - Math.floor(3 * Math.random());
      y = Math.floor((i + 1) * GameData.map.grid.height / (enemyCount + 1));

      type = i === 0 ? EntityType.MonsterSmall : EntityType.MonsterBig;
      this.spawnMonster("Monster" + i, type, new Coordinate(x, y));
    }

    GameData.isGameOn = true;
  }

  clearRound() {
    GameData.map.clear();
  }

  endGame() {
    this.clearRound();
    GameData.map.visible = false;
  }

  spawnPlayer() {
    const preferredCoordinate = new Coordinate(5, 10);
    const startTile = FillSearch.findNearestTileOfType(GameData.map,
      preferredCoordinate, TileType.Floor);

    GameData.player.setCoordinate(startTile.coordinate, false, true);
    GameData.player.visible = true;
    GameData.player.revive();
    GameData.player.enable();
  }

  spawnMonster(name, type, preferredCoordinate) {
    const options = GameConfiguration.entities[EntityIds[type]];
    const monster = new Monster(name, type, options);
    const startTile = FillSearch.findNearestTileOfType(GameData.map,
      preferredCoordinate, TileType.Floor);

    monster.setCoordinate(startTile.coordinate, false, true);
    monster.enable();
  }

  // Called each frame with delta time in milliseconds
  onUpdate(deltaTime) {
    //console.log("Game tick time is now " + tickTime + "ms, enemies: " + GameData.enemies.length);
    if (!GameData.isGameOn) { return; }

    GameData.gameTime += deltaTime;
    GameData.tickTime = Math.floor(GameData.gameTime);

    if (GameData.player)  { GameData.player.onUpdate(deltaTime); }
    for (let i = 0; i < GameData.enemies.length; i++) {
      GameData.enemies[i].onUpdate(deltaTime);
    }
  }
}

export { GameView };
