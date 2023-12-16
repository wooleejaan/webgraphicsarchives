import { randomNumBetween } from "./utils.js";

export default class Particle {
  constructor() {
    this.r = innerHeight / 4; // 위치시키고 싶은 r 값을 임의로 설정합니다.
    this.angle = randomNumBetween(0, 360);
    // Math.cos, sin 안에는 라디안 값이 들어가야 합니다.
    this.x = innerWidth / 2 + this.r * Math.cos((Math.PI / 180) * this.angle);
    this.y = innerHeight / 2 + this.r * Math.sin((Math.PI / 180) * this.angle);
  }
  update() {}
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
  }
}
