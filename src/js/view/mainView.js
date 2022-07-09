import GameConfiguration from "../gameConfiguration.js";
import GameData from "../gameData.js";
import GameEventHandler from "../gameEventHandler.js";
import { GameEvent } from "../gameEvent.js";
import { GameView } from "./gameView.js";
import { EntityType, EntityIds } from "../entities/entityType.js";

class MainView extends PIXI.Container {
  constructor(resources) {
    super();

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

    this.quitButton = new PIXI.Text("QUIT", GameConfiguration.styles.button.decline);
    this.quitButton.interactive = true;
    this.quitButton.buttonMode = true;
    this.quitButton.on("click", this.onClickQuit.bind(this));
    this.quitButton.visible = false;

    this.gameScore = new PIXI.Text("SCORE: 0", GameConfiguration.styles.text.generic);

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

    this.addChild(this.frame, this.gameView, this.gameScore, this.startButton,
      this.quitButton, this.gameResult);

    GameEventHandler.on(GameEvent.PLAYER_DIED, this.onPlayerDied.bind(this));
    GameEventHandler.on(GameEvent.ENEMY_SPAWNED, this.onEnemySpawned.bind(this));
    GameEventHandler.on(GameEvent.ENEMY_DIED, this.onEnemyDied.bind(this));
    GameEventHandler.on(GameEvent.GAME_ENDED, this.onGameEnded.bind(this));
  }

  // Called each frame with delta time in milliseconds
  onUpdate(deltaTime) {
    this.gameView.onUpdate(deltaTime);

    if (GameData.isGameOn === false) { return; }

    if (this.checkGameEnded()) {
      GameData.isGameFinished = true;
      GameEventHandler.emit(GameEvent.GAME_ENDED);
    }
  }

  onClickStart() {
    this.gameView.startGame();
    this.startButton.visible = false;
    this.quitButton.visible = true;
  }

  onClickQuit() {
    this.gameView.quitGame();
    this.quitButton.visible = false;
    this.startButton.visible = true;
    this.onGameEnded();
  }

  onPlayerDied(instigator) {
    console.log("Player was killed by " + instigator.name + " at " + instigator.coordinate.toString());
    GameData.isGameFinished = true;
  }

  onEnemySpawned(spawnedEnemy) {

      this.gameView.addChild(spawnedEnemy);
      GameData.enemies.push(spawnedEnemy);
  }

  onEnemyDied(deadEnemy) {
    GameData.kills += 1;
    GameData.score += deadEnemy.killScore;
    this.gameScore.text = "SCORE: " + GameData.score;
  }

  onGameEnded() {
    this.gameResult.visible = false;

    GameData.isGameOn = false;
    GameData.player.disable();

    if (!GameData.isGameFinished) { return; }

    if (GameData.player.isAlive === false) {
      this.showGameResult(false, "YOU ARE DEAD", "YOU WERE EATEN BY A MORSO");
    } else {
      this.showGameResult(true, "VICTORY", "YOU SURVIVED ALL OF THE MORSO");
    }
  }

  checkGameEnded() {
    if (GameData.player.isAlive === false) { return true; }

    for (let enemy of GameData.enemies) {
      if (enemy.isAlive === true) { return false; }
    }

    return true;
  }

  showGameResult(isWin, title, description) {
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
      actualHeight + 20 + 4);
    this.quitButton.position.set(
      actualWidth - this.quitButton.width - 12 - 4, actualHeight + 20 + 4);
    this.gameScore.position.set(20, actualHeight + 20 + 4);
    this.gameResult.position.set(
      Math.floor(actualWidth / 2),
      Math.floor(actualHeight / 2) + 4);

  }
}

export { MainView };
