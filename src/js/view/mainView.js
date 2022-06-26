import GameData from "../gameData.js";
import { GameView } from "./gameView.js";

const STYLE_BUTTON_START = { fontFamily:"Arial", fontSize:32, fill:0xFFFFFF };
const STYLE_BUTTON_QUIT = { fontFamily:"Arial", fontSize:32, fill:0xFF0000 };

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

    this.startButton = new PIXI.Text("START", STYLE_BUTTON_START);
    this.startButton.interactive = true;
    this.startButton.buttonMode = true;
    this.startButton.on("click", this.onClickStart.bind(this));

    this.quitButton = new PIXI.Text("QUIT", STYLE_BUTTON_QUIT);
    this.quitButton.interactive = true;
    this.quitButton.buttonMode = true;
    this.quitButton.on("click", this.onClickQuit.bind(this));
    this.quitButton.visible = false;

    this.addChild(this.frame, this.gameView, this.startButton, this.quitButton);
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
      actualWidth - this.quitButton.width,
      actualHeight + 20 + 4);

  }

  // Called each frame with delta time in milliseconds
  onUpdate(deltaTime) {
    this.gameView.onUpdate(deltaTime);
  }
}

export { MainView };
