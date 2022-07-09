import { Stage } from "./utility/stage.js";

class GameData {
  constructor() {
    this.resources = null;
    this.map = null;
    this.player = null;
    this.enemies = [];
    this.kills = 0;
    this.score = 0;
    this.isGameOn = false;
    this.isRoundActive = false;
    this.gameTime = 0;
    this.tickTime = 0;
    this.stage = new Stage(0, 0);
  }

  getEnemyCount(onlyLiving) {
    let count = 0;
    this.enemies.forEach((enemy)=>{ if (enemy.isAlive || !onlyLiving) { count++; }});
    return count;
  }

  getAllEntities() {
    return this.enemies.concat(this.player);
  }
}

export default (new GameData());
