import { Entity } from "./entity.js";

class Player extends Entity {
  enable() {
    console.log("Player enabled");
    super.enable();
  }

  disable() {
    console.log("Player disabled");
    super.disable();
  }
}

export { Player };
