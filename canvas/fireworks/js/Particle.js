import CanvasOption from "./CanvasOption.js";

export default class Particle extends CanvasOption {
  constructor(x, y, vx, vy) {
    super();
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.opacity = 1;
  }

  update() {
    // this.y += 1; // 1씩 하강합니다.
    this.x += this.vx;
    this.y += this.vy;

    // 터져나갈 때, particle들이 화면 밖으로 나가더라도
    // cpu는 계속해서 vx,vy를 적용하므로 성능에 문제가 생깁니다.
    // 그래서 opacity를 기준으로 0이되면 멈추도록 코드를 작성합니다.
    // 즉, 0이 되는 녀석들을 particles 배열에서 제거해야 합니다.
    this.opacity -= 0.01;
  }

  draw() {
    // 원형을 그립니다.
    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // particle에 opacity를 적용합니다.
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }
}
