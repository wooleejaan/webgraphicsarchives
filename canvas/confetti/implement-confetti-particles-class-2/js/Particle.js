import { hexToRgb, randomNumBetween } from "./utils.js";

export default class Particle {
  constructor(x, y, deg = 0, colors) {
    this.angle = (Math.PI / 180) * randomNumBetween(deg - 30, deg + 30);
    this.r = randomNumBetween(30, 100);
    this.x = x * innerWidth; // 매번 innerWidth를 넘겨주는 게 아니라 클래스 안에서 자동 처리할 수 있게 합니다.
    this.y = y * innerHeight;

    this.vx = this.r * Math.cos(this.angle);
    this.vy = this.r * Math.sin(this.angle);

    this.friction = 0.89;
    this.gravity = 0.5;

    // 종이 사이즈
    this.width = 12;
    this.height = 12;

    this.opacity = 1;

    // 정적인 값이 아니라 랜덤값을 부여하면 더 자연스러워집니다.
    // 모두가 동일한 움직임이면 부자스연스럽습니다.
    this.widthDelta = randomNumBetween(0, 360);
    this.heightDelta = randomNumBetween(0, 360);

    this.rotation = randomNumBetween(0, 360);
    // 회전 방향이 시계방향~반시계방향으로 랜덤하게 되도록합니다.
    this.rotationDelta = randomNumBetween(-1, 1);

    // 색상을 랜덤하게 결정합니다.
    this.colors = colors || ["#FF577F", "#FF884B", "#FFD384", "FFF9B0"];
    this.color = hexToRgb(
      this.colors[Math.floor(randomNumBetween(0, this.colors.length - 1))]
    );
  }
  update() {
    this.vy += this.gravity;

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;

    // opacity를 사용해서
    // 계속 남지 않고 터뜨리고 자연스럽게 사라지도록 합니다.
    // 추가적으로 투명도를 통해 배열에서 삭제할지에 대한 기준도 정립합니다.
    this.opacity -= 0.005;

    this.widthDelta += 2;
    this.heightDelta += 2;

    this.rotation += this.rotationDelta;
  }
  draw(ctx) {
    ctx.save(); // 현재 상태 저장

    // 단순히 x,y가 아니라 x+with, y+height로 이동해서 움직이면 보다 동작이 명확히 보입니다.
    // 더해주는 값을 this.width, this.height보다 더 크게 주면, 더 크게 회전합니다.
    ctx.translate(this.x + this.width * 1.2, this.y + this.height * 1.2);
    // ctx.translate(this.x + this.width, this.y + this.height);
    ctx.rotate((Math.PI / 180) * this.rotation);
    ctx.translate(-this.x - this.width * 1.2, -this.y - this.height * 1.2); // 원복

    // rgb보다 hex 형태가 색상 가져오기도 편해서 자주 씁니다.
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
    ctx.fillRect(
      this.x,
      this.y,
      // Math.cos으로 widthDelta를 계속 곱해주면, 좌우로 팔랑거리고
      // Math.sin으로 heightDelta를 계속 곱해주면, 상하도 팔랑거리므로
      // 둘이 합쳐져서, 원 모양으로 빙글빙글 도는 모션이 구현됩니다.
      this.width * Math.cos((Math.PI / 180) * this.widthDelta),
      this.height * Math.sin((Math.PI / 180) * this.heightDelta)
    );
    ctx.resetTransform();
    ctx.restore(); // 이전 상태로 복원 (강의와 달리 이걸 추가해줘야 정상 동작)
  }
}
