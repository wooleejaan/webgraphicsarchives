import App from "./App.js";

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
  }
  update() {}
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
      0,
      0,
      this.width,
      this.height
    );
  }
}
