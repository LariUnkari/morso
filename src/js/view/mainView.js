import { GameView } from "./gameView.js";

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

    this.addChild(this.frame, this.gameView);
  }

  resizeView(canvasWidth, canvasHeight) {
    // Scale game view to fit desired view dimensions based on map
    const ratio = Math.min(
      (canvasWidth - 8) / this.gameView.map.dimensions.width,
      (canvasHeight - 8) / (this.gameView.map.dimensions.height + 80));
    this.gameView.scale.set(ratio);

    // Scale frame to fit around map view
    const actualWidth = Math.ceil(this.gameView.map.dimensions.width * ratio);
    const actualHeight = Math.ceil(this.gameView.map.dimensions.height * ratio);
    this.frameOuter.scale.set(
      Math.ceil((actualWidth + 8) / 2), Math.ceil((actualHeight + 8) / 2));
    this.frameInner.scale.set(
      Math.ceil((actualWidth + 4) / 2), Math.ceil((actualHeight + 4) / 2));

    // Reposition view to center it horizontally on the window
    const scaledWidth = Math.floor(canvasWidth / ratio);
    const scaledHeight = Math.floor(canvasHeight / ratio);
    this.x = Math.floor((scaledWidth -
      (this.gameView.map.dimensions.width + 8)) / 2);

    //console.log("Map dimensions: " + this.gameView.map.dimensions.width + "x" +
    //  this.gameView.map.dimensions.height + ", ratio to fit: " + ratio +
    //  ", resulting gameView dimensions: " + scaledWidth + "x" + scaledHeight +
    //  ", view x offset: " + this.x);
  }
}

export { MainView };
