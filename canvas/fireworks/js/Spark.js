import CanvasOption from "./CanvasOption.js";

export default class Spark extends CanvasOption {
  constructor(x, y, vx, vy, opacity, colorDeg) {
    super();
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    // 잔상이 남고 투명도를 줘야 계속 남지 않고 자연스러운 잔상 효과를 구현할 수 있습니다.
    // 그리고 이후 opacity가 0이 되면 배열에서도 지워줘서 성능 문제도 고려해줘야 합니다.
    this.opacity = opacity;
    this.colorDeg = colorDeg;
  }
  update() {
    this.opacity -= 0.01;
    // vy,vx를 x,y에 따로 추가해주지 않는다는 건,
    // vy,vx가 0으로, 그 자리에서만 생기고, opacity가 0보다 작을 때 사라지는 단조로운 형태가 된다.
    // 꼬리는 그 자리에서 생기는 게 아니므로, vx,vy를 통해 역동성을 부여합니다.
    this.x += this.vx;
    this.y += this.vy;
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2); // 반지름이 1인 원을 그려줍니다.
    // spark는 gold 색상에 가까운 45를 h로 줍니다.
    // tail의 colorDeg을 받는 걸로 변경합니다.
    this.ctx.fillStyle = `hsla(${this.colorDeg}, 100%, 65%, ${this.opacity})`;
    this.ctx.fill();
    this.ctx.closePath();
  }
}
