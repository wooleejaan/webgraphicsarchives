import Vector from "./Vector.js";

export default class Dot {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    // 이전에 velocity를 그냥 숫자로 적용했었음.
    // 그때 예를 들어, velocity가 5면 무슨 의미?
    // m/s는 1초에 이동한 거리를 m 단위로 나타낸 것임.
    // 우리는 캔버스에서 속도 개념을 표현할 때, App.js의 render 메서드 안에서 frame 함수가 1번 도는 동안 이동한 거리를 속도(velocity)로 표현했었음.
    // 그러므로 velocity가 5면, 1프레임 동안 5px 만큼 이동했다는 뜻이었음.
    this.oldPos = new Vector(x, y);

    // 중력을 다룰 건데, 그것도 Vector로 관리.
    // 계속 y값을 1씩 더해주면 중력처럼 점점 속도가 빨라짐.
    this.gravity = new Vector(0, 1);

    // 물리적으로 하늘에서 공을 떨어트리면, 속도가 점점 빨라짐
    // 중력값이 계속 더해져서 속도가 무한히 빨라지지는 않음.
    // 이유는, 공기 마찰력 때문임. 어느 정도의 속도에 도달하면 속도에 계속 중력값을 더해도
    // 마찰력과 일정한 지점에서 서로 상쇄가 되므로 어느 시점부터는 일정 속도로 떨어짐. (confetti 구현할 때 참고)
    this.friction = 0.97;
  }
  update() {
    // 이제 velocity를 Update 함수에서 vel 변수로 표현할거임
    // 즉 이전 프레임에서 내 위치가 x였는데, 다음 프레임 실행될 때는 내 위치가 x2에 있다고 가정해보면
    // x2-x 뺀 값이 결국은, 거리이고 그게 1프레임 동안 이동한 거리가 속도라고 말할 수 있음.
    // 왜 이렇게 표현하냐면,
    // 나중에 1개의 점이 속도가 0인데, 같은 직선으로 연결된 다른 점이 속도값을 갖게 되면
    // => 속도가 0인 점에도 영향을 주려면 이전위치와 현재위치를 통해서 속도값을 구해야 함.
    let vel = Vector.sub(this.pos, this.oldPos);

    this.oldPos.setXY(this.pos.x, this.pos.y); // 현재 값을 이전 위치로 지정해주고

    vel.mult(this.friction); // 마찰력을 곱해주지 않으면 무한히 빨라지게 됨.
    // vel.x += 0.1;
    vel.add(this.gravity); // add를 사용하면 vel.x += 0.1;에 비해 좀 더 깔끔해지는 거임
    this.pos.add(vel); // 속도를 더해주면 움직이기 시작한다. (이 속도에 gravity를 계속 더해주는 거니까 속도가 점점 커지는 거임. )
  }
  draw(ctx) {
    // 이번 플젝에서는 ctx가 static이 아니라 App 안에 this로 정의되어 있으므로 밖에서 인자로 불러옴.
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}
