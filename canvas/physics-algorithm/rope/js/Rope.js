import Dot from "./Dot.js";
import Stick from "./Stick.js";

export default class Rope {
  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    // 생성할 점의 개수
    this.segments = config.segments || 10;
    // 점과 점 사이의 거리
    this.gap = config.gap || 50;
    // Stick의 업데이트 반복 횟수
    this.iterations = config.iterations || 10;

    this.dots = [];
    this.sticks = [];

    this.create();
  }
  pin(index) {
    this.dots[index].pinned = true;
  }
  // Rope를 생성하는 메서드
  create() {
    // 점을 먼저 생성
    for (let i = 0; i < this.segments; i++) {
      // y좌표만 gap만큼 떨어지면서 일정하게 생성되도록
      this.dots.push(new Dot(this.x, this.y + i * this.gap));
    }
    // 점을 연결하는 선분 생성
    for (let i = 0; i < this.segments - 1; i++) {
      // 점과 점을 잇는 선분 생성
      this.sticks.push(new Stick(this.dots[i], this.dots[i + 1]));
    }
  }
  update(mouse) {
    // 이렇게 유기적으로 그려야 늘어나더라도 선이 마우스에 착 달라붙게 그릴 수 있음.
    this.dots.forEach((dot) => {
      dot.update(mouse); // mouse 인스턴스 삽입
    });
    // this.sticks.forEach((stick) => {
    //   stick.update();
    // });
    // 유기적으로 연결된 점과 선이 많아지면, 한프레임만 돌아서는 점,선 업데이트를 1번만 해서는 다 반영할 수 없으므로 사이드 이펙트가 발생할 수 있음.
    for (let i = 0; i < this.iterations; i++) {
      this.sticks.forEach((stick) => {
        stick.update();
      });
    }
  }
  draw(ctx) {
    this.dots.forEach((dot) => {
      dot.draw(ctx);
    });
    this.sticks.forEach((stick) => {
      stick.draw(ctx);
    });
  }
}
