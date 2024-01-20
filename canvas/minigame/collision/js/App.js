import Background from "./Background.js";
import Player from "./Player.js";
import Wall from "./Wall.js";

export default class App {
  static canvas = document.querySelector("canvas");
  static ctx = App.canvas.getContext("2d");
  static dpr = devicePixelRatio > 1 ? 2 : 1;
  static interval = 1000 / 60;
  static width = 1024;
  static height = 768;

  constructor() {
    this.backgrounds = [
      new Background({ img: document.querySelector("#bg3-img"), speed: -1 }),
      new Background({ img: document.querySelector("#bg2-img"), speed: -2 }),
      new Background({ img: document.querySelector("#bg1-img"), speed: -4 }),
    ];
    this.walls = [new Wall({ type: "SMALL" })];
    this.player = new Player();

    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    App.canvas.width = App.width * App.dpr;
    App.canvas.height = App.height * App.dpr;
    App.ctx.scale(App.dpr, App.dpr);

    // 4:3 비율을 맞춰주기 위한 작업.
    const width =
      innerWidth > innerHeight ? innerHeight * 0.9 : innerWidth * 0.9;
    App.canvas.style.width = width + "px";
    App.canvas.style.height = width * (3 / 4) + "px";
  }

  render() {
    let now, delta;
    let then = Date.now();
    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - then; // (now - then)이 맞음 (now - delta는 오타임)
      if (delta < App.interval) return;

      App.ctx.clearRect(0, 0, App.width, App.height);

      // backgrounds 실행
      this.backgrounds.forEach((background) => {
        background.update();
        background.draw();
      });

      // walls를 실행.
      // 앞에껄 제거하지 않도록 역순 실행을 위해 forEach 대신 for loop
      for (let i = this.walls.length - 1; i >= 0; i--) {
        this.walls[i].update();
        this.walls[i].draw();

        // wall 제거
        if (this.walls[i].isOutside) {
          this.walls.splice(i, 1);
          continue;
        }

        // wall 생성
        if (this.walls[i].canGenerateNext) {
          this.walls[i].generatedNext = true; // 더 이상 생성하지 못하게 만들고 나서
          this.walls.push(
            new Wall({
              type: Math.random() > 0.3 ? "SMALL" : "BIG",
            })
          );
        }

        // 벽과 플레이어 충돌
        if (this.walls[i].isColliding(this.player.boundingBox)) {
          console.log("colliding!!");
          this.player.boundingBox.color = `rgba(255, 0, 0, 0.3)`;
        } else {
          this.player.boundingBox.color = `rgba(0, 0, 255, 0.3)`;
        }
      }

      // 플레이어 관련
      this.player.update();
      this.player.draw();

      then = now - (delta % App.interval);
    };
    requestAnimationFrame(frame);
  }
}
