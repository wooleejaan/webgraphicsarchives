export default class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
  // Vector.add (App.width처럼 Vector라는 클래스 자체를 사용할 때 실행되는 함수)
  static add(v1, v2) {
    // 인스턴스를 사용하는 게 아니므로 vector1, vector2를 인자로 받아와서 새로운 인스턴스 생성
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }
  static sub(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }
  // 이미 new Vector로 인스턴스 만들고 {그 인스턴스}.add 형태로 쓸 때 실행되는 함수
  add(x, y) {
    // 이미 선언되어 있는 인스턴스의 x,y 값을 변경해주는 것이므로
    if (arguments.length === 1) {
      // 인자 개수에 따라 다르게 처리
      // 인자 개수가 1개면, 다른 벡터 인스턴스를 인자로 준다는 의미
      this.x += x.x;
      this.y += x.y;
    } else if (arguments.length === 2) {
      this.x += x;
      this.y += y;
    }
    return this; // 더해진 벡터 인스턴스를 바로 사용할 수 있게 반환.
  }
  sub(x, y) {
    if (arguments.length === 1) {
      this.x -= x.x;
      this.y -= x.y;
    } else if (arguments.length === 2) {
      this.x -= x;
      this.y -= y;
    }
    return this;
  }
  mult(v) {
    // muli의 경우 static을 만들지 않은 이유는 이번 프로젝트에서만 쓸거라서.
    if (typeof v === "number") {
      this.x *= v;
      this.y *= v;
    } else {
      // type이 number가 아니면 벡터로 인식
      this.x *= v.x;
      this.y *= v.y;
    }
    return this;
  }
  setXY(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  dist(v) {
    // 벡터 간 거리
    // 두 점 사이의 거리 (피타고라스 정리)
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
