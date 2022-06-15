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
  element.style.minWidth = '2.4rem';
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
  element.step = step;
  element.value = value;
  element.numtype = numtype;

  element.style.width = '100%';
  /*
  element.style.height = '1.28rem';

  element.style.appearance = 'none';
  element.style.cursor = 'pointer';
  element.style.outline = 'none';

  // element.style.background = '#8acdff';
  element.style.borderRadius = '1rem';
  element.style.border = 'solid 1px #dff1ff';
  */
  return element;
}

function getInputRange2Label({ inputObj: iptObj, pObj: pLbl }) {
  const inputElement = createInputRange(iptObj);
  const lbl = inputElement
    ? parseNum(inputElement.value, inputElement.numtype)
    : null;
  const pElement = createLabel(pLbl, lbl);
  return { range: inputElement, p: pElement };
}

function createTableHeader(textContent) {
  const element = document.createElement('th');
  element.textContent = textContent;
  element.style.whiteSpace = 'nowrap';
  element.style.width = '0%';
  return element;
}

function createTableData(child, length = 0) {
  const element = document.createElement('td');
  // console.log(child.nodeName);
  // xxx: ここひどいな
  element.style.width =
    child.nodeName === 'SELECT'
      ? '0%'
      : length > 1
      ? child.nodeName === 'INPUT'
        ? '50%'
        : 'auto'
      : '100%';
  element.appendChild(child);
  return element;
}

function appendCustomHeader(customHeader) {
  const tr = document.createElement('tr');
  customHeader.forEach((element) => {
    const th = createTableHeader(element);
    th.style.fontSize = '0.5rem';
    tr.append(th);
  });
  return tr;
}

function createControllerTable(controllers, customHeader = null) {
  const tblBody = document.createElement('tbody');
  for (const controller of controllers) {
    const { th, tds } = controller;
    const tr = document.createElement('tr');
    tr.appendChild(th);
    tds.forEach((element, _, array) =>
      Object.keys(element).forEach((key) => {
        const td = createTableData(element[key], array.length);
        tr.appendChild(td);
      })
    );
    tblBody.appendChild(tr);
  }
  customHeader ? tblBody.prepend(appendCustomHeader(customHeader)) : null;
  const tbl = document.createElement('table');
  tbl.style.width = '100%';
  tbl.appendChild(tblBody);
  return tbl;
}

function getController({ thLabel: label, tdData: datas }) {
  const thElement = createTableHeader(label);
  const tdElements = Array.isArray(datas)
    ? datas.map((data) => getInputRange2Label(data))
    : [getInputRange2Label(datas)];
  return { th: thElement, tds: tdElements };
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
mainTitleHeader.textContent = 'Oscillator Custom waveform';

const buttonDiv = document.createElement('div');
buttonDiv.style.width = '100%';
const playButton = createButton('play');
const stopButton = createButton('stop');

/* create controller objs */
// main
const freqvalObj = getController({
  thLabel: 'Freq',
  tdData: {
    inputObj: {
      id: 'freq',
      min: 55,
      max: 1760,
      value: 440,
      numtype: 'int',
    },
    pObj: {
      id: 'freqval',
      label: '',
    },
  },
});

const {
  tds: {
    0: { range: freq, p: freqval },
  },
} = freqvalObj;

const gainvalObj = getController({
  thLabel: 'Gain',
  tdData: {
    inputObj: {
      id: 'gain',
      min: 0.0,
      max: 1.0,
      step: 0.01,
      value: 0.5,
      numtype: 'float',
    },
    pObj: {
      id: 'gainval',
      label: '',
    },
  },
});

const {
  tds: {
    0: { range: gain, p: gainval },
  },
} = gainvalObj;

// drawbar
// xxx: all 0 だとならないので、初期配置で微調整
const d0Obj = getController({
  thLabel: '0',
  tdData: [
    {
      inputObj: {
        id: 'real0',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'real0val',
        label: '',
      },
    },
    {
      inputObj: {
        id: 'imag0',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'imag0val',
        label: '',
      },
    },
  ],
});

const {
  tds: {
    0: { range: real0, p: real0val },
    1: { range: imag0, p: imag0val },
  },
} = d0Obj;

const d1Obj = getController({
  thLabel: '1',
  tdData: [
    {
      inputObj: {
        id: 'real1',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'real1val',
        label: '',
      },
    },
    {
      inputObj: {
        id: 'imag1',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 1.0,
        numtype: 'float',
      },
      pObj: {
        id: 'imag1val',
        label: '',
      },
    },
  ],
});

const {
  tds: {
    0: { range: real1, p: real1val },
    1: { range: imag1, p: imag1val },
  },
} = d1Obj;

const d2Obj = getController({
  thLabel: '2',
  tdData: [
    {
      inputObj: {
        id: 'real2',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'real2val',
        label: '',
      },
    },
    {
      inputObj: {
        id: 'imag2',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.5,
        numtype: 'float',
      },
      pObj: {
        id: 'imag2val',
        label: '',
      },
    },
  ],
});

const {
  tds: {
    0: { range: real2, p: real2val },
    1: { range: imag2, p: imag2val },
  },
} = d2Obj;

const d3Obj = getController({
  thLabel: '3',
  tdData: [
    {
      inputObj: {
        id: 'real3',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'real3val',
        label: '',
      },
    },
    {
      inputObj: {
        id: 'imag3',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'imag3val',
        label: '',
      },
    },
  ],
});

const {
  tds: {
    0: { range: real3, p: real3val },
    1: { range: imag3, p: imag3val },
  },
} = d3Obj;

const d4Obj = getController({
  thLabel: '4',
  tdData: [
    {
      inputObj: {
        id: 'real4',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'real4val',
        label: '',
      },
    },
    {
      inputObj: {
        id: 'imag4',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'imag4val',
        label: '',
      },
    },
  ],
});

const {
  tds: {
    0: { range: real4, p: real4val },
    1: { range: imag4, p: imag4val },
  },
} = d4Obj;

const d5Obj = getController({
  thLabel: '5',
  tdData: [
    {
      inputObj: {
        id: 'real5',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'real5val',
        label: '',
      },
    },
    {
      inputObj: {
        id: 'imag5',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'imag5val',
        label: '',
      },
    },
  ],
});

const {
  tds: {
    0: { range: real5, p: real5val },
    1: { range: imag5, p: imag5val },
  },
} = d5Obj;

const d6Obj = getController({
  thLabel: '6',
  tdData: [
    {
      inputObj: {
        id: 'real6',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'real6val',
        label: '',
      },
    },
    {
      inputObj: {
        id: 'imag6',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'imag6val',
        label: '',
      },
    },
  ],
});

const {
  tds: {
    0: { range: real6, p: real6val },
    1: { range: imag6, p: imag6val },
  },
} = d6Obj;

const d7Obj = getController({
  thLabel: '7',
  tdData: [
    {
      inputObj: {
        id: 'real7',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'real7val',
        label: '',
      },
    },
    {
      inputObj: {
        id: 'imag7',
        min: 0.0,
        max: 1.0,
        step: 0.01,
        value: 0.0,
        numtype: 'float',
      },
      pObj: {
        id: 'imag7val',
        label: '',
      },
    },
  ],
});

const {
  tds: {
    0: { range: real7, p: real7val },
    1: { range: imag7, p: imag7val },
  },
} = d7Obj;

const mainController = createControllerTable([freqvalObj, gainvalObj]);

const addHeader = ['Harmonics', 'real', '', 'imag', ''];
const drawbarArray = [d0Obj, d1Obj, d2Obj, d3Obj, d4Obj, d5Obj, d6Obj, d7Obj];
const drawbarController = createControllerTable(drawbarArray, addHeader);

const cnvsDiv = document.createElement('div');
cnvsDiv.style.width = '100%';

const canvas = document.createElement('canvas');
canvas.style.width = '100%';
const canvasctx = canvas.getContext('2d');

/* appendChild document element */
setAppendChild([
  mainTitleHeader,
  buttonDiv,
  [playButton, stopButton],
  mainController,
  drawbarController,
  cnvsDiv,
  [canvas],
]);

/* canvas */
let WIDTH, HEIGHT, halfHEIGHT;
let lineMargin = 1;
const setting_height = 0.75; // 4:3
// const setting_height = 0.5;
const colorBG = '#222222';
const colorWave = '#00ff44';

const capturebuf = new Float32Array(512);

const FPS = 24;
const frameTime = 1 / FPS;

let prevTimestamp = 0;

function initCanvas() {
  canvas.width = cnvsDiv.clientWidth;
  canvas.height = cnvsDiv.clientWidth * setting_height;
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  halfHEIGHT = HEIGHT / 2;
  lineMargin = WIDTH / 512;
}

function DrawGraph(timestamp) {
  const elapsed = (timestamp - prevTimestamp) / 1000;
  if (elapsed <= frameTime) {
    requestAnimationFrame(DrawGraph);
    return;
  }
  prevTimestamp = timestamp;

  ana.getFloatTimeDomainData(capturebuf);
  canvasctx.fillStyle = colorBG;
  canvasctx.fillRect(0, 0, WIDTH, HEIGHT);
  canvasctx.fillStyle = colorWave;
  canvasctx.fillRect(0, halfHEIGHT, WIDTH, 1);
  for (let i = 0; i < 512; i++) {
    const x = i * lineMargin;
    const v = halfHEIGHT - capturebuf[i] * halfHEIGHT;
    canvasctx.fillRect(x, v, lineMargin, halfHEIGHT - v);
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
const osc = new OscillatorNode(audioctx);
const gainNode = new GainNode(audioctx);
const ana = new AnalyserNode(audioctx);

osc.connect(gainNode).connect(ana).connect(audioctx.destination);
audioctx.suspend();
osc.start();

const tablen = drawbarArray.length;
const real = new Float32Array(tablen);
const imag = new Float32Array(tablen);

stopButton.addEventListener(touchBegan, () => {
  audioctx.suspend();
});

playButton.addEventListener(touchBegan, () => {
  audioctx.resume();
});

freq.addEventListener('input', Setup);
gain.addEventListener('input', Setup);

for (let i = 0; i < tablen; i++) {
  document.querySelector(`#real${i}`).addEventListener('input', SetupWave);
  document.querySelector(`#imag${i}`).addEventListener('input', SetupWave);
}

function Setup() {
  osc.frequency.value = freq.value;
  freqval.textContent = parseNum(freq.value, freq.numtype);

  gainNode.gain.value = gain.value;
  gainval.textContent = parseNum(gain.value, gain.numtype);
}

function SetupWave() {
  for (let i = 0; i < tablen; i++) {
    // make Harmonics
    const realValue = parseFloat(document.querySelector(`#real${i}`).value);
    document.querySelector(`#real${i}val`).textContent = realValue;
    real[i] = realValue;

    const imagValue = parseFloat(document.querySelector(`#imag${i}`).value);
    document.querySelector(`#imag${i}val`).textContent = imagValue;
    imag[i] = imagValue;
  }
  const waveTable = audioctx.createPeriodicWave(real, imag); //create periodicWave
  osc.setPeriodicWave(waveTable); //set to Oscillator
}

document.addEventListener('DOMContentLoaded', () => {
  Setup();
  SetupWave();
  initCanvas();
  DrawGraph();
});

window.addEventListener('resize', initCanvas);
