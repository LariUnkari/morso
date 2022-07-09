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

    let startTile = FillSearch.findNearestTileOfType(GameData.map,
      new Coordinate(5, 10), TileType.Floor);

    GameData.player.setCoordinate(startTile.coordinate, false, true);
    GameData.player.visible = true;
    GameData.player.revive();
    GameData.player.enable();

    let monster, type, options, x, y;
    const enemyCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < enemyCount; i++) {
      type = i === 0 ? EntityType.MonsterSmall : EntityType.MonsterBig;
      options = GameConfiguration.entities[EntityIds[type]];

      monster = new Monster("Monster" + (i + 1), type, options);

      x = GameData.map.grid.width - 2 - Math.floor(3 * Math.random());
      y = Math.floor((i + 1) * GameData.map.grid.height / (enemyCount + 1));

      startTile = FillSearch.findNearestTileOfType(GameData.map,
        new Coordinate(x, y), TileType.Floor);
      monster.setCoordinate(startTile.coordinate, false, true);
      monster.enable();

      GameEventHandler.emit(GameEvent.ENEMY_SPAWNED, monster);
    }

    GameData.isGameOn = true;
  }

  clearRound() {
    GameData.map.clear();

    for (let i = 0; i < GameData.enemies.length; i++) {
      GameData.enemies[i].destroy({children:true});
    }

    GameData.enemies = [];
    GameData.gameTime = 0;
    GameData.tickTime = 0;
  }

  endGame() {
    this.clearRound();
    GameData.map.visible = false;
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
