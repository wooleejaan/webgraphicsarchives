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

// shapes를 추가합니다.
function confetti({ x, y, count, deg, colors, shapes, spread }) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, deg, colors, shapes, spread));
  }
}

function render() {
  let now, delta;
  let then = Date.now();

  let deg = 0;

  const frame = () => {
    requestAnimationFrame(frame);
    now = Date.now();
    delta = now - then;
    if (delta < interval) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // 매 프레임마다 구현되도록합니다.

    // deg를 선언해주고, 매 프레임마다 1씩 값을 키워주고
    // 더해주면, 회전하면서 쏩니다.
    deg += 1;

    // (1)
    // confetti({
    //   x: 0, // 좌측
    //   y: 0.5,
    //   count: 5,
    //   deg: -50, // 좌측 각도
    // });
    // confetti({
    //   x: 1, // 우측
    //   y: 0.5,
    //   count: 5,
    //   deg: -130, // 우측 각도
    // });

    // (2)
    // confetti({
    //   x: 0,
    //   y: 0,
    //   count: 5,
    //   deg: 45,
    // });

    // (3)
    // confetti({
    //   x: 1,
    //   y: 0,
    //   count: 5,
    //   deg: 135,
    // });

    // (4)
    // confetti({
    //   x: 0.5,
    //   y: 0.5,
    //   count: 5,
    //   deg: 270, // 여기까지 하면, 위를 향해서 발사.
    // });

    // (5)
    // confetti({
    //   x: 0.5,
    //   y: 0.5,
    //   count: 5,
    //   deg: 270,
    //   spread: 180, // spread까지 180으로 추가하면, 원모양으로 발사.
    // });

    // (6)
    // confetti({ // 정신없는 confetti
    //   x: Math.random(),
    //   y: Math.random(),
    //   count: 5,
    //   deg: 270,
    //   spread: 180,
    // });

    // (7)
    // confetti({ // 수직으로 쏘는 형태
    //   x: 0.5,
    //   y: 0.5,
    //   count: 5,
    //   deg: 270,
    //   spread: 1,
    // });

    // (7)
    confetti({
      x: 0.5,
      y: 0.5,
      count: 5,
      deg: 225 + deg,
      spread: 1,
    });
    confetti({
      x: 0.5,
      y: 0.5,
      count: 5,
      deg: 90 + deg,
      spread: 1,
    });
    confetti({
      x: 0.5,
      y: 0.5,
      count: 5,
      deg: 315 + deg,
      spread: 1,
    });
    confetti({
      x: 0.5,
      y: 0.5,
      count: 5,
      deg: 270 + deg,
      spread: 1,
    });

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);

      if (particles[i].opacity < 0) {
        particles.splice(i, 1);
      }
      // 추가적인 처리를 통한 성능 최적화.
      if (particles[i].y > canvasHeight) {
        particles.splice(i, 1);
      }
    }

    then = now - (delta % interval);
  };
  requestAnimationFrame(frame);
}

window.addEventListener("click", () => {
  confetti({
    x: 0,
    y: 0.5,
    count: 10,
    deg: -50,
    // colors: ["#FF0000"],
    shapes: ["circle"],
    spread: 1,
  });
});
window.addEventListener("resize", init);
window.addEventListener("load", () => {
  init();
  render();
});
