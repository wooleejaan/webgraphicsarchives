export default class Stick {
  constructor(p1, p2) {
    // 점 2개를 인자로 받아야 함.
    this.startPoint = p1;
    this.endPoint = p2;

    this.length = this.startPoint.pos.dist(this.endPoint.pos); // 두 점 사이의 Original 길이 (L)

    // 텐션을 offset 값에 곱해주는 건데,
    // 텐션은 오프셋, 즉 오차값을 되돌려주는 역할을 함. 1이면 그대로 되돌려주는 것임.
    // 예를 들어 tension이 0.05면 원래 되돌려줘야할 값을 1/20 만큼만 매 프레임마다 되돌려주므로
    // 텐션이 느슨하게 되는 것임.
    this.tension = 0.05; // 1보다 작으면 마치 스프링 효과를 냄.
  }

  update() {
    // 단순히 점 하나를 고정시키면, 다른 한 점이 무한히 늘어난다.
    // 그러므로 이를 막기 위해, 점들 사이의 거리를 일정하게 유지를 해보면?

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
      //   this.startPoint.pos.x += offsetX * 0.5;
      //   this.startPoint.pos.y += offsetY * 0.5;
      this.startPoint.pos.x += offsetX * m1;
      this.startPoint.pos.y += offsetY * m1;
    }
    if (!this.endPoint.pinned) {
      //   this.endPoint.pos.x -= offsetX * 0.5;
      //   this.endPoint.pos.y -= offsetY * 0.5;
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
