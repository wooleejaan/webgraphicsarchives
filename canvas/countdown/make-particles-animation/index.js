import Particle from "./js/Particle.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;
let canvasWidth = innerWidth;
let canvasHeight = innerHeight;
const interval = 1000 / 60; // 60fps (1000 / 1로 값을 주면 1초마다 실행되는 셈)

const particles = [];

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

function createRing() {
  const PARTICLE_NUM = 800;
  for (let i = 0; i < PARTICLE_NUM; i++) {
    particles.push(new Particle());
  }
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

    // 파티클이 좀 더 깔끔하게 대각선 방향으로 이동하게 구현합니다.
    // 이렇게 프레임마다 지워주면, 계속 덮어쓰지 않고 지우면서 움직이기 때문에 보다 자연스럽습니다.
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // particles.forEach((particle, index) => {
    //   particle.update();
    //   particle.draw(ctx);

    //   // opacity가 0이하면 배열에서 삭제해줘야 불필요한 update, draw를 줄일 수 있습니다.
    //   if (particle.opacity < 0) particles.splice(index, 1);
    // });

    // for문을 0부터가 아니라 끝에서부터 순회합니다.
    // 이유는, opacity가 0이하면 splice로 앞에서 지워주는데,
    // 이걸 다시 forEach로 0부터 돌면 삭제된 배열로 다른 파티클이 이동하면서
    // 파티클이 순간이동해서 깜빡이는 현상이 발생합니다.
    // 그래서 이걸 막기 위한 여러 방법 중 가장 쉬운 게 뒤에서 순회하는 방법입니다.
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);

      if (particles[i].opacity < 0) particles.splice(i, 1);
    }

    then = now - (delta % interval);
  };

  requestAnimationFrame(frame);
}

window.addEventListener("load", () => {
  init();
  render();
});

window.addEventListener("resize", init);

window.addEventListener("click", () => {
  // 클릭 시 원을 그립니다.
  createRing();
});
