import App from "./App.js";
import { randomNumBetween } from "./utils.js";

export default class Wall {
  constructor(config) {
    // 하나의 이미지에 small/big wall이 함께 들어 있음.
    this.img = document.querySelector("#wall-img");
    this.type = config.type; // 'BIG' | 'SMALL'

    switch (this.type) {
      case "BIG":
        this.sizeX = 18 / 30; // Big 타입 이미지의 경우 타일 18개가 Width
        this.sx = this.img.width * (9 / 30); // 30개의 타일 중 9번째 타일부터 시작
        break;
      case "SMALL":
        this.sizeX = 9 / 30; // Small 타입 이미지의 경우 타일 9개가 Width
        this.sx = this.img.width * (0 / 30); // 30개의 타일 중 0번째 타일부터 시작
        break;
    }
    this.width = App.height * this.sizeX; // 이미지에서 sizeX 비율만큼만 보여주면 되므로
    this.height = App.height;
    this.gapY = randomNumBetween(App.height * 0.2, App.height * 0.35); // App.height * 0.1이면 캔버스 높이의 10%
    this.x = App.width; // 벽의 시작지점을 App.width로 해서 처음에 보이지 않도록.
    // y1 범위 : (-this.height) ~ (App.height - this.gapY - this.height)
    this.y1 = -this.height + randomNumBetween(30, App.height - this.gapY - 30); // 윗 벽 (30을 추가한 이유는 이미지의 세부 위치에 맞게 임의조정한거임)
    this.y2 = this.y1 + this.height + this.gapY; // 아래 벽

    this.generatedNext = false;
    this.gapNextX = App.width * randomNumBetween(0.6, 0.75);
  }
  // 벽이 바깥으로 나갔는지 체크.
  get isOutside() {
    return this.x + this.width < 0; // 단순히 x가 아니라 자기 width를 더한 값이 0보다 작아졌을 때임.
  }
  get canGenerateNext() {
    return !this.generatedNext && this.x + this.width < this.gapNextX;
  }
  update() {
    this.x -= 6;
  }
  draw() {
    // 이미지를 불러옵니다.
    // drawImage의 값을 조절해 타입에 맞게 다르게 이미지를 보여줍니다.
    // sx, sy, sw, sh (시작할 sx,sy에서 width, height인 sw, sh)

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
  }
}
