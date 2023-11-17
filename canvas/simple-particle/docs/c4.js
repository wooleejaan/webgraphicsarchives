const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;

// 캔버스 크기를 전체로 변경합니다.
const canvasWidth = innerWidth;
const canvasHeight = innerHeight;

canvas.style.width = canvasWidth + "px";
canvas.style.height = canvasHeight + "px";

canvas.width = canvasWidth * dpr;
canvas.height = canvasHeight * dpr;
ctx.scale(dpr, dpr);

class Particle {
  constructor(x, y, radius, vy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vy = vy; // 가변적인 y를 설정합니다.
  }
  update() {
    // this.y += 1;
    this.y += this.vy; // 각 도형마다 랜덤하게 변화하도록 합니다.
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, (Math.PI / 180) * 360);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
  }
}

// 파티클을 여러 개 생성합니다.
const TOTAL = 10;
const randomNumBetween = (min, max) => Math.random() * (max - min + 1) + min;
let particles = [];
for (let i = 0; i < TOTAL; i++) {
  // 파티클을 생성할 때 랜덤한 위치로 생성합니다.
  const x = randomNumBetween(0, canvasWidth);
  const y = randomNumBetween(0, canvasHeight);
  const vy = randomNumBetween(1, 5);
  const radius = randomNumBetween(50, 100); // 반지름이 50~100 사이의 난수
  const particle = new Particle(x, y, radius, vy);
  particles.push(particle);
}

let interval = 1000 / 60; // 목표 인터벌을 설정합니다. 1000/60으로 하면 60fps를 목표로하게 됩니다.
let now, delta;
let then = Date.now();

function animate() {
  window.requestAnimationFrame(animate);
  // requestAnimationFrame은 모니터 주사율만큼 실행되더라도 애니메이션은 now, delta, then을 통해 일정하게 만듭니다.
  // 매 실행마다 Date.now로 시간을 가져옵니다.
  now = Date.now();
  delta = now - then;

  if (delta < interval) return;
  // delta가 interval보다 커지는 시점에 아래 애니메이션 로직을 실행합니다.
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // 매 프레임마다 파티클을 그립니다.
  particles.forEach((particle) => {
    particle.update(); // 단순히 draw 전에 update 함수로 매 프레임마다 움직임을 부여합니다.
    particle.draw();

    // 단순히 particle.y - 0이 아니라 원의 반지름으로 기준을 잡아야 자연스럽습니다.
    if (particle.y - particle.radius > canvasHeight) {
      // 바닥에 닿으면
      particle.y = -particle.radius; // 다시 위치를 초기화합니다.
      // 위치를 초기화할 때, 모든 위치를 새롭게 랜덤하게 잡아주면 더 자연스러워집니다.
      particle.x = randomNumBetween(0, canvasWidth);
      particle.vy = randomNumBetween(1, 5);
      particle.radius = randomNumBetween(50, 100); // 반지름이 50~100 사이의 난수
    }
  });

  then = now - (delta % interval); // then을 초기화해줍니다. 즉, 이전 then에서 인터벌만큼만 더한 값으로 초기화힙니다.
}

animate();
