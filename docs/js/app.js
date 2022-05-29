'use strict';

// todo: MouseEvent TouchEvent wrapper
const { touchBegan, touchMoved, touchEnded } = {
  touchBegan: typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  touchMoved: typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  touchEnded: typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};


/* audio */
const audioctx = new AudioContext();
const osc1 = new OscillatorNode(audioctx);
const osc2 = new OscillatorNode(audioctx);
const gain = new GainNode(audioctx, {gain:0});

const typestr = ['sine', 'square', 'sawtooth', 'triangle'];

document.addEventListener('DOMContentLoaded', () => {
  osc1.connect(gain.gain);
  osc2.connect(gain).connect(audioctx.destination);
  audioctx.suspend();
  osc1.start();
  osc2.start();
  Setup();
});


function Setup() {
  osc1.type = typestr[osc1type.selectedIndex];
  const f1 = osc1.frequency.value = 20 * Math.pow(250, osc1freq.value);
  osc1freqval.textContent = f1.toFixed(2);

  osc2.type = typestr[osc1type.selectedIndex];
  const f2 = osc2.frequency.value = 20 * Math.pow(250, osc2freq.value);
  osc2freqval.textContent = f2.toFixed(2);
}



/* create controller elements */
const osc1freqvalObj = {
  selectObj: {
    id: 'osc1type'
  },
  inputObj: {
    id: 'osc1freq',
    min: 0,
    max: 1,
    step: 0.001,
    value: 0.5
  },
  tableId: 'osc1freqval',
  objName: 'Osc-1'
};

const  osc2freqvalObj = {
  selectObj: {
    id: 'osc2type'
  },
  inputObj: {
    id: 'osc2freq',
    min: 0,
    max: 1,
    step: 0.001,
    value: 0.3
  },
  tableId: 'osc2freqval',
  objName: 'Osc-2'
};

const controllerObjs = createControllerObjs([osc1freqvalObj, osc2freqvalObj]);

const [
  [osc1type, osc1freq, osc1freqval], [osc2type, osc2freq,osc2freqval]
]= Object.keys(controllerObjs).map(key => controllerObjs[key]);


/* setup document element */
const mainTitleHeader = document.createElement('h2');
      mainTitleHeader.textContent = 'Ring Modulation Test';

const buttonDiv = document.createElement('div');
      buttonDiv.style.width = '100%';
const playButton = createButton('play');
      playButton.addEventListener(touchBegan, () => {
        audioctx.resume();
      });
const stopButton = createButton('stop');
      stopButton.addEventListener(touchBegan, () => {
        audioctx.suspend();
      });



const addHeader = ['', 'Type', 'Freq', ''];
const controllerTable = createControllerTable(controllerObjs, addHeader);

/* appendChild document element */
const nodeArray = [mainTitleHeader, buttonDiv, [playButton, stopButton], controllerTable];

setAppendChild(nodeArray);


function setAppendChild(nodes, parentNode=document.body) {
  let preNode = parentNode;
  nodes.forEach(node => {
    (Array.isArray(node)) ? setAppendChild(node, preNode) : parentNode.appendChild(node);
    preNode = node;
  });
}


function capitalize(str) {
  if (typeof str !== 'string' || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};


/* create document element funcs */
function createButton(idName, textValue=null) {
  const element = document.createElement('button');
        element.style.width = '100%';
        element.style.height = '4rem';
        element.type = 'button';
        element.id = idName;
        element.textContent = (textValue) ? textValue :  capitalize(idName);
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


function createSelectOpiton(selectObj) {
  const {id} = selectObj;
  const element = document.createElement('select');
        element.id = id;
        element.addEventListener('change', Setup);
  for (const wave of typestr) {
    const option = document.createElement('option');
          option.value = wave.toLowerCase();
          option.text = capitalize(wave);
    element.appendChild(option);
  }
  return element;
}


function createControllerObjs(objArray) {
  const controllerObjs = {};
  for (const obj of objArray) {
    const selectElement = createSelectOpiton(obj['selectObj']);
    const inputElement = createInputRange(obj['inputObj']);
          inputElement.addEventListener('input', Setup);
    const tdElement = document.createElement('td');
          tdElement.id = obj['tableId'];
          tdElement.textContent = inputElement.value;
    controllerObjs[obj['objName']] = [selectElement, inputElement, tdElement];
  }
  return controllerObjs;
}

function createTableHeader(values) {
  const tr = document.createElement('tr');
  for (const value of values) {
    const th = document.createElement('th');
          th.textContent = value
          th.style.whiteSpace = 'nowrap';
    tr.appendChild(th);
  }
  return tr;
}

function createControllerTable(controllers, customHeader=null) {
  const tblBody = document.createElement('tbody');
  for (const key of Object.keys(controllers)) {
    const th = document.createElement('th');
          th.textContent = key;
          th.style.whiteSpace = 'nowrap';
          th.style.width = '0%';
    const tr = document.createElement('tr');
          tr.appendChild(th);
    for (const value of controllers[key]) {
      if (value.nodeName === 'TD') {
        value.style.minWidth = '4.8rem';
        value.style.textAlign= "right";
        tr.appendChild(value);
      } else {
        const td = document.createElement('td');
              td.style.width = (value.nodeName === 'SELECT') ? '0%' : '100%';
              td.appendChild(value);
        tr.appendChild(td);
      }
    }
    tblBody.appendChild(tr);
  }
  (customHeader) ? tblBody.prepend(createTableHeader(customHeader)) : null;
  const tbl = document.createElement('table');
        tbl.style.width = '100%';
        tbl.appendChild(tblBody);
  return tbl;
}
