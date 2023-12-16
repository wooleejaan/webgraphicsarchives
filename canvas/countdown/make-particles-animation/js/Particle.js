import { randomNumBetween } from "./utils.js";

export default class Particle {
  constructor() {
    // constructor로 값을 받지 않고 여기 안에서만 선언하면,
    // update에서 그 어떤 변화를 줘도 변하지 않습니다.
    // 왜냐하면 매 frame마다 똑같은 값만 생성하기 때문입니다.

    // 1보다 작은 값을 계속해서 곱해주면, 계속 프레임마다 업데이트되기 때문에
    // 어느 순간에는 0에 수렴합니다.
    // 그럼 바깥으로 솟구치다가, 0으로 수렴하기에 계속 퍼지지 않고 일정한 구간을 유지합니다.
    // 반대로 1 이상 값을 rFriction으로 주면, 가속도가 붙어 점점 크게 퍼져나갑니다.
    // rFriction을 1이하에서 1이상 사이 랜덤값으로 주면 보다 자연스럽습니다.
    // 그럼 어떤 파티클은 1이하 값 때문에 일정 프레임 이후 멈추게되고,
    // 어떤 다른 파티클은 1이상 값 때문에 일정 프레임 이후 화면 밖으로 사라져 버리게 됩니다.
    this.rFriction = randomNumBetween(0.95, 1.01);
    this.rAlpha = randomNumBetween(0, 5);

    this.r = innerHeight / 4; // 위치시키고 싶은 r 값을 임의로 설정합니다.

    // angle에 마찰을 1 이하로 주면(rFriction은 잠시 꺼두고),
    // 처음에는 위로 향하는 힘과 오른쪽으로 향하는 힘이 동시에 작용해서 대각선으로 이동하다가,
    // angleFriction이 1 이하 값이다 보니, 계속 곱해지다 보면 어느 순간 오른쪽으로 향하는 힘이 0에 수렴하게 되어
    // 위로 향하는 rAlpha 값만 남게 되어 중심 바깥으로만 뻗어나가게 됩니다.
    // 반대로 angleFricton 값을 1 이상 주면,
    // 점점 엄청난 속도로 최전을 하게 됩니다.

    // rFriction은 1이하1이상을 랜덤하게 부여하고, angleFriction은 1이하로주면,
    // 일정하게 대각선으로 움직이다가 멈추게 됩니다.
    this.angleFriction = randomNumBetween(0.97, 0.99);
    this.angleAlpha = randomNumBetween(1, 2);
    this.angle = randomNumBetween(0, 360);
    // Math.cos, sin 안에는 라디안 값이 들어가야 합니다.
    // this.x = innerWidth / 2 + this.r * Math.cos((Math.PI / 180) * this.angle);
    // this.y = innerHeight / 2 + this.r * Math.sin((Math.PI / 180) * this.angle);

    this.opacity = randomNumBetween(0.2, 1);
  }
  update() {
    // r에 값을 더하면 파티클이 중심에서 퍼져나갑니다.
    // angle에 값을 더하면, 파티클이 수직으로 힘을 받습니다.
    // this.r += 1;
    // this.angle += 1;
    this.rAlpha *= this.rFriction; // rAlpha를 더해주기 전에 마찰을 먼저 적용해줍니다.
    this.r += this.rAlpha;
    this.angleAlpha *= this.angleFriction;
    this.angle += this.angleAlpha;

    // r을 계속 더해주는 작업이 반영되려면
    // 여기에 x,y를 선언해주면 됩니다.
    this.x = innerWidth / 2 + this.r * Math.cos((Math.PI / 180) * this.angle);
    this.y = innerHeight / 2 + this.r * Math.sin((Math.PI / 180) * this.angle);

    // 점점 투명도도 감소하게 만듭니다.
    this.opacity -= 0.003;
  }
  draw(ctx) {
    ctx.beginPath();
    // 파티클들을 자세히 보기 위해 크기를 1에서 높여가며 테스트하면 됩니다.
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
    ctx.closePath();
  }
}
