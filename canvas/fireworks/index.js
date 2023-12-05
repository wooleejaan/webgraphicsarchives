import CanvasOption from "./js/CanvasOption.js";
import Particle from "./js/Particle.js";
import { randomNumBetween } from "./js/utils.js";

class Canvas extends CanvasOption {
  constructor() {
    super();

    // particles 배열을 먼저 선언합니다.
    this.particles = [];
  }
  init() {
    this.canvasWidth = innerWidth;
    this.canvasHeight = innerHeight;
    this.canvas.width = this.canvasWidth * this.dpr;
    this.canvas.height = this.canvasHeight * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.canvas.style.width = this.canvasWidth + "px";
    this.canvas.style.height = this.canvasHeight + "px";

    // createParticles 함수를 실행합니다.
    this.createParticles();
  }

  // createParticles에서는 Particle을 particles 배열에 Push 해줌으로써 particle을 만들어냅니다.

  createParticles() {
    const PARTICLE_NUM = 2000; // 공의 개수입니다.
    // partcile의 경우 처음 생성시에는 같은 위치에서 시작해서 폭발하듯이 퍼져나가야 합니다.
    // 그러므로 x,y를 For문 밖에서 생성합니다.
    const x = randomNumBetween(0, this.canvasWidth); // 0~화면 전체 사이즈 사이의 랜덤한 값을 설정합니다.
    const y = randomNumBetween(0, this.canvasHeight);
    for (let i = 0; i < PARTICLE_NUM; i++) {
      // x, y의 속도
      const vx = randomNumBetween(-5, 5);
      const vy = randomNumBetween(-5, 5);
      this.particles.push(new Particle(x, y, vx, vy));
    }
  }

  render() {
    let now, delta;
    let then = Date.now();

    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - then;
      if (delta < this.interval) return;
      // 매 프레임마다 캔버스 전체 화면을 초기화해줍니다.
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      // 매 프레임마다 updatedhk draw를 실행합니다.
      // update를 통해 움직임을 제어할 수 있습니다
      this.particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        // opacity 0 미만인 particle 1개를 지웁니다.
        // 지우지 않으면, 개발자도구 > ... > more tools > performance monitor에서 CPU가 계속 돌아갑니다.
        // 기본적으로 화면을 그리기 위해 5% 정도 쓰는데, 이걸 안 지우면 계속 높게 유지됩니다.
        if (particle.opacity < 0) {
          this.particles.splice(index, 1);
        }
      });

      then = now - (delta % this.interval);
    };
    requestAnimationFrame(frame);
  }
}

const canvas = new Canvas();

window.addEventListener("load", () => {
  canvas.init();
  canvas.render();
});

// 사이즈 변경될 때마다 init만 재실행
window.addEventListener("resize", () => {
  canvas.init();
});
