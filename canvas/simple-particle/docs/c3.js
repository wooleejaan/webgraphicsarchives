const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;

const canvasWidth = 300;
const canvasHeight = 300;

canvas.style.width = canvasWidth + "px";
canvas.style.height = canvasHeight + "px";

canvas.width = canvasWidth * dpr;
canvas.height = canvasHeight * dpr;
ctx.scale(dpr, dpr);

class Particle {
  // 애니메이션을 위해서 클래스를 선언합니다.
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, (Math.PI / 180) * 360);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }
}

const x = 100;
const y = 100;
const radius = 50;
const particle = new Particle(x, y, radius); // 인스턴스를 생성합니다.

function animate() {
  // 인스턴스를 기반으로 animate 함수를 통해 그려나갑니다.
  window.requestAnimationFrame(animate); // 콜백함수인 animate 함수를 매 프레임마다 실행합니다.
  // 매 프레임마다 아래 로직들이 실행됩니다.
  // 단순히 코드를 작성하면 매 프레임마다 덮어씌우게 되므로, 매번 초기화를 해줘야 합니다.
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 매 프레임마다 캔버스 프레임 전체를 지우고 새로 그리도록 합니다.
  particle.draw();
}

animate();
