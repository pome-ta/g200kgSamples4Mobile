'use strict';

/* util funcs */
function capitalize(str) {
  if (typeof str !== 'string' || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getDecimalPointLength(valueStr) {
  const numbers = valueStr.split('.');
  const pointLen = numbers[1] ? numbers[1].length : 0;
  // xxx: 0 で、返したものを1 で返してる
  return pointLen ? pointLen : 1;
}

function parseNum(value, numtype = 'float') {
  return numtype === 'int'
    ? Number.parseInt(value)
    : Number.parseFloat(value).toFixed(getDecimalPointLength(value));
}

/* create document node element funcs */
function createButton(idName, textContent = null) {
  const element = document.createElement('button');
  element.style.width = '100%';
  element.style.height = '4rem';
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
  element.style.minWidth = '3.2rem';
  //element.style.width = '3.2rem';
  element.textContent = textContent != null ? textContent : capitalize(id);
  return element;
}

function createInputRange({ id, min, max, value, numtype, step = 1 }) {
  const element = document.createElement('input');
  element.type = 'range';
  element.id = id;
  element.min = min;
  element.max = max;
  element.step = step;
  element.value = value;
  element.numtype = numtype;
  element.style.width = '100%';
  return element;
}

function createCheckbox({ id }) {
  const element = document.createElement('input');
  element.type = 'checkbox';
  element.id = id;
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
  const checkboxObj = 'checkboxObj';
  const inputObj = 'inputObj';
  const pObj = 'pObj';

  const controllerObjs = {};
  for (const obj of objArray) {
    const selectElement = Object.keys(obj).some((key) => key === selectObj)
      ? createSelectOpiton(obj[selectObj], typeStr)
      : null;

    const checkboxElement = Object.keys(obj).some((key) => key === checkboxObj)
      ? createCheckbox(obj[checkboxObj])
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
      checkboxElement,
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
  element.style.fontSize = '0.64rem';
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

function setCanvasStyles(...args) {
  args.forEach(canvasElement => {
    canvasElement.style.width = '100%';
    canvasElement.style.position = 'absolute';
    canvasElement.style.top = 0;
    canvasElement.style.left = 0;
  });
  
}

/* setup document node element */
const mainTitleHeader = document.createElement('h2');
mainTitleHeader.textContent = 'DynamicsCompressor Test';

const buttonDiv = document.createElement('div');
buttonDiv.style.width = '100%';
const playButton = createButton('play');

/* create controller objs */

const threshObj = {
  objName: 'Threshold',
  inputObj: {
    id: 'threshRange',
    min: -100,
    max: 0.0,
    step: 0.1,
    value: -24.0,
    numtype: 'float',
  },
  pObj: {
    id: 'threshval',
    label: '',
  },
};

const kneeObj = {
  objName: 'Knee',
  inputObj: {
    id: 'kneeRange',
    min: 0.0,
    max: 40.0,
    step: 0.1,
    value: 30.0,
    numtype: 'float',
  },
  pObj: {
    id: 'kneeval',
    label: '',
  },
};

const ratioObj = {
  objName: 'Ratio',
  inputObj: {
    id: 'ratioRange',
    min: 1.0,
    max: 20.0,
    step: 0.1,
    value: 12.0,
    numtype: 'float',
  },
  pObj: {
    id: 'ratioval',
    label: '',
  },
};

const atkObj = {
  objName: 'Attack',
  inputObj: {
    id: 'atkRange',
    min: 0.0,
    max: 0.1,
    step: 0.001,
    value: 0.003,
    numtype: 'float',
  },
  pObj: {
    id: 'atkval',
    label: '',
  },
};

const relObj = {
  objName: 'Release',
  inputObj: {
    id: 'relRange',
    min: 0.0,
    max: 1.0,
    step: 0.01,
    value: 0.25,
    numtype: 'float',
  },
  pObj: {
    id: 'relval',
    label: '',
  },
};

const controllerObjs = createControllerObjs([
  threshObj,
  kneeObj,
  ratioObj,
  atkObj,
  relObj,
]);

const [
  [threshRange, threshval],
  [kneeRange, kneeval],
  [ratioRange, ratioval],
  [atkRange, atkval],
  [relRange, relval],
] = Object.entries(controllerObjs).map(([key, val]) => val);

const controllerTable = createControllerTable(controllerObjs);

const cnvsDiv = document.createElement('div');
cnvsDiv.style.width = '100%';
cnvsDiv.style.position = 'relative'

const baseCanvas = document.createElement('canvas');
const canvas = document.createElement('canvas');
setCanvasStyles(baseCanvas, canvas);

/* appendChild document element */
setAppendChild([
  mainTitleHeader,
  buttonDiv,
  [playButton],
  controllerTable,
  cnvsDiv,
  [baseCanvas, canvas],
]);

/* canvas */
let WIDTH, HEIGHT, halfHEIGHT;
const setting_height = 0.75; // 4:3
//const setting_height = 0.5;

const ctx = canvas.getContext('2d');

function initCanvas() {
  //canvas.width = cnvsDiv.clientWidth;
  //canvas.height = cnvsDiv.clientWidth * setting_height;
  canvas.width = cnvsDiv.width = 364;
  canvas.height = cnvsDiv.height = 364;
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  halfHEIGHT = HEIGHT / 2;
}

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

const gaintable = new Array(100);
for (let i = 0; i < 100; i++) {
  gaintable[i] = 0;
}

const sig = new OscillatorNode(audioctx);
const gain = new GainNode(audioctx, { gain: 0 });
const comp = new DynamicsCompressorNode(audioctx);
const ana = new AnalyserNode(audioctx);
const wavdata = new Float32Array(512);

let timer;
let testcount = 0;
let currentOutLevel = 0;
let testing = 0;
let maxlev = 0;
sig.connect(gain).connect(comp).connect(ana).connect(audioctx.destination);
sig.start();

playButton.addEventListener(touchBegan, () => {
  audioctx.state === 'suspended' ? audioctx.resume() : null;
  testing = 1;
  gain.gain.value = 0;
  testcount = -2;
  maxlev = 0;
  timer = setInterval(TestInterval, 50);
});

threshRange.addEventListener('input', Setup);
kneeRange.addEventListener('input', Setup);
ratioRange.addEventListener('input', Setup);
atkRange.addEventListener('input', Setup);
relRange.addEventListener('input', Setup);

function Setup() {
  comp.threshold.value = threshRange.value;
  comp.knee.value = kneeRange.value;
  comp.ratio.value = ratioRange.value;
  comp.attack.value = atkRange.value;
  comp.release.value = relRange.value;

  threshval.textContent = parseNum(threshRange.value, threshRange.numtype);
  kneeval.textContent = parseNum(kneeRange.value, kneeRange.numtype);
  ratioval.textContent = parseNum(ratioRange.value, ratioRange.numtype);
  atkval.textContent = parseNum(atkRange.value, atkRange.numtype);
  relval.textContent = parseNum(relRange.value, relRange.numtype);
}

function TestInterval() {
  if (testcount > 0) {
    ana.getFloatTimeDomainData(wavdata);
    for (let i = 0; i < wavdata.length; ++i) {
      const d = Math.abs(wavdata[i]);
      if (d > maxlev) maxlev = d;
    }
    gaintable[testcount - 1] = maxlev;
  }
  maxlev = 0;
  Draw(testcount - 1);
  gain.gain.value = Math.pow(10, (testcount - 80) / 20);
  if (++testcount > 100) {
    gain.gain.value = 0;
    clearInterval(timer);
    testing = 0;
  }
}

function Draw(n) {
  ctx.fillStyle = '#404040';
  ctx.fillRect(0, 0, 364, 364);
  ctx.fillStyle = '#20c040';
  
  for (let i = 0; i < 100; ++i) {
    let v = gaintable[i];
    if (v < 1e-128) v = 1e-128;
    v = Math.max(-80, Math.LOG10E * 20 * Math.log(v));
    v = (20 - v) * 3;
    ctx.fillRect(i * 3 + 32, v + 32, 3, 300 - v);
  }
  ctx.fillStyle = '#c06060';
  for (let i = 0; i <= 100; i += 10) {
    ctx.fillRect(32, 32 + i * 3, 300, 1);
    ctx.fillRect(32 + i * 3, 32, 1, 300);
    ctx.fillText(20 - i + 'dB', 5, i * 3 + 35);
    ctx.fillText(20 - i + 'dB', 320 - i * 3, 345);
  }
  ctx.fillStyle = '#f0e480';
  ctx.fillRect(34 + n * 3, 32, 1, 300);
}

// xxx: resize 呼ぶと描画しない
//window.addEventListener('resize', initCanvas);
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  //DrawGraph();
  Draw();
  Setup();
});

