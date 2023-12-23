export default class App {
  // 프로젝트 전체에서 사용할 고정 상수값들
  static canvas = document.querySelector("canvas");
  static ctx = App.canvas.getContext("2d");
  static dpr = devicePixelRatio > 1 ? 2 : 1;
  static interval = 1000 / 60;
  static width = 1024; // width,height를 4:3 비율로 고정
  static height = 768;

  constructor() {
    // bind(this)를 해야 하는 이유
    // bind(this)를 안 해주면 처음에는 App 클래스를 가리키다가
    // resize를 하기 시작하면 window를 가리키게 되므로.
    // 기본적으로 addEventListener는 bind를 등록하지 않으면 이벤트를 등록한 window를 this로 인식하므로.
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
    // 주사율 높은 모니터에서 더 빠르게 실행되는 걸 막기 위함.
    let now, delta;
    let then = Date.now();
    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - delta;
      if (delta < App.interval) return;

      App.ctx.clearRect(0, 0, App.width, App.height);
      App.ctx.fillRect(50, 50, 100, 100);

      then = now - (delta % App.interval);
    };
    requestAnimationFrame(frame);
  }
}
