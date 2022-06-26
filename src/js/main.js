import { Game } from "./game.js";

console.log("?");

const main = () => {
  console.log("Morso!");

  // The application will create a renderer using WebGL, if possible,
  // with a fallback to a canvas render. It will also setup the ticker
  // and the root stage PIXI.Container
  const app = new PIXI.Application({
    width: 1280,
    height: 720,
    backgroundColor: 0x000000
  });
  const game = new Game(app);

  // The application will create a canvas element for you that you
  // can then insert into the DOM
  document.body.appendChild(app.view);

  // load the textures we need
  app.loader.add("player", "assets/player.png")
            .add("tile_floor", "assets/tile_floor.png")
            .add("tile_wall", "assets/tile_wall.png");

  app.loader.load((loader, resources) => {
    game.start(resources);
  });
};

main();
