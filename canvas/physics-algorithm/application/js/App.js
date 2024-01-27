import Mouse from "./Mouse.js";
import Rope from "./Rope.js";
import { randomNumBetween } from "./utils.js";

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

    this.ropes = [];
    const rope_1 = new Rope({
      x: 400,
      y: 100,
    });
    rope_1.pin(0); // 0번째 index 고정
    this.ropes.push(rope_1);
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

    // resize 시마다, ropes 배열 초기화
    this.initRopes();
  }
  initRopes() {
    this.ropes = [];
    // 생성할 ropes (화면 사이즈마다 rope 개수를 다르게 해주려고)
    const TOTAL = App.width * 0.06;

    for (let i = 0; i < TOTAL; i++) {
      const rope = new Rope({
        x: randomNumBetween(App.width * 0.3, App.width * 0.7),
        y: 0, // 천장에 매달려 있게 하기 위해서.
        gap: randomNumBetween(App.height * 0.05, App.height * 0.08), // 길이를 랜덤하게
      });
      rope.pin(0);
      this.ropes.push(rope);
    }
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
      this.ropes.forEach((rope) => {
        rope.update(this.mouse);
        rope.draw(this.ctx);
      });
    };
    requestAnimationFrame(frame);
  }
}
