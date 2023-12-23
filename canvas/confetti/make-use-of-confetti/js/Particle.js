import { hexToRgb, randomNumBetween } from "./utils.js";

export default class Particle {
  constructor(x, y, deg = 0, colors, shapes, spread = 30) {
    // 커지는 각도를 30이 아니라 변수 spread로 받아서 유연하게 만들어줍니다.
    this.angle = (Math.PI / 180) * randomNumBetween(deg - spread, deg + spread);
    this.r = randomNumBetween(30, 100);
    this.x = x * innerWidth;
    this.y = y * innerHeight;

    this.vx = this.r * Math.cos(this.angle);
    this.vy = this.r * Math.sin(this.angle);

    this.friction = 0.89;
    this.gravity = 0.5;

    this.width = 12;
    this.height = 12;

    this.opacity = 1;

    this.widthDelta = randomNumBetween(0, 360);
    this.heightDelta = randomNumBetween(0, 360);

    this.rotation = randomNumBetween(0, 360);

    this.rotationDelta = randomNumBetween(-1, 1);

    this.colors = colors || ["#FF577F", "#FF884B", "#FFD384", "FFF9B0"];
    this.color = hexToRgb(
      this.colors[Math.floor(randomNumBetween(0, this.colors.length))] // floor로 하면 length -1 이 아니라 length 여야 합니다.
    );

    this.shapes = shapes || ["circle", "square"]; // shapes를 받아와 저장합니다.
    this.shape =
      this.shapes[Math.floor(randomNumBetween(0, this.shapes.length))]; // floor로 하면 length -1 이 아니라 length 여야 합니다.
  }
  update() {
    this.vy += this.gravity;

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;

    this.opacity -= 0.005;

    this.widthDelta += 2;
    this.heightDelta += 2;

    this.rotation += this.rotationDelta;
  }
  drawSquare(ctx) {
    // fillRect를 여기 안으로 옮깁니다.
    ctx.fillRect(
      this.x,
      this.y,
      this.width * Math.cos((Math.PI / 180) * this.widthDelta),
      this.height * Math.sin((Math.PI / 180) * this.heightDelta)
    );
  }
  drawCircle(ctx) {
    // 원형을 그려줍니다.
    ctx.beginPath();
    // arc가 반지름 하나로 원을 그린다면,
    // ellipse는 반대로 반지름 2개를 가지고 타원을 그립니다.
    ctx.ellipse(
      this.x,
      this.y,
      Math.abs(this.width * Math.cos((Math.PI / 180) * this.widthDelta)) / 2, // radius x (음수가 나오면 안 됩니다. cos,sin은 -1까지도 가므로 abs를 적용해줍니다.)
      Math.abs(this.height * Math.sin((Math.PI / 180) * this.heightDelta)) / 2, // radius y (square와 달리 반지름 값으로 이 랜덤값을 사용하므로 /2를 해줘야 사이즈가 맞습니다.)
      0, // 타원을 시계방향으로 회전시키는 각도. (이미 radius x,y에서 cos,sin으로 회전을 주고 있으므로 0을 줍니다.)
      0, // 시작하는 각도
      Math.PI * 2 // 끝나는 각도
    );
    ctx.fill(); // fillStyle은 공통부분에서 그릴 것이므로 fill만 해줍니다.
    ctx.closePath();
  }
  draw(ctx) {
    ctx.save();

    ctx.translate(this.x + this.width * 1.2, this.y + this.height * 1.2);

    ctx.rotate((Math.PI / 180) * this.rotation);
    ctx.translate(-this.x - this.width * 1.2, -this.y - this.height * 1.2);

    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;

    // 위에서 translate,rotate,fillStyle은 공통스타일이므로 여기에 작성합니다.
    switch (this.shape) {
      case "square":
        this.drawSquare(ctx);
        break;
      case "circle":
        this.drawCircle(ctx);
        break;
    }

    // ctx.fillRect(
    //   this.x,
    //   this.y,
    //   this.width * Math.cos((Math.PI / 180) * this.widthDelta),
    //   this.height * Math.sin((Math.PI / 180) * this.heightDelta)
    // );
    ctx.resetTransform();
    ctx.restore();
  }
}
