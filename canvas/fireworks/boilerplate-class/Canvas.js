import CanvasOption from "./CanvasOption.js";

export default class Canvas extends CanvasOption {
  constructor() {
    super();
  }
  init() {
    this.canvasWidth = innerWidth;
    this.canvasHeight = innerHeight;
    this.canvas.width = this.canvasWidth * this.dpr;
    this.canvas.height = this.canvasHeight * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.canvas.style.width = this.canvasWidth + "px";
    this.canvas.style.height = this.canvasHeight + "px";
  }

  render() {
    let now, delta;
    let then = Date.now();

    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - then;
      if (delta < this.interval) return;

      // 여기에 코드를 작성합니다.
      this.ctx.fillRect(100, 100, 200, 200);

      then = now - (delta % this.interval);
    };
    requestAnimationFrame(frame); // 여기서 1번만 실행해주면 이후에는 frame 함수 안에 있는 Raf가 계속 실행됩니다
  }
}
