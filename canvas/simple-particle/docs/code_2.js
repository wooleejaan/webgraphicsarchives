const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;

const canvasWidth = 300;
const canvasHeight = 300;

canvas.style.width = canvasWidth + "px";
canvas.style.height = canvasHeight + "px";

canvas.width = canvasWidth * dpr;
canvas.height = canvasHeight * dpr;
ctx.scale(dpr, dpr);

// ctx.fillRect(10, 10, 50, 50);

// 원을 그릴 때는 arc 메서드를 사용합니다.
// fillRect와는 그리는 방식이 다르다.

ctx.beginPath(); // path를 그린다고 알려줘야 합니다.
// arc(시작x위치, 시작y위치, 반지름길이, 시작각도, 끝나는각도, 시계방향or반시계방향 여부)
// 이 메서드에서 각도 단위의 경우, degree가 아니라 Radin을 사용하므로 단순히 360이라고 작성하면 안 됩니다.
// 각도 1도는 PI(3.14)를 180으로 나눈 값과 같습니다.
// 0~360도까지 그려서 원을 그립니다.
// 방향의 기본값은 false입니다. 시계방향입니다.
ctx.arc(100, 100, 50, 0, (Math.PI / 180) * 360);
ctx.fillStyle = "red"; // fill 전에 사용해서 칠할 색상을 선택합니다.
ctx.fill(); // fill 메서드를 사용해 내부에 색상을 칠합니다.
// ctx.stroke(); // 단순히 stroke를 사용하면 원 모양의 선을 그립니다. fill을 사용할지 stroke를 사용할지 선택합니다.
ctx.closePath(); // 원 그리기를 끝냅니다.
