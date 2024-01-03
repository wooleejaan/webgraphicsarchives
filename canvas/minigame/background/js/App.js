import Background from "./Background.js";

export default class App {
  static canvas = document.querySelector("canvas");
  static ctx = App.canvas.getContext("2d");
  static dpr = devicePixelRatio > 1 ? 2 : 1;
  static interval = 1000 / 60;
  static width = 1024;
  static height = 768;

  constructor() {
    // 배경 인스턴스를 가져옵니다.
    // 2d 이미지에서 원근감을 주려면, 사물마다 이동 속도를 다르게 주면 됨.
    // 가까이 있는 건 빠르게, 뒤에 있는 건 느리게.
    this.backgrounds = [
      new Background({ img: document.querySelector("#bg3-img"), speed: -1 }),
      new Background({ img: document.querySelector("#bg2-img"), speed: -2 }),
      new Background({ img: document.querySelector("#bg1-img"), speed: -4 }),
    ];
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    App.canvas.width = App.width * App.dpr;
    App.canvas.height = App.height * App.dpr;
    App.ctx.scale(App.dpr, App.dpr);

    // 4:3 비율을 맞춰주기 위한 작업.
    const width =
      innerWidth > innerHeight ? innerHeight * 0.9 : innerWidth * 0.9;
    App.canvas.style.width = width + "px";
    App.canvas.style.height = width * (3 / 4) + "px";
  }

  render() {
    let now, delta;
    let then = Date.now();
    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - delta;
      if (delta < App.interval) return;

      App.ctx.clearRect(0, 0, App.width, App.height);

      // update에서 x 값을 움직여주면 마치 배경이미지에서 이동하는 듯한 모션을 구현할 수 있음.
      // this.background.update();
      // 배경 이미지를 그려줍니다.
      // this.background.draw();
      this.backgrounds.forEach((background) => {
        background.update();
        background.draw();
      });

      then = now - (delta % App.interval);
    };
    requestAnimationFrame(frame);
  }
}
