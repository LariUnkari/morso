import { MainView } from "./view/mainView.js";

class Game {
  constructor(app) {
    this.application = app;
    console.log("Application canvas dimension: " +
      app.renderer.width + "x" + app.renderer.height);

    window.onresize = this.onWindowResize.bind(this);

    this.onWindowResize();
  }

  start(resources) {
    console.log("GOOOO");
    this.resources = resources;

    this.mainView = new MainView(resources);
    this.application.stage.addChild(this.mainView);

    this.onWindowResize();
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
