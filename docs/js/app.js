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
  element.style.width = '50%';
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
  args.forEach((canvasElement) => {
    canvasElement.style.width = '100%';
    canvasElement.style.position = 'absolute';
    canvasElement.style.top = 0;
    canvasElement.style.left = 0;
  });
}

/* setup document node element */
const mainTitleHeader = document.createElement('h2');
mainTitleHeader.textContent = 'Convolver Test';

const buttonDiv = document.createElement('div');
buttonDiv.style.width = '100%';
const playButton = createButton('play');
const stopButton = createButton('stop');

/* create controller objs */
const ReverbLevelObj = {
  objName: 'ReverbLevel',
  inputObj: {
    id: 'revlevel',
    min: 0.0,
    max: 1.0,
    step: 0.01,
    value: 0.5,
    numtype: 'float',
  },
  pObj: {
    id: 'revlevelval',
    label: '',
  },
};

const controllerObjs = createControllerObjs([ReverbLevelObj]);

const [[revlevel, revlevelval]] = Object.entries(controllerObjs).map(
  ([key, val]) => val
);

const controllerTable = createControllerTable(controllerObjs);

const explanationParagraph = document.createElement('div');
explanationParagraph.style.width = '100%';
explanationParagraph.innerHTML = `
  <p>* Impulse Response file from:<br/>
  <a href="http://www.acoustics.hut.fi/projects/poririrs/">http://www.acoustics.hut.fi/projects/poririrs/</a><br/>
  bin-dfeq.zip <br/>
  (free for non-commercial use)
  </p>`;

/* appendChild document element */
setAppendChild([
  mainTitleHeader,
  buttonDiv,
  [playButton, stopButton],
  controllerTable,
  explanationParagraph,
]);

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
const soundPath = './sounds/loop.wav';
const irPath = './sounds/ir/s1_r1_bd.wav';
const audioctx = new AudioContext();
let soundbuf = null;
let irbuf = null;
const convolver = new ConvolverNode(audioctx);
const revmix = new GainNode(audioctx);
const drymix = new GainNode(audioctx);
let source = null;

convolver.connect(revmix).connect(audioctx.destination);
drymix.connect(audioctx.destination);

playButton.addEventListener(touchBegan, () => {
  audioctx.state === 'suspended' ? audioctx.resume() : null;
  if (!source) {
    source = new AudioBufferSourceNode(audioctx, {
      buffer: soundbuf,
      loop: true,
    });
    source.connect(drymix);
    source.connect(convolver);
    source.start();
  }
});

stopButton.addEventListener(touchBegan, () => {
  if (source) {
    source.stop();
    source = null;
  }
});

revlevel.addEventListener('input', Setup);

function Setup() {
  const rev = revlevel.value;
  revmix.gain.value = rev;
  drymix.gain.value = 1 - rev;

  revlevelval.textContent = parseNum(revlevel.value, revlevel.numtype);
}

async function LoadSample(actx, url) {
  const res = await fetch(url);
  const arraybuf = await res.arrayBuffer();
  return actx.decodeAudioData(arraybuf);
}

document.addEventListener('DOMContentLoaded', async () => {
  soundbuf = await LoadSample(audioctx, soundPath);
  irbuf = await LoadSample(audioctx, irPath);
  convolver.buffer = irbuf;
});

document.addEventListener('DOMContentLoaded', () => {
  Setup();
});
