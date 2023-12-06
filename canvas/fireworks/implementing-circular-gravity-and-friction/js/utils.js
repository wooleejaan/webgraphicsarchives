export const randomNumBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

// 작은 화면에서나 큰 화면에서나 원의 길이가 같으면 문제가 됩니다.
// 어떤 화면이든 비슷한 비율로 보려면?
// innerWidth 또는 innerHeight 하나만 기준으로 하면, 단순히 가로는 짧고 세로는 길면 문제가 된다든지 한다.
// 따라서, innerWidth와 innerHeight의 빗변의 길이를 피타고라스 정의를 통해 길이를 구하고,
// 해당 빗변의 길이를 토대로 반지름 r을 구하면 됩니다.
export const hypotenuse = (x, y) => {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};
