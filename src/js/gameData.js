class GameData {
  constructor() {
    this.map = null;
    this.player = null;
    this.enemies = [];
    this.score = 0;
    this.isGameOn = false;
    this.gameTime = 0;
    this.tickTime = 0;
  }
}

export default (new GameData());
