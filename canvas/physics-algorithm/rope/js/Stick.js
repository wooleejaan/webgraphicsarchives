export default class Stick {
  constructor(p1, p2) {
    this.startPoint = p1;
    this.endPoint = p2;

    this.length = this.startPoint.pos.dist(this.endPoint.pos);

    // 낮으면 낮을수록 텐션이 높아짐.
    // stick 업데이트를 For문으로 여러번 하다보면 그만큼 tension 비중도 낮아지게 됨.
    this.tension = 0.3;
  }

  update() {
    const dx = this.endPoint.pos.x - this.startPoint.pos.x;
    const dy = this.endPoint.pos.y - this.startPoint.pos.y;

    const dist = Math.sqrt(dx * dx + dy * dy);

    // ay => (ay / (dist - L)) = (dy / dist)
    // ax => (ax / (dist - L)) = (dy / dist)
    const diff = (dist - this.length) / dist;
    const offsetX = diff * dx * this.tension;
    const offsetY = diff * dy * this.tension;

    // 무게를 반영
    const m = this.startPoint.mass + this.endPoint.mass;
    const m1 = this.endPoint.mass / m;
    const m2 = this.startPoint.mass / m;

    // 절반을 곱해준 값을 더하거나 빼준다.
    if (!this.startPoint.pinned) {
      this.startPoint.pos.x += offsetX * m1;
      this.startPoint.pos.y += offsetY * m1;
    }
    if (!this.endPoint.pinned) {
      this.endPoint.pos.x -= offsetX * m2;
      this.endPoint.pos.y -= offsetY * m2;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 10;
    ctx.moveTo(this.startPoint.pos.x, this.startPoint.pos.y);
    ctx.lineTo(this.endPoint.pos.x, this.endPoint.pos.y);
    ctx.stroke();
    ctx.closePath();
  }
}
