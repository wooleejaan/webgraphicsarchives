import CanvasOption from "./js/CanvasOption.js";
import Particle from "./js/Particle.js";
import Tail from "./js/Tail.js";
import { hypotenuse, randomNumBetween } from "./js/utils.js";

class Canvas extends CanvasOption {
  constructor() {
    super();

    // 꼬리도 particles처럼 관리하기 위해 배열을 생성합니다.
    this.tails = [];
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
  // createParticle의 경우, 파티클 개수만큼 constructor에 들어가는 값을 랜덤으로 가져와서
  // 파티클 인스턴스를 만들어서 particles 배열에 추가해주는 방식이었습니다.
  // createTail도 비슷한 프로세스를 거칩니다.
  createTail() {
    // 꼬리가 동시에 여러 개가 아니라, 한 불꽃놀이에 하나의 꼬리이므로
    // particles와 달리, 하나만 생성하면 됩니다.
    // class Tail에 x, vy, color를 파라미터로 받으므로 랜덤 값을 x,vy,color를 생성하면 됩니다.

    // 불꽃놀이의 경우, 끝지점이나 x=0에서 시작되면 일부가 가려질 수 있으므로,
    // 대략 20%~80% 범위에서만 생성되도록 합니다.
    const x = randomNumBetween(this.canvasWidth * 0.2, this.canvasWidth * 0.8);
    // vy값을 -20에서 -15~-20으로 올려서 꼬리의 위치를 높게 잡습니다.
    // 단순히 고정값 -15 ~ -20을 주면 화면이 줄어들었을 때 대응이 어려우므로 canvasHeight도 고려해줍니다.
    const vy = this.canvasHeight * randomNumBetween(0.01, 0.015) * -1;
    // Particle 인스턴스에서 rgb 값으로 색상을 만드므로 Color도 양식을 맞춰줍니다.
    const color = "255, 255, 255";
    this.tails.push(new Tail(x, vy, color));
  }

  createParticles(x, y, color) {
    const PARTICLE_NUM = 400;
    // 기존 랜덤 x,y값을 제거하고 파라미터로 받습니다.
    // const x = randomNumBetween(0, this.canvasWidth);
    // const y = randomNumBetween(0, this.canvasHeight);
    for (let i = 0; i < PARTICLE_NUM; i++) {
      const r =
        randomNumBetween(2, 100) * hypotenuse(innerWidth, innerHeight) * 0.0001;
      const angle = (Math.PI / 180) * randomNumBetween(0, 360);

      const vx = r * Math.cos(angle);
      const vy = r * Math.sin(angle);
      const opacity = randomNumBetween(0.6, 0.9);
      // 파티클 인스턴스에 color를 추가적으로 넘겨줍니다.
      this.particles.push(new Particle(x, y, vx, vy, opacity, color));
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

      this.ctx.fillStyle = this.bgColor + "40";
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      // createTail 함수를 통해 꼬리를 발사하며, 이 동작은 frame 안에서 해당 함수를 실행하면 됩니다.
      // 꼬리가 쉴새없이 생성되는 이유는, frame 함수 실행될 때마다 createTail이 실행되기 때문입니다.
      // this.createTail();
      // 그러므로 꼬리를 랜덤으로 생성합니다.
      // frame 함수는 1초에 수십번 실행되므로, 0.03도 적은 확률이 절대 아닙니다.
      if (Math.random() < 0.03) this.createTail();

      // createTail만으로는 아무런 변화가 없으며,
      // update, draw 함수도 실행해줘야 합니다.
      this.tails.forEach((tail, index) => {
        tail.update();
        tail.draw();

        // 꼬리가 멈추는 지점에서 불꽃놀이를 실행해줍니다.
        // tails 배열이 루프가 되는 곳이 멈춰지는 시점 즈음입니다.
        // 각 꼬리의 속도가 0이 되는 시점에, tail을 tails에서 Splice로 제거해주고
        // createParticles로 파티클들을 만들어주면 됩니다.
        // 정확히 0보다는 그 즈음이므로 -1보다 큰 시점으로 잡습니다.
        if (tail.vy > -0.7) {
          this.tails.splice(index, 1);
          // createParticles는 기존에는 랜덤값을 임의로 생성하고 있기에,
          // 꼬리가 사라지는 시점에 x,y를 createParticles로 넘겨줘서 정확한 위치에서 터지도록 합니다
          this.createParticles(tail.x, tail.y, tail.color);
        }
      });

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
