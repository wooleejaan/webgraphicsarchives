import Vector from "./Vector.js";

export default class Mouse {
  constructor(canvas) {
    // (0,0)으로 해버리면 시작하자마자 마우스와 상호작용해버리므로 이를 방지하기 위해
    this.pos = new Vector(-1000, -1000);
    this.radius = 100; // 마우스를 중심으로 radius 반경까지 왔을 때 끌려가는 모션을 구현할 예정

    canvas.onmousemove = (e) => this.pos.setXY(e.clientX, e.clientY);
    canvas.ontouchmove = (e) =>
      this.pos.setXY(e.touches[0].clientX, e.touches[0].clientY);
  }
}
