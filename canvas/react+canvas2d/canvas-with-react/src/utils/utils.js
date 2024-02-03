export function getDistance(p1, p2) {
  // 두 점 사이의 거리를 먼저 구한다.
  // 왜냐면 두 점 사이의 거리를 구해서 그 사이에 원들을 채워넣어서 점을 찍는 게 아니라 선을 그리는 모션을 구현할 것이므로
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  return Math.sqrt(dx * dx + dy * dy);
}

export function getAngle(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  // 두 점 사이의 절대적인 각도 구하기.
  // 두 점 사이의 각도 구하는 게 Math.atan2로 사실상 공식화되어 있음.
  return Math.atan2(dy, dx);
}

export function getScrupedPercent(ctx, width, height) {
  const pixels = ctx.getImageData(0, 0, width, height);
  // 캔버스가 1000x1000픽셀이라고 가정하면, 100만개의 픽셀이 존재함
  // 100만개가 각각 4개(rgba) 값을 가지므로 data 배열의 길이가 400만개임.
  // 모두 돌면 성능 문제가 생기므로, 듬성듬성 search만 해줘도 충분하므로 gap을 조절해서 성능을 높일 수 있다.
  const gap = 32; // 4의 배수면 된다.
  const total = pixels.data.length / gap;
  let count = 0;

  // 이미지를 getImageData를 해올 때, rgba이므로 4개씩 들어감. 3개 불러오면 data안에 12개가 들억감.
  // rgb는 건너뛰고, 4번째가 a 투명도이므로,
  // 4번째마다 있는 투명도를 체크해서 그게 0이면 지워졌다고 판단할 수 있다.
  // count로 세면, 지워진 영역이 몇 퍼센트인지 확인할 수 있고, 이걸로 얼마나 지워졌는지 판단할 수 있다.
  for (let i = 0; i < pixels.data.length - 3; i += gap) {
    // 전체 길이에서 투명도만 체크할거라서, i+3만 체크하고, 전체길이-3까지만 순회하면 됨.
    if (pixels.data[i + 3] === 0) count++;
  }

  return Math.round((count / total) * 100);
}

// js로 이미지 그리는 방식 통일(css의 object-fit:cover 구현)
export function drawImageCenter(canvas, ctx, image) {
  const cw = canvas.width;
  const ch = canvas.height;

  const iw = image.width;
  const ih = image.height;

  const ir = ih / iw;
  const cr = ch / cw;

  let sx, sy, sw, sh;

  if (ir >= cr) {
    sw = iw;
    sh = sw * (ch / cw);
  } else {
    sh = ih;
    sw = sh * (cw / ch);
  }
  sx = iw / 2 - sw / 2;
  sy = ih / 2 - sh / 2;

  // 이미지를 object-fit:cover로 그리는 방법.
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, cw, ch);
}
