import Canvas from "./Canvas.js";

const canvas = new Canvas();

window.addEventListener("load", () => {
  canvas.init();
  canvas.render();
});

// 사이즈 변경될 때마다 init만 재실행
window.addEventListener("resize", () => {
  canvas.init();
});
