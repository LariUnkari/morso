import GameData from "./gameData.js";
import { MainView } from "./view/mainView.js";

class Game {
  constructor(app) {
    this.application = app;
    console.log("Application canvas dimension: " +
      app.renderer.width + "x" + app.renderer.height);

    window.onresize = this.onWindowResize.bind(this);

    this.onWindowResize();
  }

  init(resources) {
    GameData.resources = resources;

    this.mainView = new MainView(resources);
    this.application.stage.addChild(this.mainView);
    this.application.ticker.add(this.onUpdate.bind(this));

    this.onWindowResize();
  }

  onUpdate() {
    //console.log("Update deltaTime: " + this.application.ticker.deltaMS.toFixed(3) + "ms");
    this.mainView.onUpdate(this.application.ticker.deltaMS);
  }

  onWindowResize() {
    const canvasWidth = window.innerWidth - 20;
    const canvasHeight = window.innerHeight - 20;

    // Resize canvas to match given dimensions
    this.application.renderer.view.style.width = canvasWidth;
    this.application.renderer.view.style.height = canvasHeight;
    this.application.renderer.resize(canvasWidth, canvasHeight);

    if (this.mainView !== undefined) {
      this.mainView.resizeView(canvasWidth, canvasHeight);
    }
  }
}

export { Game };
