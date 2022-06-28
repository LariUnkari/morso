import { EntityType, EntityIds } from "./entities/entityType.js";

class GameConfiguration {
  constructor() {
    this.entities = {};
    this.entities[EntityIds[EntityType.Player]] = {
      spriteName: "entity_player",
      canMove:true,
      canPush:true
    };
    this.entities[EntityIds[EntityType.MonsterSmall]] = {
      spriteName: "entity_monster_small",
      canMove:true,
      moveInterval: 500,
      growthTime: 30000,
      killScore: 150,
      stuckMemoryDuration:5
    };
    this.entities[EntityIds[EntityType.MonsterBig]] = {
      spriteName: "entity_monster_big",
      canMove:true,
      moveInterval: 1000,
      eggTime: 40000,
      killScore: 100,
      stuckMemoryDuration:7
    };
  }
}

export default (new GameConfiguration());
