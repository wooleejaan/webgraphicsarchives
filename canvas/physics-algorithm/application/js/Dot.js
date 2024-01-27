import Vector from "./Vector.js";

export default class Dot {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.oldPos = new Vector(x, y);

    this.gravity = new Vector(0, 1);
    this.friction = 0.97;

    this.pinned = false;
    this.mass = 1;

    this.lightImg = document.querySelector("#light-img");
    this.lightSize = 15;
  }
  update(mouse) {
    // mouse 인자를 받아와서
    if (this.pinned) return;
    let vel = Vector.sub(this.pos, this.oldPos);

    this.oldPos.setXY(this.pos.x, this.pos.y);

    vel.mult(this.friction);
    vel.add(this.gravity);

    let { x: dx, y: dy } = Vector.sub(mouse.pos, this.pos);
    // 마우스와 공 사이의 거리
    const dist = Math.sqrt(dx * dx, dy * dy);

    // 방향 벡터를 direction이라는 이름으로 생성
    const direction = new Vector(dx / dist, dy / dist);

    // 힘
    const force = Math.max((mouse.radius - dist) / mouse.radius, 0);

    if (force > 0.6) {
      this.pos.setXY(mouse.pos.x, mouse.pos.y);
    } else {
      // 포지션 + (방향벡터 * 힘)
      this.pos.add(direction.mult(force));
      this.pos.add(vel);
    }
  }
  draw(ctx) {
    ctx.fillStyle = "#999";
    // ctx.beginPath();
    // ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    // 4줄로 원을 그리는 것보다 아래처럼 1줄로 사각형을 그리는 게 성능면에서도 좋음.
    ctx.fillRect(
      this.pos.x - this.mass,
      this.pos.y - this.mass,
      this.mass * 2,
      this.mass * 2
    );
  }
  // light를 그려주는 메서드 생성
  drawLight(ctx) {
    ctx.drawImage(
      this.lightImg,
      this.pos.x - this.lightSize / 2,
      this.pos.y - this.lightSize / 2,
      this.lightSize,
      this.lightSize
    );
  }
}
