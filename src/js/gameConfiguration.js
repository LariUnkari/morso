import { EntityType, EntityIds } from "./entities/entityType.js";

class GameConfiguration {
  constructor() {
    this.player = {
      spawnInvulnerability: 4,
      initialLives: 2,
      getExtraLifeScore: (extraLifeIndex) => {
         return 1000 * (1 + Math.floor(Math.pow(extraLifeIndex + 1, 3) / 4));
      }
    };

    this.rounds = { roundsPerLevel:5, enemyCounts:{} };
    this.rounds.enemyCounts[EntityIds[EntityType.MonsterEgg]] = (roundIndex) => {
      return Math.floor(1.85 + Math.pow(roundIndex, 1.200) / 25);
    };
    this.rounds.enemyCounts[EntityIds[EntityType.MonsterSmall]] = (roundIndex) => {
      return Math.floor(0.98 + Math.pow(roundIndex, 1.400) / 100);
    };
    this.rounds.enemyCounts[EntityIds[EntityType.MonsterBig]] = (roundIndex) => {
      return Math.floor(2.00 + Math.pow(roundIndex, 1.684) / 100);
    };

    this.map = {
      wallRatioRange: { min:0.16, max:0.24 },
      getWallRatioMultiplier: (roundIndex) => { return 1.05 / Math.pow(1.05, roundIndex); }
    };

    this.entities = { enemyLimit:32 };
    this.entities[EntityIds[EntityType.Player]] = {
      spriteName: "entity_player",
      canMove: true,
      moveInterval: 200,
      canPush: true
    };
    this.entities[EntityIds[EntityType.MonsterEgg]] = {
      spriteName: "entity_monster_egg",
      canMove: false,
      incubateDuration: { min:20000, max:30000 },
      killScore: 200
    };
    this.entities[EntityIds[EntityType.MonsterSmall]] = {
      spriteName: "entity_monster_small",
      moveInterval: 500,
      canMove: true,
      growthDuration: { min:40000, max:50000 },
      killScore: 150,
      stuckMemoryDuration: 5
    };
    this.entities[EntityIds[EntityType.MonsterBig]] = {
      spriteName: "entity_monster_big",
      moveInterval: 1000,
      canMove: true,
      layEggDuration: { min:25000, max:45000 },
      layEggLimit: 2,
      killScore: 100,
      stuckMemoryDuration: 7
    };

    this.styles = {
      text: {
        generic: { fontFamily:"Minecraft", fontSize:32, fill:0xFFFFFF },
        countdown: { fontFamily:"Minecraft", fontSize:64, fill:0xFFFFFF },
        resultTitle: { fontFamily:"Minecraft", fontSize:96, fill:0xFFFFFF },
        resultDescription: { fontFamily:"Minecraft", fontSize:32, fill:0xFFFFFF }
      },
      button: {
        confirm: { fontFamily:"Minecraft", fontSize:32, fill:0xFFFFFF, yMidPoint:0.45 },
        decline: { fontFamily:"Minecraft", fontSize:32, fill:0xFF0000, yMidPoint:0.45 }
      }
    };
  }

  getRoundEnemyConfig(types, roundIndex) {
    let totalCount = 0;
    const sets = {};

    let id;
    for (let i = 0; i < types.length; i++) {
      id = EntityIds[types[i]];
      sets[id] = { type:types[i], count:this.rounds.enemyCounts[id](roundIndex) };
      totalCount += sets[id].count;
    }

    return { totalCount, sets };
  }
}

export default (new GameConfiguration());
