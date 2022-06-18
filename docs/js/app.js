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
  element.style.width = '50%';
  element.style.height = '2.4rem';
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

function createCheckbox(checkboxObj) {
  const { id } = checkboxObj;
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
mainTitleHeader.textContent = 'Delay Test';

const buttonDiv = document.createElement('div');
buttonDiv.style.width = '100%';
const playButton = createButton('play');
const stopButton = createButton('stop');

/* create controller objs */

const bypassObj = {
  checkboxObj: {
    id: 'bypassBool',
  },
  objName: 'Bypass',
};

const timeObj = {
  inputObj: {
    id: 'timeRange',
    min: 0.0,
    max: 1.0,
    step: 0.01,
    value: 0.25,
    numtype: 'float',
  },
  pObj: {
    id: 'timeval',
    label: '',
  },
  objName: 'Time',
};

const feedbackObj = {
  inputObj: {
    id: 'feedbackRange',
    min: 0.0,
    max: 1.0,
    step: 0.01,
    value: 0.4,
    numtype: 'float',
  },
  pObj: {
    id: 'feedbackval',
    label: '',
  },
  objName: 'Feedback',
};

const mixObj = {
  inputObj: {
    id: 'mixRange',
    min: 0.0,
    max: 1.0,
    step: 0.01,
    value: 0.4,
    numtype: 'float',
  },
  pObj: {
    id: 'mixval',
    label: '',
  },
  objName: 'Mix',
};

const controllerObjs = createControllerObjs([
  bypassObj,
  timeObj,
  feedbackObj,
  mixObj,
]);

const [
  [bypassBool],
  [timeRange, timeval],
  [feedbackRange, feedbackval],
  [mixRange, mixval],
] = Object.entries(controllerObjs).map(([key, val]) => val);

const controllerTable = createControllerTable(controllerObjs);

/* appendChild document element */
setAppendChild([
  mainTitleHeader,
  buttonDiv,
  [playButton, stopButton],
  controllerTable,
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
const audioctx = new AudioContext();
const soundPath = './sounds/loop.wav';
let buffer = null;
let src = null;
const input = new GainNode(audioctx);
const delay = new DelayNode(audioctx);
const wetlevel = new GainNode(audioctx);
const drylevel = new GainNode(audioctx);
const feedback = new GainNode(audioctx);

input.connect(delay).connect(wetlevel).connect(audioctx.destination);
delay.connect(feedback).connect(delay);
input.connect(drylevel).connect(audioctx.destination);

playButton.addEventListener(touchBegan, () => {
  audioctx.state === 'suspended' ? audioctx.resume() : null;
  if (!src) {
    src = new AudioBufferSourceNode(audioctx, { buffer: buffer, loop: true });
    src.connect(input);
    src.start();
  }
});

stopButton.addEventListener(touchBegan, () => {
  src ? src.stop() : null;
  src = null;
});

bypassBool.addEventListener('change', Setup);
timeRange.addEventListener('input', Setup);
feedbackRange.addEventListener('input', Setup);
mixRange.addEventListener('input', Setup);

async function LoadSample(actx, url) {
  const res = await fetch(url);
  const arraybuf = await res.arrayBuffer();
  return actx.decodeAudioData(arraybuf);
}

function Setup() {
  const bypass = bypassBool.checked;
  delay.delayTime.value = timeRange.value;
  feedback.gain.value = feedbackRange.value;
  let mix = mixRange.value;
  mix = bypass ? 0 : mix;
  wetlevel.gain.value = mix;
  drylevel.gain.value = 1 - mix;

  timeval.textContent = parseNum(timeRange.value, timeRange.numtype);
  feedbackval.textContent = parseNum(
    feedbackRange.value,
    feedbackRange.numtype
  );
  mixval.textContent = parseNum(mixRange.value, mixRange.numtype);
}

document.addEventListener('DOMContentLoaded', () => {
  Setup();
});

window.addEventListener('load', async () => {
  buffer = await LoadSample(audioctx, soundPath);
});
