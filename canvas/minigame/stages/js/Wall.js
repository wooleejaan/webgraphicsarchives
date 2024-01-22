import App from "./App.js";
import BoundingBox from "./BoundingBox.js";
import { randomNumBetween } from "./utils.js";

export default class Wall {
  constructor(config) {
    this.img = document.querySelector("#wall-img");
    this.type = config.type;

    switch (this.type) {
      case "BIG":
        this.sizeX = 18 / 30;
        this.sx = this.img.width * (9 / 30);
        break;
      case "SMALL":
        this.sizeX = 9 / 30;
        this.sx = this.img.width * (0 / 30);
        break;
    }
    this.width = App.height * this.sizeX;
    this.height = App.height;
    this.gapY = randomNumBetween(App.height * 0.2, App.height * 0.35);
    this.x = App.width;
    this.y1 = -this.height + randomNumBetween(30, App.height - this.gapY - 30);
    this.y2 = this.y1 + this.height + this.gapY;

    this.vx = -6;

    this.generatedNext = false;
    this.gapNextX = App.width * randomNumBetween(0.6, 0.75);

    // Wall의 boundingBox 2개 추가
    this.boundingBox1 = new BoundingBox(
      this.x + 30, // 30만큼 밀어내는 이유는 이미지와 싱크 맞추기 위함
      this.y1 + 30,
      this.width - 60, // 60만큼 당기는 이유는 이미지와 싱크 맞추기 위함
      this.height - 60
    );
    this.boundingBox2 = new BoundingBox(
      this.x + 30, // 30만큼 밀어내는 이유는 이미지와 싱크 맞추기 위함
      this.y2 + 30,
      this.width - 60, // 60만큼 당기는 이유는 이미지와 싱크 맞추기 위함
      this.height - 60
    );
  }
  get isOutside() {
    return this.x + this.width < 0;
  }
  get canGenerateNext() {
    return !this.generatedNext && this.x + this.width < this.gapNextX;
  }
  // 2가지 벽 중에서 하나라도 닿으면 '충돌'로 판정하는 함수
  isColliding(target) {
    return (
      this.boundingBox1.isColliding(target) ||
      this.boundingBox2.isColliding(target)
    );
  }
  update() {
    this.x += this.vx;
    // 벽의 x가 변하니까 boundingBox도 반영을 해줘야 함.
    this.boundingBox1.x = this.boundingBox2.x = this.x + 30;
  }
  draw() {
    App.ctx.drawImage(
      this.img,
      this.sx,
      0,
      this.img.width * this.sizeX,
      this.img.height,
      this.x,
      this.y1,
      this.width,
      this.height
    );
    App.ctx.drawImage(
      this.img,
      this.sx,
      0,
      this.img.width * this.sizeX,
      this.img.height,
      this.x,
      this.y2,
      this.width,
      this.height
    );
    // 벽 이미지가 모두 그려진 다음에
    this.boundingBox1.draw();
    this.boundingBox2.draw();
  }
}
