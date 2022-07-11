import { Game } from "./game.js";

const main = () => {
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
  app.loader.add("placeholder", "assets/sprites/placeholder.png")
            .add("blob", "assets/sprites/blob2by1.png")
            .add("entity_player", "assets/sprites/entity_player.png")
            .add("entity_monster_big", "assets/sprites/entity_monster_big.png")
            .add("entity_monster_small", "assets/sprites/entity_monster_small.png")
            .add("entity_monster_egg", "assets/sprites/entity_monster_egg.png")
            .add("tile_floor", "assets/sprites/tile_floor.png")
            .add("tile_wall", "assets/sprites/tile_wall.png");

  app.loader.load((loader, resources) => {
    game.init(resources);
  });
};

main();
