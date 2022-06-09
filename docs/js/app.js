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
  element.style.width = '100%';
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
mainTitleHeader.textContent = 'BiquadFilter Test';

const buttonDiv = document.createElement('div');
buttonDiv.style.width = '100%';
const playnoiseButton = createButton('playnoise', 'Play Noise');
const playmusicButton = createButton('playmusic', 'Play Music');
const stopButton = createButton('stop');

/* create controller objs */
// xxx: 辞書にする？
const typeStr = [
  'LPF',
  'HPF',
  'BPF',
  'LowShelf',
  'HighShelf',
  'Peaking',
  'Notch',
  'AllPass',
];

const selectTypeObj = {
  selectObj: {
    id: 'selectType',
  },
  objName: 'Type',
};

const freqvalObj = {
  inputObj: {
    id: 'freq',
    min: 100,
    max: 20000,
    value: 8000,
    numtype: 'int',
  },
  pObj: {
    id: 'freqval',
    label: '',
  },
  objName: 'Freq',
};

const qvalObj = {
  inputObj: {
    id: 'q',
    min: 0.0,
    max: 50.0,
    step: 0.5,
    value: 50.0,
    numtype: 'float',
  },
  pObj: {
    id: 'qval',
    label: '',
  },
  objName: 'Q',
};

const gainvalObj = {
  inputObj: {
    id: 'gain',
    min: -50,
    max: 50,
    value: 0,
    numtype: 'int',
  },
  pObj: {
    id: 'gainval',
    label: '',
  },
  objName: 'Gain',
};

const controllerObjs = createControllerObjs([
  selectTypeObj,
  freqvalObj,
  qvalObj,
  gainvalObj,
]);

const [[selectType], [freq, freqval], [q, qval], [gain, gainval]] =
  Object.entries(controllerObjs).map(([key, val]) => val);

const controllerTable = createControllerTable(controllerObjs);

const cnvsDiv = document.createElement('div');
cnvsDiv.style.width = '100%';

const canvas = document.createElement('canvas');
canvas.style.width = '100%';
const ctx = canvas.getContext('2d');

/* appendChild document element */
setAppendChild([
  mainTitleHeader,
  buttonDiv,
  [playnoiseButton, playmusicButton, stopButton],
  controllerTable,
  cnvsDiv,
  [canvas],
]);

/* canvas */
let WIDTH, HEIGHT;
const setting_height = 0.75; // 4:3
const colorBG = '#000000';
const colorWave = '#009900';
const colorLine = '#ff8844';

function initCanvas() {
  canvas.width = cnvsDiv.clientWidth;
  canvas.height = cnvsDiv.clientWidth * setting_height;
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  ctx.font = '0.8rem monospace'; // serif
  //ctx.textAlign = 'center';
}

function DrawGraph() {
  analyser.getFloatFrequencyData(analysedata);
  ctx.fillStyle = colorBG;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = colorWave;
  for (let i = 0; i < HEIGHT; i++) {
    const f = (audioctx.sampleRate * i) / 1024;
    //const y = 128 + (analysedata[i] + 48.16) * 2.56;
    const y = HEIGHT / 2 + (analysedata[i] + 48.16) * 2.56;
    ctx.fillRect(i, HEIGHT - y, 1, y);
  }
  ctx.fillStyle = colorLine;
  for (let d = -50; d < 50; d += 10) {
    const y = (HEIGHT / 2 - (d * HEIGHT) / 100) | 0;
    ctx.fillRect(20, y, WIDTH, 1);
    ctx.fillText(`${d}db`, 5, y);
  }
  ctx.fillRect(20, HEIGHT / 2, WIDTH, 1);
  for (let f = 2000; f < audioctx.sampleRate / 2; f += 2000) {
    const x = ((f * 1024) / audioctx.sampleRate) | 0;
    ctx.fillRect(x, 0, 1, 245);
    ctx.fillText(`${f}Hz`, x - 10, 255);
  }
  requestAnimationFrame(DrawGraph);
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
let src = null;
const analysedata = new Float32Array(1024);
const noisebuff = new AudioBuffer({
  channels: 1,
  length: audioctx.sampleRate,
  sampleRate: audioctx.sampleRate,
});

const soundPath = './sounds/loop.wav';
let musicbuff = null;

const filter = new BiquadFilterNode(audioctx, { frequency: 4000, q: 50.0 });
const analyser = new AnalyserNode(audioctx, {
  smoothingTimeConstant: 0.7,
  fftSize: 1024,
});
filter.connect(analyser).connect(audioctx.destination);

const noisebuffdata = noisebuff.getChannelData(0);
for (let i = 0; i < audioctx.sampleRate; i++) {
  noisebuffdata[i] = (Math.random() - 0.5) * 0.5;
}

playnoiseButton.addEventListener(touchBegan, () => {
  audioctx.state === 'suspended' ? audioctx.resume() : null;
  src ? src.stop() : null;

  src = new AudioBufferSourceNode(audioctx, { buffer: noisebuff, loop: true });
  src.connect(filter);
  src.start();
});

playmusicButton.addEventListener(touchBegan, () => {
  audioctx.state === 'suspended' ? audioctx.resume() : null;
  src ? src.stop() : null;

  src = new AudioBufferSourceNode(audioctx, { buffer: musicbuff, loop: true });
  src.connect(filter);
  src.start();
});

stopButton.addEventListener(touchBegan, () => {
  if (src) {
    src.stop();
    src = null;
  }
});

selectType.addEventListener('change', Setup);
freq.addEventListener('input', Setup);
q.addEventListener('input', Setup);
gain.addEventListener('input', Setup);

function Setup() {
  // xxx: 辞書で呼ぶ？
  filter.type = [
    'lowpass',
    'highpass',
    'bandpass',
    'lowshelf',
    'highshelf',
    'peaking',
    'notch',
    'allpass',
  ][selectType.selectedIndex];

  filter.frequency.value = freq.value;
  freqval.textContent = parseNum(freq.value, freq.numtype);
  filter.Q.value = q.value;
  qval.textContent = parseNum(q.value, q.numtype);
  filter.gain.value = gain.value;
  gainval.textContent = parseNum(gain.value, gain.numtype);
}

async function LoadSample(actx, url) {
  const res = await fetch(url);
  const arraybuf = await res.arrayBuffer();
  return actx.decodeAudioData(arraybuf);
}

document.addEventListener('DOMContentLoaded', () => {
  Setup();
  initCanvas();
  DrawGraph();
});

window.addEventListener('load', async () => {
  musicbuff = await LoadSample(audioctx, soundPath);
});
window.addEventListener('resize', initCanvas);

