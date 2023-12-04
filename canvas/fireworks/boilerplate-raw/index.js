const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;
const fps = 60;
const interval = 1000 / fps;
let now, delta;
let then = Date.now();

let canvasWidth, canvasHeight;

function init() {
  // canvas 가로x세로 보일러 플레이팅 (모니터별 dpr 대응)
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;

  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  ctx.scale(dpr, dpr);

  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";
}

function render() {
  // animation fps 대응 (기기별 동일한 애니메이션 주기 고정)
  requestAnimationFrame(render);
  now = Date.now();
  delta = now - then;
  if (delta < interval) return;

  // 여기에 로직을 작성합니다.

  then = now - (delta % interval);
}

window.addEventListener("load", () => {
  init();
  render();
});

// 사이즈 변경될 때마다 init만 재실행
window.addEventListener("resize", () => {
  init();
});
