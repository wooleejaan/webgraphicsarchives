const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;
let canvasWidth = innerWidth;
let canvasHeight = innerHeight;
const interval = 1000 / 60; // 60fps (1000 / 1로 값을 주면 1초마다 실행되는 셈)

function init() {
  // init 실행 시마다 inner 값 가져오기
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;
  // 같은 콘텐츠를 특정 디바이스에서는 보다 선명하게 볼 수 있게 합니다.
  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";
  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  ctx.scale(dpr, dpr);
}

function render() {
  let now, delta;
  let then = Date.now();
  const frame = () => {
    // 현재 디스플레이 사양에 따라, 매 프레임마다 실행될 수 있는 requestAnimationFrame
    requestAnimationFrame(frame);

    // fps 적용
    now = Date.now();
    delta = now - then;
    if (delta < interval) return;
    // delta가 interval보다 커지는 시점에 아래 로직으로 한 장면을 실행.

    then = now - (delta % interval);
  };

  requestAnimationFrame(frame);
}

window.addEventListener("load", () => {
  init();
  render();
});

window.addEventListener("resize", init);
