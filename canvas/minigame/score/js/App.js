import Background from "./Background.js";
import Coin from "./Coin.js";
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
    this.coins = [];

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
          const newWall = new Wall({
            type: Math.random() > 0.3 ? "SMALL" : "BIG",
          });

          this.walls.push(newWall);

          // 벽 생성 시에 랜덤하게 코인도 생성
          if (Math.random() < 0.5) {
            // Math.random()이 1보다 작으면 항상 등장(Math.random()은 항상 1보다 작으므로)
            const x = newWall.x + newWall.width / 2;
            const y = newWall.y2 - newWall.gapY / 2;

            this.coins.push(new Coin(x, y, newWall.vx));
          }
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

      // 코인 관련
      for (let i = this.coins.length - 1; i >= 0; i--) {
        this.coins[i].update();
        this.coins[i].draw();

        // 코인 제거
        if (this.coins[i].x + this.coins[i].width < 0) {
          this.coins.splice(i, 1);
          continue; // 코인이 제거되면 그 아래는 진행되면 안 되므로 continue
        }

        // 코인 충돌 처리
        if (this.coins[i].boundingBox.isColliding(this.player.boundingBox)) {
          console.log("the player collide with front coin");
          this.coins.splice(i, 1); // 충돌하면 제거
        }
      }

      then = now - (delta % App.interval);
    };
    requestAnimationFrame(frame);
  }
}
