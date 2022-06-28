class GameData {
  constructor() {
    this.resources = null;
    this.map = null;
    this.player = null;
    this.enemies = [];
    this.score = 0;
    this.isGameOn = false;
    this.gameTime = 0;
    this.tickTime = 0;
  }

  getAllEntities() {
    return this.enemies.concat(this.player);
  }
}

export default (new GameData());
