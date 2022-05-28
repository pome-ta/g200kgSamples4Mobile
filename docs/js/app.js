'use strict';

// todo: MouseEvent TouchEvent wrapper
const { touchBegan, touchMoved, touchEnded } = {
  touchBegan: typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  touchMoved: typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  touchEnded: typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};


/* audio */
//let play = 0;
const audioctx = new AudioContext();
const op1 = new OscillatorNode(audioctx);
const gain1 = new GainNode(audioctx);
const op2 = new OscillatorNode(audioctx);
const gain2 = new GainNode(audioctx);

document.addEventListener('DOMContentLoaded', () => {
  op1.connect(gain1).connect(op2.frequency);
  op2.connect(gain2).connect(audioctx.destination);
  audioctx.suspend();
  op1.start();
  op2.start();
  Setup();

});


function Setup() {
  op1.frequency.value = op1freqval.textContent = op1freq.value;
  gain1.gain.value = op1levelval.textContent = op1level.value;
  op2.frequency.value = op2freqval.textContent = op2freq.value;
  gain2.gain.value = op2levelval.textContent = op2level.value;
}


/* setup document element */
/* create controller elements */
const op1freqObj = {
  inputObj: {
    id: 'op1freq',
    min: 10,
    max: 999,
    value: 220
  },
  tableId: 'op1freqval',
  objName: 'OP1 Freq'
};

const op1levelObj = {
  inputObj: {
    id: 'op1level',
    min: 0,
    max: 999,
    value: 300
  },
  tableId: 'op1levelval',
  objName: 'OP1 Level'
};

const op2freqvalObj = {
  inputObj: {
    id: 'op2freq',
    min: 10,
    max: 999,
    value: 440
  },
  tableId: 'op2freqval',
  objName: 'OP2 Freq'
};

const op2levelvalObj = {
  inputObj: {
    id: 'op2level',
    min: 0,
    max: 1,
    step: 0.01,
    value: 0.5
  },
  tableId: 'op2levelval',
  objName: 'OP2 Level'
};

const controllerObjs = createControllerObjs([
  op1freqObj, op1levelObj, op2freqvalObj, op2levelvalObj
]);

const [
  [op1freq, op1freqval],
  [op1level, op1levelval],
  [op2freq, op2freqval],
  [op2level, op2levelval]
] = Object.keys(controllerObjs).map(key => controllerObjs[key]);

const controllerTable = createControllerTable(controllerObjs);


const playButton = createButton('play');
      playButton.addEventListener(touchBegan, () => {
        audioctx.resume();
      });
const stopButton = createButton('stop');
      stopButton.addEventListener(touchBegan, () => {
        audioctx.suspend();
      });
const buttonDiv = document.createElement('div');
      buttonDiv.style.width = '100%';
      buttonDiv.appendChild(playButton);
      buttonDiv.appendChild(stopButton);



const mainTitleHeader = document.createElement('h2');
      mainTitleHeader.textContent = 'FM synthesize Test';


/* appendChild document element */
/*  // xxx: あとで考える
function setAppendChild(childArrays, nodeParent=document.body) {
  
  Array.isArray(childArrays) ? childArrays.map(child => setAppendChild(child), childArrays) : nodeParent.appendChild(childArrays);
}*/

const body = document.body;

body.appendChild(mainTitleHeader);
body.appendChild(buttonDiv);
body.appendChild(controllerTable);



function capitalize(str) {
  if (typeof str !== 'string' || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

function createButton(idName, textValue=null) {
  const element = document.createElement('button');
        element.style.width = '100%';
        element.style.height = '4rem';
        element.type = 'button';
        element.id = idName;
        element.textContent = (textValue) ? textValue :  capitalize(idName);
  return element;
}


/* create document element funcs */
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


function zeroPadding(targetValue) {
  const regex = new RegExp('\\d\\.\\d');
  return regex.test(targetValue) ? parseFloat(targetValue).toFixed(2) : parseInt(targetValue);
}

function createControllerObjs(objArray) {
  const controllerObjs = {};
  for (const obj of objArray) {
    const inputElement = createInputRange(obj['inputObj']);
          inputElement.addEventListener('input', Setup);

    const tdElement = document.createElement('td');
          tdElement.id = obj['tableId'];
          //tdElement.textContent = zeroPadding(inputElement.value);
          tdElement.textContent = inputElement.value;

    controllerObjs[obj['objName']] = [inputElement, tdElement];
  }
  return controllerObjs;
}



function createControllerTable(controllers) {
  const tblBody = document.createElement('tbody');
  for (const key of Object.keys(controllers)) {
    const th = document.createElement('th');
          th.textContent = key;
          th.style.width = '0%';
    const tr = document.createElement('tr');
          tr.appendChild(th);
    for (const value of controllers[key]) {
      if (value.nodeName === 'TD') {
        tr.appendChild(value);
      } else {
        const td = document.createElement('td');
              td.style.width = '100%';
              td.appendChild(value);
        tr.appendChild(td);
      }
    }
    tblBody.appendChild(tr);
  }
  const tbl = document.createElement('table');
        tbl.style.width = '100%';
        tbl.appendChild(tblBody);
  return tbl;
}

