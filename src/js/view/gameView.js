import MathUtil from "../utility/mathUtil.js";
import GameConfiguration from "../gameConfiguration.js";
import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { Coordinate } from "../map/coordinate.js";
import { GridMap } from "../map/gridMap.js";
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
    GameEventHandler.emit(GameEvent.ENTITY_SPAWNED, GameData.player);

    GameData.map = new GridMap(40, 21, undefined);
    GameData.map.visible = false;
    this.addChild(GameData.map, GameData.player);
  }

  startRound(stage) {
    const roundCount =
     (stage.level - 1) * GameConfiguration.rounds.roundsPerLevel + stage.round;
    const wallRatio = MathUtil.getValueInRangeAt(
      GameConfiguration.map.getWallRatioMultiplier(roundCount),
      GameConfiguration.map.wallRatioRange);

    GameData.map.generate(wallRatio);
    GameData.map.visible = true;

    this.reSpawnPlayer();

    const enemyTypes = [EntityType.MonsterEgg, EntityType.MonsterSmall, EntityType.MonsterBig];
    const enemyConfig = GameConfiguration.getRoundEnemyConfig(enemyTypes, roundCount);
    let enemiesSpawned = 0;

    let x, y, set;
    for (let i = 0; i < enemyTypes.length; i++) {
      set = enemyConfig.sets[EntityIds[enemyTypes[i]]];

      for (let j = 0; j < set.count; j++) {
        enemiesSpawned++;

        x = GameData.map.grid.width - 2 - Math.floor(3 * Math.random());
        y = Math.floor(enemiesSpawned * GameData.map.grid.height / (enemyConfig.totalCount + 1));

        this.spawnMonster("Monster" + enemiesSpawned, set.type, new Coordinate(x, y));
      }
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

  reSpawnPlayer() {
    const preferredCoordinate = new Coordinate(5, 10);
    const startTile = FillSearch.findNearestTileOfType(GameData.map,
      preferredCoordinate, TileType.Floor, false);

    GameData.player.setCoordinate(startTile.coordinate, false, true);
    GameData.player.visible = true;
    GameData.player.revive();
    GameData.player.enable();
    GameData.player.giveInvulnerability(GameConfiguration.player.spawnInvulnerability);
  }

  spawnMonster(name, type, preferredCoordinate) {
    const options = GameConfiguration.entities[EntityIds[type]];
    const monster = new Monster(name, type, options);
    const startTile = FillSearch.findNearestTileOfType(GameData.map,
      preferredCoordinate, TileType.Floor, false);

    GameEventHandler.emit(GameEvent.ENTITY_SPAWNED, monster);

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
