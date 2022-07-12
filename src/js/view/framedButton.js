class FramedButton extends PIXI.Container {
  constructor(content, contentWidth, contentHeight, color, onClick) {
    super();

    this.content = content;
    this.color = color;

    const borderThickness = 2;
    const padding = 8;
    const frameWidth = contentWidth + 2 * (padding + borderThickness);
    const frameHeight = contentHeight + 2 * (padding + borderThickness);

    this.background = new PIXI.Graphics();
    this.background.beginFill(0x000000, 0.001);
    this.background.drawRect(0, 0, frameWidth, frameHeight);
    this.background.endFill();

    this.frame = new PIXI.Container();
    this.frameEdges = [
      this.createFrameEdge(0, 0, borderThickness, frameHeight),
      this.createFrameEdge(0, 0, frameWidth, borderThickness),
      this.createFrameEdge(frameWidth - borderThickness, 0, borderThickness, frameHeight),
      this.createFrameEdge(0, frameHeight - borderThickness, frameWidth, borderThickness)
    ];

    this.addChild(this.background, this.frame, this.content);

    this.content.position.set(
      Math.floor(this.frame.width / 2),
      Math.floor(this.frame.height / 2)
    );

    this.buttonMode = true;
    this.interactive = true;
    this.on("click", onClick);
  }

  createFrameEdge(x, y, width, height) {
    const frame = new PIXI.Graphics();
    frame.beginFill(this.color);
    frame.drawRect(0, 0, width, height);
    frame.endFill();

    this.frame.addChild(frame);
    frame.position.set(x, y);
  }

  getWidth() {
    return this.frame.width;
  }

  getHeight() {
    return this.frame.height;
  }
}

export { FramedButton };
