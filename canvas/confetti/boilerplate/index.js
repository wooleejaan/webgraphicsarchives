const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio > 1 ? 2 : 1; // 성능 이슈를 방지하기 위해, 최대 dpr을 2로 설정합니다.
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
  // 사이즈를 무턱대고 dpr만큼 확대했을 때,
  // dpr이 3 또는 4인 기기에서는 성능 이슈가 발생할 수 있습니다.
  // dpr이 2만 되어도 선명함 정도는 충분함.
  ctx.scale(dpr, dpr);
}

function render() {
  let now, delta;
  let then = Date.now();

  const frame = () => {
    // 144hz 게이밍 모니터에서는 1초에 144번 프레임 함수가 실행
    // 60hz 사무형 모니터에서는 1초에 60번 프레임 함수가 실행
    requestAnimationFrame(frame);
    // 모니터마다 동일한 프레임 실행 횟수를 60번으로 맞추기 위한 작업
    // interval을 1000 / 60으로 맞춰놨으니까 1000ms를 60으로 균등하게 나눈 값보다 작을 때는 실행되지 않고, 클 때만 실행해버리고 then을 초기화하고 ... 반복
    now = Date.now();
    delta = now - then;
    if (delta < interval) return;

    ctx.fillStyle = "red";
    ctx.fillRect(200, 200, 50, 50);

    then = now - (delta % interval);
  };
  requestAnimationFrame(frame);
}

window.addEventListener("resize", init);
window.addEventListener("load", () => {
  init();
  render();
});
