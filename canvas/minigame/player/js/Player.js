import App from "./App.js";

export default class Player {
  constructor() {
    this.img = document.querySelector("#bird-img");
    this.x = App.width * 0.1;
    this.y = App.height * 0.5;
    this.width = 130;
    this.height = this.width * (96 / 140); // 원본 이미지의 캐릭터 width:height 비율에 맞게 조정
    this.counter = 0; // 캐릭터 속도 조절을 위한 변수
    this.frameX = 0;

    // 마우스 클릭 이벤트를 부착해 위/아래 이동
    this.vy = -10; // 0을 하면 바로 떨어지는데, -값을 주면 잠깐 올라갔다가 내려갈거임.
    this.gravity = 0.3;
    App.canvas.addEventListener("click", () => {
      // 중력에 따라 계속 새가 떨어질텐데, 클릭해서 끌어올린다.
      this.vy += -20;
    });
  }
  update() {
    // this.counter += 1;
    if (++this.counter % 2 === 0) {
      // 실행 주기를 줄여서 속도 조절.
      // frameX는 0~14(스프라이트 이미지 개수가 15이므로)
      // this.frameX += 1;
      // if (this.frameX === 15) this.frameX = 0;
      // if (this.frameX % 15 === 0) this.frameX = 0;
      this.frameX = ++this.frameX % 15;
    }
    // 가속도를 추가해준다
    this.vy += this.gravity;
    this.y += this.vy;
  }
  draw() {
    // sx,sy는 자르기 시작할 (x,y)
    // sw,sh는 자를 영역의 width,height
    App.ctx.drawImage(
      this.img,
      (this.img.width / 15) * this.frameX, // 0을 곱해주면 0번째, ... n을 곱해주면 n번째 이미지를 보여주게 됨.
      0, // sy는 항상 0
      this.img.width / 15, // 스트라이트 이미지 개수가 15개이므로.
      this.img.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
