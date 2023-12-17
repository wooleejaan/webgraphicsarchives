import { randomNumBetween } from "./utils.js";

export default class Particle {
  constructor(x, y, deg = 0) {
    // 불꽃놀이는 0~360 랜덤 각도지만,
    // confetti는 특정 각도로 쏘아줘야 합니다.
    // this.angle = (Math.PI / 180) * randomNumBetween(0, 360); // 각도가 0~360도
    this.angle = (Math.PI / 180) * randomNumBetween(deg - 30, deg + 30); // confetti는 특정 각도로 쏘아줘야 합니다. (부채꼴 모양으로 파티클을 쏩니다)
    // angle이 나가는 방향이라면, 나가는 힘은 radius에 의해 결정됩니다.
    this.r = randomNumBetween(30, 100); // 반지름(radius)
    this.x = x;
    this.y = y;

    // vx,vy를 통해 파티클들이 원모양으로 퍼져나갑니다.
    this.vx = this.r * Math.cos(this.angle);
    this.vy = this.r * Math.sin(this.angle);

    // friction이 너무 크면 너무 멀리나가므로 적당히 낮은 값을 설정합니다.
    this.friction = 0.89;
    // 중력값이 너무 낮으면 느리므로 적당히 높은 값을 설정합니다.
    this.gravity = 0.5;

    this.width = 30;
    this.height = 30;
  }
  update() {
    this.vy += this.gravity; // 매 프레임마다 중력을 더해주고

    // 마찰 적용
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
  }
  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
