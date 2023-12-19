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
}

function confetti({ x, y, count, deg, colors }) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, deg, colors));
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

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);

      // 투명도를 기준으로 배열에거 제거합니다.
      if (particles[i].opacity < 0) {
        particles.splice(i, 1);
      }
    }
    // 잘 제거됐는지 확인하려면, console.log(particles.length)

    then = now - (delta % interval);
  };
  requestAnimationFrame(frame);
}

window.addEventListener("click", () => {
  confetti({
    x: 0, // 0 ~ 1 사이 값을 편하게 넣으면 됩니다.
    y: 0.5, // 0 ~ 1 사이 값을 편하게 넣으면 됩니다.
    // y: canvasHeight / 2,
    count: 10,
    deg: -50,
    colors: ["#FF0000"],
  });
});
window.addEventListener("resize", init);
window.addEventListener("load", () => {
  init();
  render();
});
