import CanvasOption from "./js/CanvasOption.js";
import Particle from "./js/Particle.js";
import { hypotenuse, randomNumBetween } from "./js/utils.js";

class Canvas extends CanvasOption {
  constructor() {
    super();

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

    this.createParticles();
  }

  createParticles() {
    const PARTICLE_NUM = 400;
    const x = randomNumBetween(0, this.canvasWidth);
    const y = randomNumBetween(0, this.canvasHeight);
    for (let i = 0; i < PARTICLE_NUM; i++) {
      // 랜덤한 반지름이 0~3이면 크기가 작을 수밖에 없으므로,
      // 범위를 2~100으로 늘립니다.
      // 0.2를 곱해서 좀 더 자연스럽게 구현합니다.
      // 0.2 대신에 빗변의 길이를 구한 값으로 곱해줍니다.
      const r =
        randomNumBetween(2, 100) * hypotenuse(innerWidth, innerHeight) * 0.0001; // 랜덤한 r반지름을 구합니다.
      // 랜덤한 θ(theta) 값을 구합니다.
      // cos, sin에 넣을 angle은 degree가 아니라 radian이어야 하므로
      // Math.PI / 180을 먼저 곱해줘야 합니다.
      // 보통 2파이를 360도로 간주하므로,
      // 1파이를 180으로 나눠주고 랜덤한 0~360을 곱해주면 됩니다.
      const angle = (Math.PI / 180) * randomNumBetween(0, 360);

      // vx,vy에 r과 θ를 적용해줍니다.
      const vx = r * Math.cos(angle);
      const vy = r * Math.sin(angle);
      const opacity = randomNumBetween(0.6, 0.9);
      this.particles.push(new Particle(x, y, vx, vy, opacity));
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

      // 원래 매 프레임마다 계속해서 this.ctx.fillStyle = this.bgColor로 배경색을 칠해주고 있었는데,
      // 여기에 + '10'을 하게 되면 #000000 뒤에 10을 붙이게 된 것이므로
      // rgba 값에서 폭죽이 아주 긴 뿌리를 만들게 됩니다.
      // rgba가 더 편하면 그렇게 해도 됩니다.
      // 매 프레임마다 이전 프레임을 지우는 대신에
      // alpha 값이 10 밖에 안 되므로 여러 번 칠해줘야 화면이 검정색이 되므로
      // 잔상이 남게 됩니다.
      // 10이 아니라 60으로 바꿔주면 잔상이 적당한 값을 갖게 됩니다.
      this.ctx.fillStyle = this.bgColor + "40";
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      this.particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

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

window.addEventListener("resize", () => {
  canvas.init();
});
