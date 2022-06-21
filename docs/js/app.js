'use strict';

/* util funcs */
function capitalize(str) {
  if (typeof str !== 'string' || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function parseNum(value, numtype = 'float') {
  return numtype === 'int'
    ? Number.parseInt(value)
    : Number.parseFloat(value).toFixed(2);
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
  element.style.minWidth = '2rem';
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
const canvas = document.createElement('canvas');
canvas.style.width = '100%';

/* appendChild document element */
setAppendChild([
  mainTitleHeader,
  buttonDiv,
  [playButton],
  controllerTable,
  cnvsDiv,
  [canvas],
]);

/* canvas */
let WIDTH, HEIGHT, halfHEIGHT;
const setting_height = 0.75; // 4:3
//const setting_height = 0.5;

const canvasctx = canvas.getContext('2d');

function initCanvas() {
  canvas.width = cnvsDiv.clientWidth;
  canvas.height = cnvsDiv.clientWidth * setting_height;
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

const soundPath = './sounds/loop.wav';
let buffer = null;

const shaper = new WaveShaperNode(audioctx);
const analyser = new AnalyserNode(audioctx);
let src = null;

shaper.connect(analyser).connect(audioctx.destination);

playButton.addEventListener(touchBegan, () => {
  audioctx.state === 'suspended' ? audioctx.resume() : null;
  if (!src) {
    src = new AudioBufferSourceNode(audioctx, { buffer: buffer, loop: true });
    src.connect(shaper);
    src.start();
  }
});

stepsRange.addEventListener('input', Setup);

async function LoadSample(actx, url) {
  const res = await fetch(url);
  const arraybuf = await res.arrayBuffer();
  return actx.decodeAudioData(arraybuf);
}

function Setup() {
  const steps = stepsRange.value;
  stepsval.textContent = parseNum(stepsRange.value, stepsRange.numtype);

  const curve = new Float32Array(4096); // Make Curve (length = steps)
  for (let i = 0; i < 4096; i++) {
    curve[i] = ((((i / 4096) * steps) | 0) / (steps - 1)) * 2 - 1;
  }
  shaper.curve = curve; // set curve to WaveShaper
}

document.addEventListener('DOMContentLoaded', () => {
  Setup();
  initCanvas();
  //DrawGraph();
});

document.addEventListener('DOMContentLoaded', async () => {
  buffer = await LoadSample(audioctx, soundPath);
});
