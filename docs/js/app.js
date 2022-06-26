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

// xxx: 辞書にする？
const typeStr = ['equalpower', 'HRTF'];

const panningModelObj = {
  objName: 'panningModel',
  selectObj: {
    id: 'panmodel',
  },
};

const positionXObj = {
  objName: 'PositionX',
  inputObj: {
    id: 'posx',
    min: -10.0,
    max: 10.0,
    step: 0.1,
    value: 0.0,
    numtype: 'float',
  },
  pObj: {
    id: 'posxval',
    label: '',
  },
};

const positionYObj = {
  objName: 'PositionY',
  inputObj: {
    id: 'posy',
    min: -10.0,
    max: 10.0,
    step: 0.1,
    value: 0.0,
    numtype: 'float',
  },
  pObj: {
    id: 'posyval',
    label: '',
  },
};

const positionZObj = {
  objName: 'PositionZ',
  inputObj: {
    id: 'posz',
    min: -10.0,
    max: 10.0,
    step: 0.1,
    value: -5.0,
    numtype: 'float',
  },
  pObj: {
    id: 'poszval',
    label: '',
  },
};

const controllerObjs = createControllerObjs([
  panningModelObj,
  positionXObj,
  positionYObj,
  positionZObj,
]);

const [[panmodel], [posx, posxval], [posy, posyval], [posz, poszval]] =
  Object.entries(controllerObjs).map(([key, val]) => val);

const controllerTable = createControllerTable(controllerObjs);

const dragTextNode = document.createTextNode('Drag to set position.');

/* appendChild document element */
setAppendChild([
  mainTitleHeader,
  buttonDiv,
  [playButton, stopButton],
  controllerTable,
  dragTextNode,
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
panmodel.selectedIndex = 1;
const soundPath = './sounds/loop.wav';

let px,
  py,
  pz = [0, 0, 0];
const audioctx = new AudioContext();
let buffer = null;

//const source = new AudioBufferSourceNode(audioctx, {buffer:buffer, loop:true});
const source = new AudioBufferSourceNode(audioctx, { loop: true });
const panner = new PannerNode(audioctx, { panningModel: 'HRTF' });
source.connect(panner).connect(audioctx.destination);
audioctx.suspend();
source.start();

playButton.addEventListener(touchBegan, () => {
  audioctx.resume();
});

stopButton.addEventListener(touchBegan, () => {
  audioctx.suspend();
});

panmodel.addEventListener('change', SetupModel);
posx.addEventListener('input', SetupPos);
posy.addEventListener('input', SetupPos);
posz.addEventListener('input', SetupPos);

function SetupModel() {
  panner.panningModel = typeStr[panmodel.selectedIndex];
}

function SetupPos() {
  px = posx.value;
  py = posy.value;
  pz = posz.value;
  panner.positionX.value = parseFloat(px);
  panner.positionY.value = parseFloat(py);
  panner.positionZ.value = parseFloat(pz);

  posxval.textContent = parseNum(posx.value, posx.numtype);
  posyval.textContent = parseNum(posy.value, posy.numtype);
  poszval.textContent = parseNum(posz.value, posz.numtype);
}

async function LoadSample(actx, url) {
  const res = await fetch(url);
  const arraybuf = await res.arrayBuffer();
  return actx.decodeAudioData(arraybuf);
}

document.addEventListener('DOMContentLoaded', async () => {
  buffer = await LoadSample(audioctx, soundPath);
  source.buffer = buffer;
});

document.addEventListener('DOMContentLoaded', () => {
  SetupModel();
  SetupPos();
});
