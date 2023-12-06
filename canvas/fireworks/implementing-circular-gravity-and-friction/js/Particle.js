import CanvasOption from "./CanvasOption.js";

export default class Particle extends CanvasOption {
  constructor(x, y, vx, vy, opacity) {
    super();
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    // opacity도 랜덤한 값으로 받아야 투명도가 전부 다르게 구현할 수 있습니다.
    this.opacity = opacity;
    // 중력과 마찰을 구현합니다.
    this.gravity = 0.12;
    this.friction = 0.93;
  }

  update() {
    // 매 프레임마다 vy에 더해서, 중력을 구현합니다.
    this.vy += this.gravity;

    // 매 프레임마다 속도값에 friction을 곱해줘서
    // 점점 느려지게 만들어 0으로 수렴하도록 만듭니다.
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;

    // 단순히 this.opacity -= 0.01로 하면 모든 particle이 같은 투명도를 가지므로 자연스럽지 않습니다.
    // 각각 다른 시간에 사라지게 하려면,
    // opacity 값도 랜덤한 값으로 넘겨주면 됩니다.
    this.opacity -= 0.02;
  }

  draw() {
    this.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    this.ctx.beginPath();
    // 원이 너무 크므로 반지름을 10에서 2로 줄입니다.
    this.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }
}
