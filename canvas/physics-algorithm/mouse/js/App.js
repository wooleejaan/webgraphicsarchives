import Dot from "./Dot.js";
import Mouse from "./Mouse.js";
import Stick from "./Stick.js";

export default class App {
  static width = innerWidth;
  static height = innerHeight;
  static dpr = devicePixelRatio > 1 ? 2 : 1;
  static interval = 1000 / 60;

  constructor() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.resize();
    window.addEventListener("resize", this.resize.bind(this)); // this 값을 window가 아니라 App으로 인식하도록 강제

    this.mouse = new Mouse(this.canvas);

    this.dots = [
      new Dot(400, 50),
      new Dot(500, 100),
      new Dot(600, 50),
      new Dot(800, 0),
    ];
    this.sticks = [
      new Stick(this.dots[0], this.dots[1]),
      new Stick(this.dots[1], this.dots[2]),
      new Stick(this.dots[2], this.dots[3]),
    ];
    this.dots[0].pinned = true;
  }
  resize() {
    App.width = innerWidth;
    App.height = innerHeight;

    // canvas css width/height와 canvas 고유의 width/height까지 싱크맞춰주는 작업 (스타일 싱크, dpr 싱크)
    // 스타일 싱크
    this.canvas.style.width = App.width + "px";
    this.canvas.style.height = App.height + "px";

    // dpr 싱크 (선명도만 높이고, 사이즈는 모니터 달라도 동일하게 맞춰주는 작업)
    this.canvas.width = App.width * App.dpr;
    this.canvas.height = App.height * App.dpr;
    this.ctx.scale(App.dpr, App.dpr);
  }
  render() {
    let now, delta;
    let then = Date.now();

    const frame = () => {
      requestAnimationFrame(frame); // 재귀함수로, 기기의 모니터 주사율마다 프레임 함수 실행될 수 있게
      now = Date.now();
      delta = now - then;
      if (delta < App.interval) return;
      then = now - (delta % App.interval);

      this.ctx.clearRect(0, 0, App.width, App.height);
      // 그림 그리는 공간
      // 아래처럼 그리면 dots와 sticks가 유기적으로 그려지지 않음. update와 draw를 분리해야 함.
      // this.dots.forEach((dot) => {
      //   dot.update(this.mouse); // mouse 인스턴스 삽입
      //   dot.draw(this.ctx);
      // });
      // this.sticks.forEach((stick) => {
      //   stick.update();
      //   stick.draw(this.ctx);
      // });

      // 이렇게 유기적으로 그려야 늘어나더라도 선이 마우스에 착 달라붙게 그릴 수 있음.
      this.dots.forEach((dot) => {
        dot.update(this.mouse); // mouse 인스턴스 삽입
      });
      this.sticks.forEach((stick) => {
        stick.update();
      });
      this.dots.forEach((dot) => {
        dot.draw(this.ctx);
      });
      this.sticks.forEach((stick) => {
        stick.draw(this.ctx);
      });
    };
    requestAnimationFrame(frame);
  }
}
