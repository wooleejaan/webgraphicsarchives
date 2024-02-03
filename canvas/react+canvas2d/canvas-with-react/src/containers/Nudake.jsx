import { useEffect, useRef } from "react";
import throttle from "lodash/throttle"; // lodash를 전부 가져오는 게 아니라 throttle까지만 import해와서 용량을 줄여야 한다.
import gsap from "gsap";
import "../style/containers/Nudake.css";

import image1 from "../assets/nudake-1.jpg";
import image2 from "../assets/nudake-2.jpg";
import image3 from "../assets/nudake-3.jpg";
import {
  drawImageCenter,
  getAngle,
  getDistance,
  getScrupedPercent,
} from "./../utils/utils";

const Nudake = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasParent = canvas.parentNode;
    const ctx = canvas.getContext("2d");

    // 이미지 배열
    const imageSrcs = [image1, image2, image3];
    const loadedImages = [];
    let currIndex = 0; // currentImageIndex. 이미지 배열을 계속 반복하며 보여줄 것이므로.
    let prevPos = { x: 0, y: 0 };
    let isChanging = false;

    let canvasWidth, canvasHeight;

    function resize() {
      // 캔버스 크기는 부모 크기만큼 잡히도록.
      canvasWidth = canvasParent.clientWidth;
      canvasHeight = canvasParent.clientHeight;
      // 캔버스의 크기는 2가지(캔버스 자체, style)
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      // 이번엔 dpr 필요 없다. 이미지만 요소 안에 알맞게 렌더링하면 되므로.

      // 이미지를 preload
      preloadImages().then(() => drawImage());
    }

    // 이미지 그릴 때마다 요청하는 게 아니라 미리 요청해서 네트워크 환경 느릴 때도 괜찮도록
    function preloadImages() {
      return new Promise((resolve, reject) => {
        let loaded = 0;
        imageSrcs.forEach((src) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            loaded += 1;
            loadedImages.push(img);
            if (loaded === imageSrcs.length) return resolve();
          };
        });
      });
    }

    // 이미지를 그린다.
    function drawImage() {
      isChanging = true; // gsap으로 이미지를 그리는 동안에는 Mousemove 이벤트 동작 제한하기 위해(사이드 이펙트 방지)
      const image = loadedImages[currIndex];
      // globalCompositeOperation
      // 처음 그릴 떄는 source-over가 찍히고 그다음부터는 destination~이 찍히므로
      // 이걸로 처음 그리는지 아닌지 판단.
      const firstDrawing = ctx.globalCompositeOperation === "source-over";

      // 이미지 그릴 때 opacity 애니메이션으로 자연스럽게 불러오도록.
      gsap.to(canvas, {
        opacity: 0,
        duration: firstDrawing ? 0 : 1, // 처음 그릴 때는 gsap을 쓸 필요 없으므로.
        onComplete: () => {
          canvas.style.opacity = 1;
          ctx.globalCompositeOperation = "source-over";
          // 이미지 그리는 걸 object-fit:cover로 통일.
          drawImageCenter(canvas, ctx, image);

          // 지웠을 때, 그 다음 이미지가 보여야 하므로
          // 부모 요소에 backgroundImage로 그 다음 index 이미지를 가져온다.
          // 이미지는 한정되어 있으므로 % 연산자로. 매번 반복하도록.
          const nextImage = imageSrcs[(currIndex + 1) % imageSrcs.length];
          canvasParent.style.backgroundImage = `url(${nextImage})`;
          prevPos = null;

          isChanging = false;
        },
      });
    }

    function onMousedown(e) {
      if (isChanging) return;
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("mouseleave", onMouseUp);
      canvas.addEventListener("mousemove", onMouseMove);
      // 마우스를 눌렀을 때 현재 값을 prevPos로 저장.
      prevPos = { x: e.offsetX, y: e.offsetY };
    }

    function onMouseUp() {
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
    }

    function onMouseMove(e) {
      if (isChanging) return;
      drawCircles(e);
      checkPercent();
    }

    function drawCircles(e) {
      const nextPos = { x: e.offsetX, y: e.offsetY };
      if (!prevPos) prevPos = nextPos;
      // 두 점 사이의 거리와 각도를 구한다.
      const dist = getDistance(prevPos, nextPos);
      const angle = getAngle(prevPos, nextPos);

      // 거리만큼 1씩 증가하면서 이전 점과 현재 점 사이를 원으로 빈틈없이 채워준다.
      for (let i = 0; i < dist; i++) {
        const x = prevPos.x + Math.cos(angle) * i;
        const y = prevPos.y + Math.sin(angle) * i;

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, canvasWidth / 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }

      prevPos = nextPos;
    }
    // 지워진 영역 비율 체크를 매번 하면 성능 이슈 발생함.
    // 매번 rgba로 이루어진 거대한 data 배열을 순회해야 하므로
    // 그래서 여기에 throttle 함수를 적용해줘야 함.
    // 개발자 도구의 performance monitor 보면 90% 대로 계속 유지됨. 매우 에바.
    const checkPercent = throttle(() => {
      const percent = getScrupedPercent(ctx, canvasWidth, canvasHeight);
      if (percent > 50) {
        currIndex = (currIndex + 1) % imageSrcs.length;
        drawImage();
      }
    }, 500);

    // react에서 requestAnimationFrame를 사용할 때, 주의점
    // 다른 페이지로 넘어가거나 다른 컴포넌트로 교체되면서, 해당 컴포넌트가 언마운트될 때
    // requestAnimationFrame은 재귀함수로 스스로 계속 실행하도록 뒀기 때문에
    // 알아서 중단이 안 되므로, 컴포넌트는 언마운트되어도 안에 있는 requestAnimationFrame은 계속 실행되는 문제가 발생함.
    // 이럴 때는 frameId = requestAnimationFrame(frame)로 선언하면 return으로 프레임id가 나오므로
    // 이 frameId를 cancelAnimationFrame(frameId)와 같이 react useEffect의 return 문에 넣어주면 된다.
    canvas.addEventListener("mousedown", onMousedown);
    window.addEventListener("resize", resize);
    resize();

    return () => {
      canvas.removeEventListener("mousedown", onMousedown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="nudake">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Nudake;
