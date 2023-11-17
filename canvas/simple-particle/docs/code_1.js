const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); // 2d 그림을 그릴 수 있는 도구입니다.

const canvasWidth = 300;
const canvasHeight = 300;
const dpr = window.devicePixelRatio; // 현재 내 컴퓨터의 dpr (mac은 2입니다.)

// 캔버스의 사이즈를 다루는 방식 2가지 (둘 다 사용해야 합니다.)
// 1. css 값으로 canvas 수정
// 2. canvas의 width, height
canvas.style.width = canvasWidth + "px";
canvas.style.height = canvasHeight + "px"; // canvas의 기본 width, height는 300, 150인데 여기서 강제로 높이를 2배 늘렸기 때문에 내부에 그린 사각형은 직사각형이 됩니다.

// 아래와 같이 캔버스 자체의 w, h도 맞춰줘야 합니다.
// 예를 들어 css를 300*300으로 맞추고 캔버스 크기를 100*100으로 맞추면,
// 300*300에 맞추기 위해 캔버스가 확대됩니다. 그러므로 캔버스의 픽셀이 깨집니다.
// 그래서 보통 css와 canvas 자체의 w,h를 맞춰서 작업해줘야 합니다.
canvas.width = canvasWidth * dpr;
canvas.height = canvasHeight * dpr;
// dpr이 2 이상인 환경에서 코드를 작성하는 경우 이렇게 설정하면 좀 더 선명하게 볼 수 있습니다.
ctx.scale(dpr, dpr);

ctx.fillRect(10, 10, 50, 50); // 사각형을 그립니다.
