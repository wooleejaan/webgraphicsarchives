const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;

let canvasWidth;
let canvasHeight;
let particles;

function init() {
  // 관련 사이즈 코드를 init 함수 내부로 옮깁니다.
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;

  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";

  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  ctx.scale(dpr, dpr);

  particles = [];
  const TOTAL = canvasWidth / 30;
  for (let i = 0; i < TOTAL; i++) {
    const x = randomNumBetween(0, canvasWidth);
    const y = randomNumBetween(0, canvasHeight);
    const vy = randomNumBetween(1, 5);
    const radius = randomNumBetween(50, 100);
    const particle = new Particle(x, y, radius, vy);
    particles.push(particle);
  }
}

const feGaussianBlur = document.querySelector("feGaussianBlur");
const feColorMatrix = document.querySelector("feColorMatrix");

// 앞서 커스텀 필터를 만들 때 주입한 값들을 초기값으로 설정합니다.
const controls = {
  blueValue: 40,
  alphaChannel: 100,
  alphaOffset: -23,
  acc: 1.03,
};

let gui = new dat.GUI();

const f1 = gui.addFolder("Gooey Effect");
f1.open();
const f2 = gui.addFolder("Particle Property");

// 4가지 인자를 넣어줍니다.
// controls의 blueValue를 최소0 최대100 사이에서 테스트해본다는 의미입니다.
f1.add(controls, "blueValue", 0, 100).onChange((value) => {
  // 여기서 svg 요소를 가져와서 실시간으로 반영하도록 합니다.
  feGaussianBlur.setAttribute("stdDeviation", value);
});
f1.add(controls, "alphaChannel", 1, 200).onChange((value) => {
  feColorMatrix.setAttribute(
    "values",
    `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${value} ${controls.alphaOffset}`
  );
});
f1.add(controls, "alphaOffset", -40, 40).onChange((value) => {
  feColorMatrix.setAttribute(
    "values",
    `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${controls.alphaChannel} ${value}`
  );
});
// 5번째 인자는 스텝입니다. 얼마만큼 변화를 줄것인지에 관한 값입니다.
f2.add(controls, "acc", 1, 1.5, 0.01).onChange((value) => {
  particles.forEach((particle) => (particle.acc = value));
});

class Particle {
  constructor(x, y, radius, vy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vy = vy;
    this.acc = 1.01;
  }
  update() {
    this.vy *= this.acc;
    this.y += this.vy;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, (Math.PI / 180) * 360);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
  }
}

// const TOTAL = 10;
const randomNumBetween = (min, max) => Math.random() * (max - min + 1) + min;
// let particles = [];
// for (let i = 0; i < TOTAL; i++) {
//   const x = randomNumBetween(0, canvasWidth);
//   const y = randomNumBetween(0, canvasHeight);
//   const vy = randomNumBetween(1, 5);
//   const radius = randomNumBetween(50, 100);
//   const particle = new Particle(x, y, radius, vy);
//   particles.push(particle);
// }

let interval = 1000 / 60;
let now, delta;
let then = Date.now();

function animate() {
  window.requestAnimationFrame(animate);
  now = Date.now();
  delta = now - then;

  if (delta < interval) return;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  particles.forEach((particle) => {
    particle.update();
    particle.draw();

    if (particle.y - particle.radius > canvasHeight) {
      particle.y = -particle.radius;
      particle.x = randomNumBetween(0, canvasWidth);
      particle.vy = randomNumBetween(1, 5);
      particle.radius = randomNumBetween(50, 100);
    }
  });

  then = now - (delta % interval);
}

window.addEventListener("load", () => {
  init();
  animate();
});
window.addEventListener("resize", () => {
  init();
});
