import Particle from "./js/Particle.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio > 1 ? 2 : 1;
let canvasWidth = innerWidth;
let canvasHeight = innerHeight;
const interval = 1000 / 60;

const particles = [];

function init() {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;
  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";
  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  ctx.scale(dpr, dpr);

  // confetti({
  //   x: canvasWidth / 2,
  //   y: canvasHeight / 2,
  //   count: 10,
  // });
}

function confetti({ x, y, count, deg }) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, deg));
  }
}

function render() {
  let now, delta;
  let then = Date.now();

  const frame = () => {
    requestAnimationFrame(frame);
    now = Date.now();
    delta = now - then;
    if (delta < interval) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 나중에 지워주는 걸 고려해서, 뒤에서부터 반복문 순회
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
    }

    then = now - (delta % interval);
  };
  requestAnimationFrame(frame);
}

window.addEventListener("click", () => {
  // confetti 움직임 확인을 위해 Click 마다 생성
  confetti({
    x: 0, // 0을 주면 왼쪽에서 터집니다.
    y: canvasHeight / 2,
    count: 10,
    deg: -50,
  });
});
window.addEventListener("resize", init);
window.addEventListener("load", () => {
  init();
  render();
});
