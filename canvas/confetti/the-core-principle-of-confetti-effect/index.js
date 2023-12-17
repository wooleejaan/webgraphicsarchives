const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio > 1 ? 2 : 1;
let canvasWidth = innerWidth;
let canvasHeight = innerHeight;
const interval = 1000 / 60;

function init() {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;
  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";
  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  ctx.scale(dpr, dpr);
}

function render() {
  let now, delta;
  let then = Date.now();

  // rect의 x,y,width,height를 상수로 분리합니다.
  const x = innerWidth / 2;
  let y = innerHeight / 2;
  let widthAlpha = 0;
  const width = 50;
  const height = 50;
  let deg = 0.1;

  const frame = () => {
    requestAnimationFrame(frame);
    now = Date.now();
    delta = now - then;
    if (delta < interval) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 프레임마다 Rect를 지워줍니다.

    // 프레임 안에서 widthAlpha를 0.1씩 더해줍니다.
    widthAlpha += 0.1;
    deg += 0.1; // degree도 매 프레임마다 0.1씩 더해줍니다.
    y += 1; // y를 상수가 아니라 변수로 두고, 1씩 더해주면 confetti가 완성됩니다.

    // ctx.rotate를 사용하면, 캔버스 전체를 회전시킵니다.
    // 회전할 때 기본 축은 (0,0)입니다.
    // 우리가 원하는 건 전체 캔버스가 (0,0)을 기준으로 회전하는 게 아니라
    // 도형의 축을 중심으로 회전하는 걸 원합니다. => canvas의 translate 속성을 사용하면 됩니다.
    // x,y가 아니라 x+width, y+height로 하면 보다 중심에 가깝게 움직입니다.
    ctx.translate(x + width, y + height);
    ctx.rotate(deg);
    // 매 프레임마다 translate, rotate 시킨 값이 중첩되면서 계속 커지므로
    // 이동시켰던 캔버스 중심 축을 다시 원복시켜야 합니다.
    ctx.translate(-x - width, -y - height);

    ctx.fillStyle = "red";
    // arc의 경우 x,y를 중심으로 반지름 원을 그리지만,
    // fillRect는 x,y가 아니라 width,height을 시작으로 사각형을 그리기 때문에
    // 캔버스 중심에서 살짝 오른쪽으로 치우치기 마련입니다.

    // Math.cos,sin를 사용해 종이 움직임을 만들어볼 것입니다.
    // Math.cos(widthAlpha)를 width에 곱해주면 1에서 -1 값을 계속해서 반복하게 되므로
    // width가 -width ~ width 사이를 반복하게 됩니다.
    // 팔랑거리는 움직임을 구현할 수 있습니다.
    // height에도 곱해주게 되면 4방향으로 팔랑거리며 움직입니다. (정확히는 원의 움직임을 만들어내며.)

    ctx.fillRect(
      x,
      y,
      width * Math.cos(widthAlpha),
      height * Math.sin(widthAlpha)
    );

    // 위에서 원복 작업을 해주는 translate과 달리, ctx.rotate의 경우 계속 누적되는 문제가 있으므로 이렇게 reset을 해줘야 합니다.
    ctx.resetTransform();

    then = now - (delta % interval);
  };
  requestAnimationFrame(frame);
}

window.addEventListener("resize", init);
window.addEventListener("load", () => {
  init();
  render();
});
