/* global window, c, img, pre, data, input */

c.width = img.width;
c.height = img.height;

const ctx = c.getContext('2d');

const noClicks = [input, pre];
let lastPath = [];
let lastPathString = '';
let lastNode = [];

const [x, y] = [0, 1];
const [
  backspaceKey,
  spaceKey,
  beginArrowKeys,
  endArrowKeys,
] = [
  8,
  32,
  37,
  40,
];


const draw = () => {
  ctx.clearRect(0, 0, c.width, c.height);

  const paths = Object.keys(data);
  pre.textContent = paths.join('\n');

  let lastNodeColor = '';

  paths.forEach((pathString, pathIndex) => {
    const path = data[pathString];
    const isLastPath = pathString === lastPathString;
    ctx.lineWidth = isLastPath ? 4 : 1;
    const color = `hsla(${(pathIndex / paths.length) * 360}, 80%, 50%, ${isLastPath ? 0.3 : 0.8})`;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    let [avgX, avgY] = [0, 0];
    let [minX, minY] = [Infinity, Infinity];
    let [maxX, maxY] = [-Infinity, -Infinity];

    ctx.beginPath();
    data[pathString].forEach((node, coordIndex) => {
      const [px, py] = node;

      ctx[`${coordIndex === 0 ? 'move' : 'line'}To`](px, py);
      avgX += px / path.length;
      avgY += py / path.length;

      if(lastNode === node) {
        lastNodeColor = color;
      }

      minX = Math.min(minX, px);
      minY = Math.min(minY, py);
      maxX = Math.max(maxX, px);
      maxY = Math.max(maxY, py);
    });

    ctx.closePath();
    ctx.stroke();

    ctx.font = `${Math.sqrt((maxX - minX) * (maxY - minY)) / 10}px monospace`;

    ctx.fillText(pathString, avgX - (ctx.measureText(pathString).width / 2), avgY);
  });

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(data));
};
draw();

window.onclick = (e) => {
  if (noClicks.includes(e.target)) {
    return;
  }

  if (!data[input.value]) {
    data[input.value] = [];
  }

  lastPathString = input.value;
  lastPath = data[input.value];
  lastNode = [
    e.clientX,
    e.clientY,
  ];
  data[input.value].push(lastNode);

  draw();
};
const speed = 1;
const movements = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];
window.onkeydown = (e) => {
  if (noClicks.includes(e.target)) {
    return;
  }

  if (e.keyCode === backspaceKey) {
    lastPath.pop();

    if (lastPath.length === 0) {
      delete data[lastPathString];
    }

    draw();
  }
  console.log(e.keyCode, spaceKey);
  if (e.keyCode === spaceKey) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(data));
  }

  // if arrows, move last point on path
  if (e.keyCode >= beginArrowKeys && e.keyCode <= endArrowKeys) {
    const [vx, vy] = movements[e.keyCode - 37];
    lastNode[x] += vx * speed;
    lastNode[y] += vy * speed;

    draw();
  }
};
