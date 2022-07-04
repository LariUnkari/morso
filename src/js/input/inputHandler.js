class InputHandler {
  constructor() {
    this.keyMap = {};
  }

  setupInputKey(name, keyCode, callback) {

    const key = {};
    key.name = name;
    key.keyCode = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.callback = callback;
    this.keyMap[String.fromCharCode(keyCode)] = key;

    //The `downHandler`
    key.downHandler = (event) => {
      if (event.keyCode === key.keyCode) {
        if (key.isUp && key.callback !== undefined) {
          key.callback(true);
        }
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };

    //The `upHandler`
    key.upHandler = (event) => {
      if (event.keyCode === key.keyCode) {
        if (key.isDown && key.callback !== undefined) {
          key.callback(false);
        }
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener("keydown", downListener, false);
    window.addEventListener("keyup", upListener, false);

    // Detach event listeners
    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };

    return key;
  }
}

export default (new InputHandler());
