import App from "./App.js";
import BoundingBox from "./BoundingBox.js";

export default class Player {
  constructor() {
    this.img = document.querySelector("#bird-img");
    this.x = App.width * 0.1;
    this.y = App.height * 0.5;
    this.width = 130;
    this.height = this.width * (96 / 140);

    // boundingBox를 불러옵니다.
    this.boundingBox = new BoundingBox(
      this.x + 10, // 10, 16 더해주는 것도 boundingBox를 최적화해서 이미지랑 알맞게 맞추려고 조정한 값임.
      this.y + 16,
      this.width - 20,
      this.height - 20
    );

    this.counter = 0;
    this.frameX = 0;

    this.vy = -10;
    this.gravity = 0.3;
    App.canvas.addEventListener("click", () => {
      this.vy += -20;
    });
  }
  update() {
    if (++this.counter % 2 === 0) {
      this.frameX = ++this.frameX % 15;
    }
    this.vy += this.gravity;
    this.y += this.vy;
    // boundingBox와 플레이어 y도 같이 맞춰준다.
    this.boundingBox.y = this.y + 16;
  }
  draw() {
    App.ctx.drawImage(
      this.img,
      (this.img.width / 15) * this.frameX,
      0,
      this.img.width / 15,
      this.img.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    // 플레이어 그리는 작업이 끝나면
    this.boundingBox.draw();
  }
}
