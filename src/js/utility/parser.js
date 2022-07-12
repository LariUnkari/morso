import { Stage } from "../utility/stage.js";

class Parser {
  parseFloat(value) {
    const num = Number(value);
    return Number.isNaN(num) ? 0 : num;
  }

  parseInt(value) {
    const num = Number(value);
    return Number.isNaN(num) ? 0 : Math.round(num);
  }

  parseStage(value) {
    const divIndex = value.indexOf("-");
    if (divIndex < 1 || divIndex >= value.length) { return new Stage(0, 0); }

    return new Stage(
      this.parseInt(value.substr(0, divIndex)),
      this.parseInt(value.substr(divIndex + 1, value.length - divIndex - 1)));
  }
}

export default (new Parser());
