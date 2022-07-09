import { EntityType, EntityIds } from "./entities/entityType.js";

class GameConfiguration {
  constructor() {
    this.player = {
      initialLives: 2,
      getExtraLifeScore:(extraLifeIndex) => {
         return 1000 * (1 + Math.floor(Math.pow(extraLifeIndex + 1, 3) / 4));
      }
    };
    
    this.rounds = {
      roundsPerLevel: 5
    };

    this.entities = { enemyLimit:32 };
    this.entities[EntityIds[EntityType.Player]] = {
      spriteName: "entity_player",
      canMove:true,
      moveInterval: 200,
      canPush:true
    };
    this.entities[EntityIds[EntityType.MonsterEgg]] = {
      spriteName: "entity_monster_egg",
      canMove:false,
      incubateDuration: { min:20000, max:30000 },
      killScore: 200
    };
    this.entities[EntityIds[EntityType.MonsterSmall]] = {
      spriteName: "entity_monster_small",
      canMove:true,
      moveInterval: 500,
      growthDuration: { min:40000, max:50000 },
      killScore: 150,
      stuckMemoryDuration:5
    };
    this.entities[EntityIds[EntityType.MonsterBig]] = {
      spriteName: "entity_monster_big",
      canMove:true,
      moveInterval: 1000,
      layEggDuration: { min:25000, max:45000 },
      layEggLimit: 2,
      killScore: 100,
      stuckMemoryDuration:7
    };

    this.styles = {
      text: {
        generic:{ fontFamily:"Arial", fontSize:32, fill:0xFFFFFF },
        resultTitle:{ fontFamily:"Arial", fontSize:96, fill:0xFFFFFF },
        resultDescription:{ fontFamily:"Arial", fontSize:32, fill:0xFFFFFF }
      },
      button: {
        confirm:{ fontFamily:"Arial", fontSize:32, fill:0xFF0000 },
        decline:{ fontFamily:"Arial", fontSize:32, fill:0xFF0000 }
      }
    };
  }
}

export default (new GameConfiguration());
