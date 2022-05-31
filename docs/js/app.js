'use strict';

/* util funcs */
function capitalize(str) {
  if (typeof str !== 'string' || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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
  element.textContent = textContent ? textContent : capitalize(id);
  return element;
}

function createInputRange(rangeObj) {
  const { id, min, max, value, step = '' } = rangeObj;
  const element = document.createElement('input');
  element.type = 'range';
  element.id = id;
  element.min = min;
  element.max = max;
  element.step = step;
  element.value = value;
  element.style.width = '100%';
  return element;
}

function createSelectOpiton(selectObj, typestr) {
  const { id } = selectObj;
  const element = document.createElement('select');
  element.id = id;
  //element.addEventListener('change', Setup);
  for (const type of typestr) {
    const option = document.createElement('option');
    option.value = type.toLowerCase();
    option.text = capitalize(type);
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

    const _label = inputElement ? inputElement.value : null;
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
const stopButton = createButton('stop');

/* create controller objs */
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
    value: 5000,
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
    value: 5.0,
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

/* appendChild document element */
setAppendChild([
  mainTitleHeader,
  buttonDiv,
  [playnoiseButton, stopButton],
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
const bufsize = 1024;
const audioctx = new AudioContext();
const scrproc = audioctx.createScriptProcessor(bufsize);
scrproc.onaudioprocess = Process;
scrproc.connect(audioctx.destination);
let osc = null;
let play = 0;

function Process(ev) {
  const buf0 = ev.outputBuffer.getChannelData(0);
  const buf1 = ev.outputBuffer.getChannelData(1);
  for (let i = 0; i < bufsize; ++i) {
    buf0[i] = buf1[i] = (Math.random() - 0.5) * play;
  }
}

function Setup() {
  freqval.textContent = freq.value;
  qval.textContent = q.value;
  gainval.textContent = gain.value;
}


freq.addEventListener('input', Setup);
q.addEventListener('input', Setup);
gain.addEventListener('input', Setup);

playnoiseButton.addEventListener(touchBegan, () => {
  if (osc === null) {
    osc = new OscillatorNode(audioctx);
    osc.start();
  }
  play = 1;
});

stopButton.addEventListener(touchBegan, () => {
  play = 0;
});
