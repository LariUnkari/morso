class GameData {
  constructor() {
    this.resources = null;
    this.map = null;
    this.player = null;
    this.enemies = [];
    this.kills = 0;
    this.score = 0;
    this.isGameOn = false;
    this.isGameFinished = false;
    this.gameTime = 0;
    this.tickTime = 0;
  }

  getEnemyCount(onlyLiving) {
    return this.enemies.length - (onlyLiving ? this.kills : 0);
  }

  getAllEntities() {
    return this.enemies.concat(this.player);
  }
}

export default (new GameData());
