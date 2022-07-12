import Parser from "./utility/parser.js";
import { Stage } from "./utility/stage.js";

class GameData {
  constructor() {
    this.resources = null;
    this.map = null;
    this.player = null;
    this.enemies = [];
    this.stage = new Stage(0, 0);
    this.livesRemaining = 0;
    this.extraLivesGiven = 0;
    this.extraLifeScore = 0;
    this.kills = 0;
    this.score = 0;
    this.gameTime = 0;
    this.tickTime = 0;
    this.isGameOn = false;
    this.isRoundActive = false;
    this.highScore = 0;
    this.highStage = new Stage(0, 0);
  }

  getEnemyCount(onlyLiving) {
    let count = 0;
    this.enemies.forEach((enemy)=>{ if (enemy.isAlive || !onlyLiving) { count++; }});
    return count;
  }

  getAllEntities() {
    return this.enemies.concat(this.player);
  }

  readHighScoresFromStorage() {
    const scoreObject = JSON.parse(window.localStorage.getItem("HighScores") || "{}");
    if (scoreObject.score) { this.highScore = Parser.parseInt(scoreObject.score); }
    if (scoreObject.stage) { this.highStage = Parser.parseStage(scoreObject.stage); }
  }

  writeHighScoresToStorage() {
    window.localStorage.setItem("HighScores", JSON.stringify({
        score:this.highScore.toFixed(0),
        stage:this.highStage.toString()
      }
    ));
  }
}

export default (new GameData());
