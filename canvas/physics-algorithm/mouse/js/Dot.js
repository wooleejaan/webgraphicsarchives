import Vector from "./Vector.js";

export default class Dot {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.oldPos = new Vector(x, y);

    this.gravity = new Vector(0, 1);
    this.friction = 0.97;

    this.pinned = false;
    this.mass = 1;
  }
  update(mouse) {
    // mouse 인자를 받아와서
    if (this.pinned) return;
    let vel = Vector.sub(this.pos, this.oldPos);

    this.oldPos.setXY(this.pos.x, this.pos.y);

    vel.mult(this.friction);
    vel.add(this.gravity);
    this.pos.add(vel);

    // 마우스가 공 근처로 이동했을 때, 공을 끌려오는 모션 구현
    // 마우스와 점의 차이를 좌표로 만드는 Vector 인스턴스에서 x,y값만 추출(dx,dy로 명명)
    let { x: dx, y: dy } = Vector.sub(mouse.pos, this.pos);
    // 마우스와 공 사이의 거리
    const dist = Math.sqrt(dx * dx, dy * dy);

    // 거리가 마우스 반경을 넘어서면 return해서 음수값을 갖지 않도록함.
    if (dist > mouse.radius) {
      return;
    }

    // 방향 벡터를 direction이라는 이름으로 생성
    const direction = new Vector(dx / dist, dy / dist);

    // 힘
    const force = (mouse.radius - dist) / mouse.radius;
    // console.log(force); // force가 0~1 사이 값인지 확인 (마우스를 점에 가까이 하면 0-1 사이 값이 찍힘)

    if (force > 0.8) {
      // 떨리는 현상을 방지하기 위해, 힘이 0.8보다 커지면(마우스에 굉장히 가까워지면 그냥 마우스 위치로 설정)
      this.pos.setXY(mouse.pos.x, mouse.pos.y);
    } else {
      // 포지션 + (방향벡터 * 힘)
      // 만약 힘이 약하다면 mult를 계속 체이닝으로 엮어서 곱해주면 됨.
      // this.pos.add(direction.mult(force).mult(5));
      this.pos.add(direction.mult(force));
    }
  }
  draw(ctx) {
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
