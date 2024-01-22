import App from "./App.js";
import Coin from "./Coin.js";

export default class Score {
  constructor() {
    this.coin = new Coin(App.width - 50, 50, 0);
    this.coin.frameX = 9; // 스프라이트 이미지의 코인 자체가 정면이 아니므로 정면으로 만들어줍니다.

    this.distCount = 0; // 거리 상태값
    this.coinCount = 0; // 코인 상태값
  }
  update() {
    // 업데이트 함수 호출되는 만큼 거리 증가
    this.distCount += 0.015;
  }
  draw() {
    this.coin.draw();

    App.ctx.font = "55px Jua";
    App.ctx.fillStyle = "#f1f1f1";
    App.ctx.textAlign = "right"; // 점수가 늘어나도 왼쪽으로 늘어나지 않도록
    App.ctx.fillText(this.coinCount, App.width - 90, 69);

    App.ctx.textAlign = "left";
    App.ctx.fillText(Math.floor(this.distCount) + "m", 25, 69);
  }
}
