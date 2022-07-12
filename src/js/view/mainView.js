import { gsap, PixiPlugin } from "/lib/gsap/all.js";
import GameConfiguration from "../gameConfiguration.js";
import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { GameView } from "./gameView.js";
import { Stage } from "../utility/stage.js";
import { EntityType, EntityIds } from "../entities/entityType.js";

class MainView extends PIXI.Container {
  constructor(resources) {
    super();

    gsap.registerPlugin(PixiPlugin);

    this.startRoundCount = 0;
    this.startRoundTimer = 0;

    this.frame = new PIXI.Container();
    this.frameOuter = new PIXI.Graphics();
    this.frameOuter.beginFill(0xFFFFFF);
    this.frameOuter.drawRect(0, 0, 2, 2);
    this.frameOuter.endFill();
    this.frameInner = new PIXI.Graphics();
    this.frameInner.beginFill(0x000000);
    this.frameInner.drawRect(0, 0, 2, 2);
    this.frameInner.endFill();
    this.frameInner.position.set(2,2);
    this.frame.addChild(this.frameOuter, this.frameInner);

    this.gameView = new GameView(resources);
    this.gameView.position.set(4, 4);

    this.startButton = new PIXI.Text("START", GameConfiguration.styles.text.generic);
    this.startButton.interactive = true;
    this.startButton.buttonMode = true;
    this.startButton.on("click", this.onClickStart.bind(this));

    this.endButton = new PIXI.Text("QUIT", GameConfiguration.styles.button.decline);
    this.endButton.interactive = true;
    this.endButton.buttonMode = true;
    this.endButton.on("click", this.onClickEnd.bind(this));
    this.endButton.visible = false;

    this.scoreText = new PIXI.Text("SCORE: 0", GameConfiguration.styles.text.generic);
    this.stageText = new PIXI.Text("STAGE: 0-0", GameConfiguration.styles.text.generic);
    this.livesRemainingText = new PIXI.Text("LIVES: 0", GameConfiguration.styles.text.generic);
    this.extraLifeScoreText = new PIXI.Text("+1 LIFE: 0", GameConfiguration.styles.text.generic);
    this.highScoreText = new PIXI.Text("HIGH SCORE: 0", GameConfiguration.styles.text.generic);
    this.highStageText = new PIXI.Text("HIGHEST STAGE: 0-0", GameConfiguration.styles.text.generic);

    this.countdown = new PIXI.Text("3", GameConfiguration.styles.text.countdown);
    this.countdown.anchor.set(0.5);
    this.countdown.visible = false;

    this.gameResult = new PIXI.Container();
    this.gameResultShadow = new PIXI.Sprite(PIXI.Texture.from("blob"));
    this.gameResultShadow.anchor.set(0.5);
    this.gameResultShadow.tint = 0x000000;
    this.gameResultTitle = new PIXI.Text("TITLE", GameConfiguration.styles.text.resultTitle);
    this.gameResultDescription = new PIXI.Text("DESCRIPTION", GameConfiguration.styles.text.resultDescription);

    this.gameResultTitle.position.set(
      -Math.floor(this.gameResultTitle.width / 2),
      -Math.floor(this.gameResultTitle.height / 2));
    this.gameResultDescription.position.set(
      -Math.floor(this.gameResultDescription.width / 2),
      this.gameResultTitle.y + this.gameResultTitle.height);

    this.gameResult.addChild(this.gameResultShadow, this.gameResultTitle,
      this.gameResultDescription);
    this.gameResult.visible = false;

    this.addChild(this.frame, this.gameView, this.stageText, this.scoreText,
      this.livesRemainingText, this.extraLifeScoreText, this.highScoreText,
      this.highStageText, this.startButton, this.endButton, this.gameResult,
      this.countdown);

    this.setHighScore(GameData.highScore.toFixed(0));
    this.setHighStage(GameData.highStage.toString());

    GameEventHandler.on(GameEvent.PLAYER_DIED, (instigator)=>this.onPlayerDied(instigator));
    GameEventHandler.on(GameEvent.ENEMY_SPAWNED, (enemy)=>this.onEnemySpawned(enemy));
    GameEventHandler.on(GameEvent.ENEMY_DIED, (args)=>this.onEnemyDied(args[0], args[1]));
  }

  setStage(stage) {
    this.stageText.text = "STAGE: " + stage.toString();
  }

  setScore(amount) {
    this.scoreText.text = "SCORE: " + amount;
  }

  setLives(remaining) {
    this.livesRemainingText.text = "LIVES: " + remaining;
  }

  setExtraLifeScore(score) {
    this.extraLifeScoreText.text = "+1 LIFE: " + score;
  }

  setHighScore(scoreText) {
    this.highScoreText.text = "HIGH SCORE: " + scoreText;
  }

  setHighStage(valueText) {
    this.highStageText.text = "HIGHEST STAGE: " + valueText;
  }

  startGame() {
    GameData.player.revive();
    GameData.stage = new Stage(1, 1);
    GameData.isGameOn = true;
    GameData.kills = 0;
    GameData.score = 0;
    GameData.livesRemaining = GameConfiguration.player.initialLives;
    GameData.extraLifeScore = GameConfiguration.player.getExtraLifeScore(0);
    GameData.extraLivesGiven = 0;

    this.livesRemainingText.visible = true;
    this.extraLifeScoreText.visible = true;
    this.startButton.visible = false;
    this.endButton.visible = true;

    this.setStage(GameData.stage);
    this.setScore(GameData.score);
    this.setLives(GameData.livesRemaining);
    this.setExtraLifeScore(GameData.extraLifeScore);

    this.startNextRoundCountdown();
  }

  advanceToNextRound() {
    if (GameData.stage.round < GameConfiguration.rounds.roundsPerLevel) {
      GameData.stage.round++;
    } else {
      GameData.stage.level++;
      GameData.stage.round = 1;
    }
  }

  startRound() {
    GameData.isRoundActive = true;
    GameData.player.visible = true;

    this.setStage(GameData.stage);

    this.gameView.startRound(GameData.stage);
    this.countdown.visible = false;
    this.gameResult.visible = false;

    GameEventHandler.emit(GameEvent.ROUND_STARTED);
  }

  endRound(isWin) {
    for (let i = 0; i < GameData.enemies.length; i++) {
      GameData.enemies[i].destroy({children:true});
    }

    GameData.enemies = [];
    GameData.gameTime = 0;
    GameData.tickTime = 0;

    GameData.player.disable();
    GameData.player.visible = false;
    GameData.isRoundActive = false;

    this.gameView.clearRound();

    GameEventHandler.emit(GameEvent.ROUND_ENDED);
  }

  endGame() {
    let highScoreOrStageUpdate = false;

    if (GameData.stage.greaterThan(GameData.highStage)) {
      GameData.highStage.set(GameData.stage);
      this.setHighStage(GameData.highStage.toString());
      highScoreOrStageUpdate = true;
    }
    if (GameData.score > GameData.highScore) {
      GameData.highScore = GameData.score;
      this.setHighScore(GameData.highScore.toFixed(0));
      highScoreOrStageUpdate = true;
    }

    if (highScoreOrStageUpdate) {
      GameData.writeHighScoresToStorage();
    }

    this.livesRemainingText.visible = false;
    this.extraLifeScoreText.visible = false;
    this.startButton.visible = true;
    this.endButton.visible = false;

    if (GameData.isRoundActive) {
      this.endRound(false);
    }

    this.gameView.endGame();
    this.onGameEnded();
  }

  // Called each frame with delta time in milliseconds
  onUpdate(deltaTime) {
    this.gameView.onUpdate(deltaTime);

    if (GameData.isGameOn === false) { return; }

    if (GameData.isRoundActive === false) {
      if (this.startRoundTimer > 0) {
        this.startRoundTimer -= deltaTime;

        if (Math.floor(this.startRoundTimer / 1000) < this.startRoundCount) {

          if (this.startRoundCount > 0) { this.showCountdown(); }
          this.startRoundCount--;
        }
      } else if (GameData.player.isAlive) {
          this.startRound();
      }

      return;
    }

    if (!GameData.player.isAlive && GameData.livesRemaining > 0) {
      this.gameView.reSpawnPlayer();
    }

    if (this.checkGameEnded()) {
      this.endRound(false);
      this.showRoundResult(false);
    } else if (this.checkRoundVictory()) {
      this.endRound(true);
      this.showRoundResult(true);
      this.advanceToNextRound();
      this.startNextRoundCountdown();
    }
  }

  onClickStart() {
    this.startGame();
  }

  onClickEnd() {
    this.endGame();
  }

  onPlayerDied(instigator) {
    console.log("Player was killed by " + instigator.entityName + " at " + instigator.coordinate.toString());
    GameData.livesRemaining -= 1;
    this.setLives(GameData.livesRemaining);
  }

  onEnemySpawned(spawnedEnemy) {
      this.gameView.addChild(spawnedEnemy);
      GameData.enemies.push(spawnedEnemy);
  }

  onEnemyDied(deadEnemy, instigator) {
    GameData.kills += 1;
    GameData.score += deadEnemy.killScore;

    this.setScore(GameData.score);
    if (GameData.score >= GameData.extraLifeScore) { this.giveExtraLife(); }
  }

  onGameEnded() {
    this.gameResult.visible = false;

    GameData.isGameOn = false;
    GameData.player.disable();

    if (!GameData.isGameFinished) { return; }
  }

  checkGameEnded() {
    return GameData.player.isAlive === false && GameData.livesRemaining < 1;
  }

  checkRoundVictory() {
    if (GameData.player.isAlive === false || GameData.getEnemyCount(true) > 0) {
       return false;
    }

    return true;
  }

  giveExtraLife() {
    GameData.extraLivesGiven += 1;
    GameData.livesRemaining += 1;
    GameData.extraLifeScore = GameConfiguration.player.getExtraLifeScore(GameData.extraLivesGiven);

    this.setLives(GameData.livesRemaining);
    this.setExtraLifeScore(GameData.extraLifeScore);
  }

  startNextRoundCountdown() {
    this.startRoundTimer = 4000;
    this.startRoundCount = 3;
  }

  showCountdown() {
    this.countdown.visible = true;
    this.countdown.text = this.startRoundCount;
    gsap.fromTo(this.countdown, 0.45, { alpha:0 }, { alpha:1, yoyo:true, repeat:1 });
    gsap.fromTo(this.countdown, 0.9, { pixi:{scale:0.5} }, { pixi:{scale:1} });
  }

  showRoundResult(isWin) {
      if (isWin) {
        this.showResultPopup(true, "VICTORY", "YOU SURVIVED. NOW PREPARE FOR MORE!");
      } else {
        this.showResultPopup(false, "YOU ARE DEAD", "YOU GOT EATEN ONE TOO MANY TIMES");
      }
  }

  showResultPopup(isWin, title, description) {
    this.gameResultTitle.text = title;
    this.gameResultTitle.x = -Math.floor(this.gameResultTitle.width / 2);
    this.gameResultDescription.text = description;
    this.gameResultDescription.x = -Math.floor(this.gameResultDescription.width / 2);

    this.gameResultTitle.tint = isWin ? 0x00FF00 : 0xFF0000;
    this.gameResultDescription.tint = isWin ? 0x00FF00 : 0xFF0000;

    this.gameResult.visible = true;
  }

  resizeView(canvasWidth, canvasHeight) {
    // Scale game view to fit desired view dimensions based on map
    const ratio = Math.max(0.5, Math.min(
      (canvasWidth - 8) / GameData.map.dimensions.width,
      (canvasHeight - 8) / (GameData.map.dimensions.height + 80)));
    this.gameView.scale.set(ratio);

    // Scale frame to fit around map view
    const actualWidth = Math.ceil(GameData.map.dimensions.width * ratio);
    const actualHeight = Math.ceil(GameData.map.dimensions.height * ratio);
    this.frameOuter.scale.set(
      Math.ceil((actualWidth + 8) / 2), Math.ceil((actualHeight + 8) / 2));
    this.frameInner.scale.set(
      Math.ceil((actualWidth + 4) / 2), Math.ceil((actualHeight + 4) / 2));

    // Reposition view to center it horizontally on the window
    const scaledWidth = Math.floor(canvasWidth / ratio);
    const scaledHeight = Math.floor(canvasHeight / ratio);
    this.x = Math.floor((scaledWidth - (GameData.map.dimensions.width + 8)) / 2);

    this.startButton.position.set(
      Math.floor((actualWidth - this.startButton.width) / 2),
      Math.floor((actualHeight - this.startButton.height) / 2));
    this.endButton.position.set(
      actualWidth - this.endButton.width - 12 - 4, actualHeight + 20 + 4);

    this.stageText.position.set(20, actualHeight + 20 + 4);
    this.livesRemainingText.position.set(300, this.stageText.y);
    this.highStageText.position.set(600, this.stageText.y);

    this.scoreText.position.set(20, actualHeight + 40 + 20 + 4);
    this.extraLifeScoreText.position.set(300, this.scoreText.y);
    this.highScoreText.position.set(600, this.scoreText.y);

    this.gameResult.position.set(
      Math.floor(actualWidth / 2),
      Math.floor(actualHeight / 2) + 4);

    this.countdown.position.set(Math.floor(canvasWidth / 2), actualHeight - 200);
  }
}

export { MainView };
