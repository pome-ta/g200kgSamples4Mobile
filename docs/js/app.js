'use strict';

// xxx: click とかtouch とか
const { tapDown, tapMove, tapUp } = {
  tapDown: typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  tapMove: typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  tapUp: typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};


const audioctx = new AudioContext();
let sound = null;

function createPlayButton() {
  const bttn = document.createElement('button');
  bttn.id = 'play';
  bttn.type = 'button';
  bttn.textContent = 'Play';
  return bttn;
}

const playButton = createPlayButton();
playButton.addEventListener(tapDown, () => {
  const src = new AudioBufferSourceNode(audioctx, { buffer: sound });
  src.connect(audioctx.destination);
  src.start();
});



/* setup document element */
const attackObj = {
  inputObj: {
    id: 'atk',
    min: 0.0,
    max: 5.0,
    step: 0.01,
    value: 0.3
  },
  tableId: 'atkval',
  objName: 'Attack'
};

const decayObj = {
  inputObj: {
    id: 'dcy',
    min: 0.0,
    max: 5.0,
    step: 0.01,
    value: 1.0
  },
  tableId: 'dcyval',
  objName: 'Decay'
};

const sustainObj = {
  inputObj: {
    id: 'sus',
    min: 0.0,
    max: 1.0,
    step: 0.01,
    value: 0.5
  },
  tableId: 'susval',
  objName: 'Sustain'
};

const releaseObj = {
  inputObj: {
    id: 'rel',
    min: 0.0,
    max: 5.0,
    step: 0.01,
    value: 1.0
  },
  tableId: 'relval',
  objName: 'Release'
};






/*
function Setup() {
  // xxx: 小数点表示桁数
  atkval.textContent = parseFloat(atk.value).toFixed(2);
  dcyval.textContent = parseFloat(dcy.value).toFixed(2);
  susval.textContent = parseFloat(sus.value).toFixed(2);
  relval.textContent = parseFloat(rel.value).toFixed(2);
  
}
*/

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

function createControllerObjs(objArray) {
  const controllerObjs = {};
  for (const obj of objArray) {
    const inputElement = createInputRange(obj['inputObj']);
    //inputElement.addEventListener('input', Setup);

    const tdElement = document.createElement('td');
    tdElement.id = obj['tableId'];
    tdElement.textContent = parseFloat(inputElement.value).toFixed(2);

    inputElement.addEventListener('input', (e) => {
      tdElement.textContent = parseFloat(e.target.value).toFixed(2);
    });

    controllerObjs[obj['objName']] = [inputElement, tdElement];
  }
  return controllerObjs;
}




const controllerObjs = createControllerObjs([attackObj, decayObj, sustainObj, releaseObj]);

const {
  Attack: [atk, atkval],
  Decay: [dcy, dcyval],
  Sustain: [sus, susval],
  Release: [rel, relval]
} = controllerObjs;


const tbl = document.createElement('table');
const tblBody = document.createElement('tbody');
for (const key of Object.keys(controllerObjs)) {
  const tr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = key;
  // th.style.whiteSpace = 'nowrap';
  th.style.width = '0%';
  // th.style.minWidth = 0;
  tr.appendChild(th);
  for (const value of controllerObjs[key]) {
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
tbl.style.width = '100%';


const mainTitleHeader = document.createElement('h1');
mainTitleHeader.textContent = 'AudioParam Automation';


const body = document.body;
//body.appendChild(playButton);
body.appendChild(mainTitleHeader);
tbl.appendChild(tblBody);
body.appendChild(tbl);


const cnvsDiv = document.createElement('div');
cnvsDiv.style.width = '100%';
console.log(cnvsDiv.style);
const canvas = document.createElement('canvas');
canvas.style.width = '100%';

body.appendChild(cnvsDiv);
cnvsDiv.appendChild(canvas);


//document.addEventListener('DOMContentLoaded', Setup);
/* 連続気持ち悪い */
/*
const atk = document.querySelector('#atk');
const dcy = document.querySelector('#dcy');
const sus = document.querySelector('#sus');
const rel = document.querySelector('#rel');

const atkval = document.querySelector('#atkval');
const dcyval = document.querySelector('#dcyval');
const susval = document.querySelector('#susval');
const relval = document.querySelector('#relval');
*/
