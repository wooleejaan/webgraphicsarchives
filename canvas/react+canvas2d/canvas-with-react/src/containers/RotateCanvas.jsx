import { useEffect, useRef, useState } from "react";
import {
  Engine,
  Render,
  Runner,
  Mouse,
  MouseConstraint,
  Composite,
  Bodies,
  Events,
} from "matter-js";
// cdn으로 쓰는 것과 달리 npm으로 패키지 설치해서 쓰면 에디터에서 자동완성 기능을 쓸 수 있어서 좋음.

import "../style/containers/RotateCanvas.css";

import IconAFRAME from "../assets/icon_AFRAME.png";
import IconCSS from "../assets/icon_CSS.png";
import IconHTML from "../assets/icon_HTML.png";
import IconJS from "../assets/icon_JS.png";
import IconREACT from "../assets/icon_REACT.png";
import IconTHREE from "../assets/icon_THREE.png";

const data = {
  JS: {
    title: "Javascript",
    level: 4,
    desc: "자바스크립트에 대한 설명이라고 할 수 있습니다. 자바스크립트에 대한 설명. 자바스크립트에 대한 설명.",
  },
  REACT: {
    title: "React.js",
    level: 5,
    desc: "React에 대한 설명이라고 할 수 있습니다. React에 대한 설명. React에 대한 설명.",
  },
  CSS: {
    title: "CSS/SASS",
    level: 3,
    desc: "CSS에 대한 설명이라고 할 수 있습니다. CSS에 대한 설명. CSS에 대한 설명.",
  },
  AFRAME: {
    title: "Aframe.js",
    level: 4,
    desc: "AFRAME에 대한 설명이라고 할 수 있습니다. AFRAME에 대한 설명. AFRAME에 대한 설명.",
  },
  THREE: {
    title: "Three.js",
    level: 2,
    desc: "THREE에 대한 설명이라고 할 수 있습니다. THREE에 대한 설명. THREE에 대한 설명.",
  },
  HTML: {
    title: "HTML",
    level: 5,
    desc: "HTML에 대한 설명이라고 할 수 있습니다. HTML에 대한 설명. HTML에 대한 설명.",
  },
};

const RotateCanvas = () => {
  // 클릭 시 state로 관리해서 data 변경.
  const [selected, setSelected] = useState(data["JS"]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cw = 1000;
    const ch = 1000;

    // 중력 처리.
    const garvityPower = 0.5;
    let gravityDeg = 0;

    let engine, render, runner, mouse, mouseConstraint;

    let observer;

    initScene();
    initMouse();
    initIntersectionObserver();
    initGround();
    initImageBoxes();

    // Events로 이벤트를 등록할 수 있다.
    Events.on(mouseConstraint, "mousedown", () => {
      const newSelected =
        mouseConstraint.body && data[mouseConstraint.body.label];
      newSelected && setSelected(newSelected);
    });

    Events.on(runner, "tick", () => {
      // 매프레임마다 실행하기 위해 runner, 'tick'에서 실행.ㄴ
      // 매프레임마다 중력을 증가시켜준다.
      gravityDeg += 1;
      // 단위가 Degree가 아니라 라디안이므로 단순히 `gravityDeg`가 아니라 `(Math.PI / 180) * gravityDeg`
      engine.world.gravity.x =
        garvityPower * Math.cos((Math.PI / 180) * gravityDeg);
      // x는 cos, y는 sin이므로.
      engine.world.gravity.y =
        garvityPower * Math.sin((Math.PI / 180) * gravityDeg);
    });

    function initScene() {
      // Engine을 가져와서 create을 하는 것부터 시작. 인자로 옵션들을 넣어줄 수도 있다.
      // Render도 마찬가지로 create으로 시작한다. (Render는 옵션값이 필수다)
      // Render의 경우 Engine에서 계산된 결과를 그려주는 역할을 하므로.
      engine = Engine.create();
      render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
          width: cw,
          height: ch,
          wireframes: false,
          background: "#1b1b19",
        },
      });
      // Runner를 사용해서 실시간으로 그려지도록 한다.
      runner = Runner.create();

      // Render와 Runner를 각각 순서대로 run해준다.
      Render.run(render);
      Runner.run(runner, engine);
    }
    function initMouse() {
      // Mouse와 MouseConstraint를 사용해 position을 얻고 Body들과 상호작용할 수 있다.
      mouse = Mouse.create(canvas);
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
      });
      // Composite을 사용해서 마우스도 엔진월드에 추가한다.
      Composite.add(engine.world, mouseConstraint);

      // 마우스 휠 이벤트가 겹치면 문제가 될 수 있으므로 중지시켜준다.
      canvas.removeEventListener("mousewheel", mouse.mousewheel);
      canvas.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    }
    function initIntersectionObserver() {
      const options = {
        threshold: 0.1,
      };
      observer = new IntersectionObserver((entries) => {
        const canvasEntry = entries[0];
        if (canvasEntry.isIntersecting) {
          // 보일떄만 재생하고,
          runner.enabled = true;
          Render.run(render);
        } else {
          // 안 보일 때는 멈춰준다.
          runner.enabled = false;
          Render.stop(render);
        }
      }, options);

      observer.observe(canvas);
    }
    function initGround() {
      // Ground는 직접 만들어줘야 한다.
      // Body는 현실세계로 치면, 안에 아무것도 넣을 수 없는 속이 꽉찬 골프공 같은 거임.
      // 그래서 수학공식을 써서 직접 만들어 줄 예정.
      const segments = 32; // 32각형을 그리면, 매끈해져서 원 형태처럼 보인다.
      // 예를 들어 segments=6인 육각형이면 deg가 0도,60도,120도,180도,240도,300도,360도 ...
      const deg = (Math.PI * 2) / segments; // degree
      const width = 50;
      const radius = cw / 2 + width / 2; // 캔버스 중심으로 얼만큼 떨어트려서 배치할지
      const height = radius * Math.tan(deg / 2) * 2;

      for (let i = 0; i < segments; i++) {
        // n각형(segments각형)의 좌표를 찍기 위해 for문을 순회.
        const theta = deg * i; // 세타값이 0도,60도,120도,180도,240도,300도,360도 ...
        // 윈 위의 좌표(y,x)를 cos,sin으로 구한다.
        const x = radius * Math.cos(theta) + cw / 2;
        const y = radius * Math.sin(theta) + ch / 2;
        // 중력에 영향을 받지 않도록 하기 위해 isStatic: true
        addRect(x, y, width, height, { isStatic: true, angle: theta });
      }
    }
    function initImageBoxes() {
      const scale = 0.7;
      const t1 = { w: 250 * scale, h: 250 * scale };
      const t2 = { w: 732 * scale, h: 144 * scale };
      // 중간에 그리기 위해 (cw/2, ch,2)로 x,y좌표 설정.
      // 시작하는 x,y좌표를 다르게 해서 다른 위치에서 생성될 수 있게 한다.
      // 시작위치 t1,t2를 기준으로 옮겨서 다른 위치에서 생성될 수 있게.
      addRect(cw / 2, ch / 2, t1.w, t1.h, {
        label: "JS",
        chamfer: { radius: 20 },
        render: { sprite: { texture: IconJS, xScale: scale, yScale: scale } },
      });
      addRect(cw / 2 - t1.w, ch / 2, t1.w, t1.h, {
        label: "CSS",
        chamfer: { radius: 20 },
        render: { sprite: { texture: IconCSS, xScale: scale, yScale: scale } },
      });
      addRect(cw / 2 + t1.w, ch / 2, t1.w, t1.h, {
        label: "HTML",
        chamfer: { radius: 20 },
        render: { sprite: { texture: IconHTML, xScale: scale, yScale: scale } },
      });
      addRect(cw / 2, ch / 2 + t1.h, t1.w, t1.h, {
        label: "THREE",
        chamfer: { radius: 20 },
        render: {
          sprite: { texture: IconTHREE, xScale: scale, yScale: scale },
        },
      });
      addRect(cw / 2 - t1.w, ch / 2 + t1.h, t1.w, t1.h, {
        label: "REACT",
        chamfer: { radius: 75 },
        render: {
          sprite: { texture: IconREACT, xScale: scale, yScale: scale },
        },
      });
      addRect(cw / 2, ch / 2 - t2.h, t2.w, t2.h, {
        label: "AFRAME",
        chamfer: { radius: 20 },
        render: {
          sprite: { texture: IconAFRAME, xScale: scale, yScale: scale },
        },
      });
    }
    // 사각형을 만들고 엔진 월드에 추가해주는 기능을 하는 함수.
    function addRect(x, y, w, h, options = {}) {
      // Bodies에서 다양한 형태를 그릴 수 있다.
      // options로 다양한 옵션을 넣어서 형태의 움직임을 구체화할 수 있다.
      const rect = Bodies.rectangle(x, y, w, h, options);
      // Composite로 엔진 월드에 추가할 수 있다.
      Composite.add(engine.world, rect);
    }

    // 요소 언마운트 시 관련된 것들 전부 클린업.
    return () => {
      observer.unobserve(canvas);

      Composite.clear(engine.world);
      Mouse.clearSourceEvents(mouse);
      Runner.stop(runner);
      Render.stop(render);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div className="rotate-canvas-wrapper">
      <canvas ref={canvasRef}></canvas>
      <aside>
        <h1>{selected.title}</h1>
        <h2>
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <span
                key={i}
                style={{ filter: `grayscale(${selected.level <= i ? 1 : 0})` }}
              >
                &#11088;
              </span>
            ))}
        </h2>
        <p>{selected.desc}</p>
      </aside>
    </div>
  );
};

export default RotateCanvas;
