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
  checkPullingOut() {
    // 해당 조건에 맞으면 털을 뽑아주는 메서드
    // 잡아 당길 때, 늘어나는 stick의 길이와 stick의 원래 길이를 비교해서 일정 비율을 넘어가면 뽑을 수 있게
    // 뽑는다는 건 0번째 고정해둔 pin을 해제한다는 의미임.

    // 실제로 늘어난 stick의 길이 (0번째와 1번째 비교)
    const dist = this.dots[0].pos.dist(this.dots[1].pos);
    // dist 나누기 0번째 스틱의 오리지널 길이 한 값이 1.2보다 크면
    // 즉, 맨 위에 있는 0번째 stick의 orignal 길이보다 실제로 늘어난 길이가 1.2배 이상 커지게 되는 순간,
    // 0번째 공의 Pin을 해제.
    if (dist / this.sticks[0].length > 1.2) {
      this.dots[0].pinned = false;
    }
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
    this.checkPullingOut();
    // 이렇게 유기적으로 그려야 늘어나더라도 선이 마우스에 착 달라붙게 그릴 수 있음.
    this.dots.forEach((dot) => {
      dot.update(mouse); // mouse 인스턴스 삽입
    });
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
    // 모든 점과 선을 그리는 작업이 끝나면,
    this.dots[this.dots.length - 1].drawLight(ctx);
  }
}
