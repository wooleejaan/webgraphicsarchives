import App from "./App.js";
import BoundingBox from "./BoundingBox.js";

export default class Coin {
  constructor(x, y, vx) {
    this.img = document.querySelector("#coin-img");

    this.width = 50;
    this.height = 50;
    this.x = x - this.width / 2; // 코인을 가운데 위치시키기 위해서
    this.y = y - this.height / 2; // 코인을 가운데 위치시키기 위해서

    this.counter = 0; // for 애니메이션 속도 조절
    this.frameX = 0;

    this.vx = vx;

    this.boundingBox = new BoundingBox(this.x, this.y, this.width, this.height);
  }
  update() {
    // frameX를 계속 증가시켜서 이미지가 애니메이션처럼 보이도록.
    // counter를 계속 증가시키고, 그 값이 2의 배수가 될 때만 frameX 증가ㄴ
    if (++this.counter % 5 === 0) {
      this.frameX = ++this.frameX % 10;
    }
    // 코인이 벽과 같은 위치에 생성되므로, 코인도 벽처럼 계속 x를 이동시켜줘야 한다.
    this.x += this.vx;

    // boundingBox도 코인과 위치 싱크를 맞춰줘야 한다.
    this.boundingBox.x = this.x;
  }
  draw() {
    App.ctx.drawImage(
      this.img,
      (this.img.width / 10) * this.frameX, // sx
      0, // sy
      this.img.width / 10, // sw (스프라이트 이미지 안에 코인이 10개이므로)
      this.img.height, // sh
      this.x,
      this.y,
      this.width,
      this.height
    );
    // 코인이 그려진 다음에
    this.boundingBox.draw();
  }
}
