'use strict';

/* util funcs */
function capitalize(str) {
  if (typeof str !== 'string' || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function parseNum(value, numtype = 'float') {
  return numtype === 'int'
    ? Number.parseInt(value)
    : Number.parseFloat(value).toFixed(1);
}

/* create document node element funcs */
function createButton(idName, textContent = null) {
  const element = document.createElement('button');
  element.style.width = '50%';
  element.style.height = '3rem';
  element.type = 'button';
  element.id = idName;
  element.textContent = textContent ? textContent : capitalize(idName);
  return element;
}

function createLabel(pObj, textContent = null) {
  const { id } = pObj;
  const element = document.createElement('p');
  element.id = id;
  element.style.margin = '0';
  element.style.minWidth = '3rem';
  element.textContent = textContent != null ? textContent : capitalize(id);
  return element;
}

function createInputRange(rangeObj) {
  const { id, min, max, value, numtype, step = '' } = rangeObj;
  const element = document.createElement('input');
  element.type = 'range';
  element.id = id;
  element.min = min;
  element.max = max;
  element.value = value;
  element.numtype = numtype;
  element.step = step;
  element.style.width = '100%';
  return element;
}

function createSelectOpiton(selectObj, typestr) {
  const { id } = selectObj;
  const element = document.createElement('select');
  element.id = id;
  for (const type of typestr) {
    const option = document.createElement('option');
    option.value = type.toLowerCase();
    option.text = type; //capitalize(type);
    element.appendChild(option);
  }
  return element;
}

function createControllerObjs(objArray) {
  const selectObj = 'selectObj';
  const inputObj = 'inputObj';
  const pObj = 'pObj';

  const controllerObjs = {};
  for (const obj of objArray) {
    const selectElement = Object.keys(obj).some((key) => key === selectObj)
      ? createSelectOpiton(obj[selectObj], typeStr)
      : null;

    const inputElement = Object.keys(obj).some((key) => key === inputObj)
      ? createInputRange(obj[inputObj])
      : null;

    const _label = inputElement
      ? parseNum(inputElement.value, inputElement.numtype)
      : null;
    const pElement = Object.keys(obj).some((key) => key === pObj)
      ? createLabel(obj[pObj], _label)
      : null;

    controllerObjs[obj['objName']] = [
      selectElement,
      inputElement,
      pElement,
    ].filter((ele) => ele);
  }
  return controllerObjs;
}

function createTableHeader(textContent) {
  const element = document.createElement('th');
  element.textContent = textContent;
  element.style.whiteSpace = 'nowrap';
  element.style.width = '0%';
  element.style.fontSize = '0.5rem';
  return element;
}

function createTableData(child) {
  const element = document.createElement('td');
  element.style.width = child.nodeName === 'SELECT' ? '0%' : '100%';
  element.appendChild(child);
  return element;
}

function createControllerTable(controllers) {
  const tblBody = document.createElement('tbody');
  for (const key of Object.keys(controllers)) {
    const th = createTableHeader(key);
    const tr = document.createElement('tr');
    tr.appendChild(th);
    for (const value of controllers[key]) {
      const td = createTableData(value);
      tr.appendChild(td);
    }
    tblBody.appendChild(tr);
  }
  const tbl = document.createElement('table');
  tbl.style.width = '100%';
  tbl.appendChild(tblBody);
  return tbl;
}

function setAppendChild(nodes, parentNode = document.body) {
  let preNode = parentNode;
  nodes.forEach((node) => {
    Array.isArray(node)
      ? setAppendChild(node, preNode)
      : parentNode.appendChild(node);
    preNode = node;
  });
}

/* setup document node element */
const mainTitleHeader = document.createElement('h2');
mainTitleHeader.textContent = 'Analyser';

const buttonDiv = document.createElement('div');
buttonDiv.style.width = '100%';
const playButton = createButton('play');
const stopButton = createButton('stop');

/* create controller objs */
// xxx: 辞書にする？
const typeStr = ['Frequency', 'TimeDomain'];

const modeTypeObj = {
  selectObj: {
    id: 'mode',
  },
  objName: 'Frequency/TimeDomain',
};

const smoothingObj = {
  inputObj: {
    id: 'smoothing',
    min: 0,
    max: 1,
    step: 0.01,
    value: 0.9,
    numtype: 'float',
  },
  pObj: {
    id: 'smoothingval',
    label: '',
  },
  objName: 'SmoothingTimeConstant',
};

const controllerObjs = createControllerObjs([modeTypeObj, smoothingObj]);

const [[modeType], [smoothing, smoothingval]] = Object.entries(
  controllerObjs
).map(([key, val]) => val);

const controllerTable = createControllerTable(controllerObjs);

const cnvsDiv = document.createElement('div');
cnvsDiv.style.width = '100%';

const canvas = document.createElement('canvas');
canvas.style.width = '100%';

/* appendChild document element */
setAppendChild([
  mainTitleHeader,
  buttonDiv,
  [playButton, stopButton],
  controllerTable,
  cnvsDiv,
  [canvas],
]);

/* canvas */
const canvasctx = canvas.getContext('2d');
const gradbase = canvasctx.createLinearGradient(0, 0, 0, 256);

let WIDTH, HEIGHT;
const setting_height = 0.75; // 4:3
//const setting_height = 0.5;
const colorBG = '#000000';
const colorWave = '#009900';
const colorLine = '#ff8844';

function initCanvas() {
  canvas.width = cnvsDiv.clientWidth;
  canvas.height = cnvsDiv.clientWidth * setting_height;
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
}
/*
function DrawGraph() {
  analyser.getFloatFrequencyData(analysedata);
  ctx.fillStyle = colorBG;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = colorWave;
  for (let i = 0; i < WIDTH; i++) {
    const y = HEIGHT / 2 + (analysedata[i] + 50.0) * (HEIGHT / 100);
    ctx.fillRect(i, HEIGHT - y, 1, y);
  }
  ctx.fillStyle = colorLine;
  for (let d = -50; d < 50; d += 10) {
    const y = (HEIGHT / 2 - (d * HEIGHT) / 100) | 0;
    ctx.fillRect(0, y, WIDTH, 0.5);
    ctx.fillText(`${d}db`, 0, y);
  }
  ctx.fillRect(20, HEIGHT / 2, WIDTH, 1);
  for (let f = 2000; f < audioctx.sampleRate / 2; f += 2000) {
    const x = ((f * 1024) / audioctx.sampleRate) | 0;
    ctx.fillRect(x, 0, 0.5, HEIGHT);
    ctx.fillText(`${f}Hz`, x, HEIGHT);
  }
  requestAnimationFrame(DrawGraph);
}
*/
// todo: MouseEvent TouchEvent wrapper
const { touchBegan, touchMoved, touchEnded } = {
  touchBegan:
    typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  touchMoved:
    typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  touchEnded:
    typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};

/* audio */
const audioctx = new AudioContext();
const soundPath = './sounds/loop.wav';
let soundbuf = null;
let mode = 0;
let src = null;

const analyser = new AnalyserNode(audioctx, { smoothingTimeConstant: 0.9 });

playButton.addEventListener(touchBegan, () => {
  audioctx.state === 'suspended' ? audioctx.resume() : null;
  if (src) {
    src = new AudioBufferSourceNode(audioctx, { buffer: soundbuf, loop: true });
    src.connect(analyser).connect(audioctx.destination);
    src.start();
  }
});

stopButton.addEventListener(touchBegan, () => {
  src ? src.stop() : null;
  src = null;
});

modeType.addEventListener('change', ({target: {selectedIndex}}) => {
  mode = selectedIndex;
});

smoothing.addEventListener('input', ({target: {value, numtype}}) => {
  smoothingval.textContent = parseNum(value, numtype);
  analyser.smoothingTimeConstant = value;
});

async function LoadSample(actx, url) {
  const res = await fetch(url);
  const arraybuf = await res.arrayBuffer();
  return actx.decodeAudioData(arraybuf);
}

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  //DrawGraph();
});

window.addEventListener('load', async () => {
  soundbuf = await LoadSample(audioctx, soundPath);
});

window.addEventListener('resize', initCanvas);

