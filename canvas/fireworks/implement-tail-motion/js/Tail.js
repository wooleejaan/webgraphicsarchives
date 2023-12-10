import CanvasOption from "./CanvasOption.js";
import { randomNumBetween } from "./utils.js";

export default class Tail extends CanvasOption {
  constructor(x, vy, color) {
    // 일반적으로 particle의 y,x,vx,vy를 parameter로 받지만,
    // y값은 아래 고정으로 되고, 꼬리가 하늘로 올라갈 때 vy에 영향을 받으므로
    // vx는 따로 필요가 없어집니다. 그러므로 x와 vy 값만 파라미터로 받으면 됩니다.
    // 추가로 color 값까지 받습니다.
    super();
    this.x = x;
    this.y = this.canvasHeight; // 바닥에서 시작하므로
    this.vy = vy;
    this.color = color;
    // x값을 -1~1사이 계속 왔다갔다 하면서 피어오르도록 하기 위해, 각도를 초기화해줍니다.
    // 모두 같은 각도로 시작해서 꼬불거리지 않도록 랜덤값으로 angle을 초기화합니다
    this.angle = randomNumBetween(0, 2);
    // 속도에 마찰이 없으면, 꼬리가 화면 위로 사라져버립니다.
    this.friction = 0.985; // fiction 값을 0.95에서 0.985로 올려줍니다.
  }
  // update 함수와 draw 함수는 필수입니다.
  update() {
    // 마찰을 추가했을 때, 너무 중간지점에서 빨리 멈춰버리면 해결 방법은 2가지입니다.
    // 좀 더 위에 편착시키려면,
    // 1) friction을 약하게 하거나, 2) vy값을 보다 더 강하게 주거나

    // 이렇게 마찰을 추가하면, 꼬리가 올라오다가 특정 지점에서 멈추게 됩니다.
    this.vy *= this.friction;
    // y에 vy를 더해줍니다.
    this.y += this.vy;

    // 꼬불꼬불 좌우로 흔들면서 꼬리가 피어오르려면,
    // x값이 -1과 1 사이를 왔다갔다 하는 값을 계속 더해주면 됩니다.
    // -1 ~ 1 값을 얻기 위해 sin 또는 cos를 사용하면 됩니다.
    this.angle += 1;
    // vy가 0으로 수렴해질 때, 같이 꼬불꼬불한 점도 0으로 수렴되기 위해
    // 20 정도가 아니라 this.vy를 곱해줍니다.
    // 너무 꼬불꼬불 거리므로 0.2를 추가적으로 곱해줍니다.
    this.x += Math.cos(this.angle) * this.vy * 0.2; // 값이 작으므로 20 정도를 곱해줍니다.
    // opacity 값을 조절합니다.
    // 꼬리가 점점 멈추는 시점에는 opacity가 0으로 수렴하도록 합니다.
    // vy가 음수값으로 시작해서 0으로 수렴할텐데,
    // index.js에서 if(tail.vy > -1)로 하면 opacity가 적용되기도 전에 터져버리므로 0.7 정도로 잡아줘야 합니다.
    this.opacity = -this.vy * 0.1;
  }
  draw() {
    // Tail의 색상도 Particle처럼 Rgba 형식으로 맞춰줍니다.
    this.ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    // 꼬리에서 작은 원을 쏘아올려야 합니다.
    // 그러므로 원을 그려줍니다.
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2); // 1px 원을 그리기 위해 0~360도
    this.ctx.fill();
    this.ctx.closePath();
  }
}
