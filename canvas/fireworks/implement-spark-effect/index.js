import CanvasOption from "./js/CanvasOption.js";
import Particle from "./js/Particle.js";
import Tail from "./js/Tail.js";
import Spark from "./js/Spark.js";
import { hypotenuse, randomNumBetween } from "./js/utils.js";

class Canvas extends CanvasOption {
  constructor() {
    super();

    this.tails = [];
    this.particles = [];
    this.sparks = []; // spark도 배열로 관리합니다.
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
  createTail() {
    const x = randomNumBetween(this.canvasWidth * 0.2, this.canvasWidth * 0.8);
    const vy = this.canvasHeight * randomNumBetween(0.01, 0.015) * -1;
    // hsl을 사용하기 위해, color가 아니라 colorDegree를 넣어줍니다.
    const colorDeg = randomNumBetween(0, 360);
    this.tails.push(new Tail(x, vy, colorDeg));
  }

  // color => colorDeg로 변경해줍니다.
  createParticles(x, y, colorDeg) {
    const PARTICLE_NUM = 400;
    for (let i = 0; i < PARTICLE_NUM; i++) {
      const r =
        randomNumBetween(2, 100) * hypotenuse(innerWidth, innerHeight) * 0.0001;
      const angle = (Math.PI / 180) * randomNumBetween(0, 360);

      const vx = r * Math.cos(angle);
      const vy = r * Math.sin(angle);
      const opacity = randomNumBetween(0.6, 0.9);
      // 색상을 다양하게 하기 위해 colorDeg에서 랜덤한 -20 ~ 20 사이 값을 추가해줍니다.
      const _colorDeg = randomNumBetween(-20, 20) + colorDeg;
      this.particles.push(new Particle(x, y, vx, vy, opacity, _colorDeg));
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

      // particles 배열 길이를 사용해서 배경색을 변경합니다.
      // 폭죽이 터지면 배경색이 잠깐 밝아지도록 하기 위함입니다.
      this.ctx.fillStyle = `rgba(255, 255, 255, ${
        this.particles.length / 50000
      })`;
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      if (Math.random() < 0.03) this.createTail();

      this.tails.forEach((tail, index) => {
        tail.update();
        tail.draw();
        // 꼬리에도 피어오를 때, 잔상을 남기기 위해
        // 한번 꼬리 프레임이 이동될 때마다
        // Spark를 생성해줍니다.
        // tail.vy는 점점 0에 수렴하므로
        // 잔상이 남다가 마지막에는 점점 사라지도록 하기 위해 tail.vy를 전체 길이로 사용합니다.
        for (let i = 0; i < Math.round(-tail.vy * 0.5); i++) {
          const vx = randomNumBetween(-5, 5) * 0.05;
          const vy = randomNumBetween(-5, 5) * 0.05;
          // 꼬리 잔상이 메인이 아니므로 opacity를 조절합니다.
          // 최대 0.5
          // tail.vy는 -20 정도로 시작할테니까,
          const opacity = Math.min(-tail.vy, 0.5);
          this.sparks.push(
            new Spark(tail.x, tail.y, vx, vy, opacity, tail.colorDeg)
          );
        }

        if (tail.vy > -0.7) {
          // 꼬리를 splice하는 지점에서
          // tail.color를 넣어주고 있는데,
          // colorDeg로 변경해줍니다.
          this.tails.splice(index, 1);
          this.createParticles(tail.x, tail.y, tail.colorDeg);
        }
      });

      this.particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        // 파티클이 흩어지는 구간에 Spark를 생성해줘야 합니다.
        // 그러므로 여기 particle이 그려지는 시점에
        // 잔상처럼 남게 해주기 위해 spark 인스턴스를 추가해줍니다.
        // 단순히 생성하면 파티클 개수(현재 400개)만큼 생성되므로 성능 이슈가 발생합니다.
        // 그래서 Math.random으로 일부만 생성하도록 조건을 걸어줍니다.
        if (Math.random() < 0.1) {
          // 파티클 생성시의 잔상의 경우, Spark가 gold 색상에 가깝도록 Hue를 45로 줍니다.
          this.sparks.push(new Spark(particle.x, particle.y, 0, 0, 0.3, 45));
        }

        if (particle.opacity < 0) {
          this.particles.splice(index, 1);
        }
      });

      // forEach를 통해, spark도 Draw와 Update를 해줍니다.
      this.sparks.forEach((spark, index) => {
        spark.update();
        spark.draw();

        if (spark.opacity < 0) {
          this.sparks.splice(index, 1);
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
