import App from "./App.js";

export default class Background {
  constructor(config) {
    this.img = config.img;
    // 배경색의 경우, width는 매우 길게 해서 게임처럼 배경 이미지가 계속 나오게 해야 함.
    // height는 App 크기만큼.
    this.height = App.height;
    // this.width : this.height = App.width : App.height 이므로
    // this.width = App.height * (this.img.width / this.img.height)
    this.width = App.height * (this.img.width / this.img.height);
    this.leftPos = { x: 0, y: 0 };
    // 오른쪽 이미지는 왼쪽 이미지 바로 오른쪽에 있어야 하므로 thsi.width를 초기값으로.
    // 이미지가 이어져 있지 않다면 this.width +=로 연속적이게 조절. (여기에서 -4처리)
    this.rightPos = { x: this.width - 4, y: 0 };
    this.speed = config.speed;
  }
  update() {
    // 왼쪽이미지가 화면에서 사라지면, 오른쪽 이미지 오른쪽에 바로 갖다 붙이기.
    // 이미지가 이어져 있지 않다면 this.width +=로 연속적이게 조절. (여기에서 -4처리)
    if (this.leftPos.x + this.width < 0) {
      this.leftPos.x = this.rightPos.x + this.width - 4;
    }
    // 그 다음엔 rightPos가 왼쪽에 배치될테니까. 마찬가지로 이동처리.
    // 이미지가 이어져 있지 않다면 this.width +=로 연속적이게 조절. (여기에서 -4처리)
    if (this.rightPos.x + this.width < 0) {
      this.rightPos.x = this.leftPos.x + this.width - 4;
    }

    this.leftPos.x += this.speed;
    this.rightPos.x += this.speed;

    // update에서 x 값을 움직여주면 마치 배경이미지에서 이동하는 듯한 모션을 구현할 수 있음.
    // 무한히 이동하듯이 하려면 이미지를 2개(왼쪽/오른쪽) 사용해서,
    // 왼쪽 이미지가 사라지면 왼쪽 이미지를 다시 오른쪽에 배치해서 무한히 보여주게 할 수 있음.
    // 왼쪽 이미지가 사라지는 건, left.x + this.width가 0보다 작아질 때.
    // this.pos.x -= 20;
  }
  draw() {
    App.ctx.drawImage(
      this.img,
      this.leftPos.x,
      this.leftPos.y,
      this.width,
      this.height
    );
    App.ctx.drawImage(
      this.img,
      this.rightPos.x,
      this.rightPos.y,
      this.width,
      this.height
    );
  }
}
