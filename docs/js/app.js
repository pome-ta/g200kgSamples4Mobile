'use strict';

// xxx: click とかtouch とか
const { tapDown, tapMove, tapUp } = {
  tapDown: typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  tapMove: typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  tapUp: typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};


//const audioctx = new AudioContext();
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

// xxx: 無駄打ち多い気がする
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



const cnvsDiv = document.createElement('div');
cnvsDiv.style.width = '100%';
const canvas = document.createElement('canvas');
//canvas.style.width = '100%';
const canvasctx = canvas.getContext("2d");

let WIDTH, HEIGHT;

/*   xxx: 今度サイズ確認
window.addEventListener('resize', ()=>{
console.log('resize');
  canvas.width = cnvsDiv.clientWidth;
  canvas.height = cnvsDiv.clientHeight;
});*/

let count = 0

const colors = ['#f8f8ff', '#1e90ff', '#98fb98', '#ff8c00', '#ff00ff', '#800000'];
const clngth = colors.length -1;

const canvasBgColor = '#222222';

let x = 0;
cnvsDiv.addEventListener(tapDown, () => {
  if (audioctx.state === 'suspended') {
    audioctx.resume();
  }
  canvasctx.fillStyle = canvasBgColor;
  canvasctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  const t0 = audioctx.currentTime;
  const t1 = t0 + parseFloat(atk.value);
  const d = parseFloat(dcy.value);
  const s = parseFloat(sus.value);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(1, t1);
  gain.gain.setTargetAtTime(s, t1, d);
  
});


cnvsDiv.addEventListener(tapUp, () => {
  const r = parseFloat(rel.value);
  const t0 = audioctx.currentTime;
  if (gain.gain.cancelAndHoldAtTime) {
    gain.gain.cancelAndHoldAtTime(t0);
  }
  gain.gain.setTargetAtTime(0, t0, r);
});

const audioctx = new AudioContext();
const osc = new OscillatorNode(audioctx);
const gain = new GainNode(audioctx, {gain:0});
const ana = new AnalyserNode(audioctx);

document.addEventListener('DOMContentLoaded', () => {
  canvas.width = cnvsDiv.clientWidth;
  canvas.height = cnvsDiv.clientHeight;
  WIDTH = cnvsDiv.clientWidth / 2;
  HEIGHT = cnvsDiv.clientHeight / 2;
  
  x = 0;
  const graphdata = new Uint8Array(128);
  canvasctx.fillStyle = canvasBgColor;
  canvasctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  osc.connect(gain)
     .connect(ana)
     .connect(audioctx.destination);
  osc.start();

  
});









const mainTitleHeader = document.createElement('h2');
mainTitleHeader.textContent = 'AudioParam Automation';

const body = document.body;
//body.appendChild(playButton);
body.appendChild(mainTitleHeader);
tbl.appendChild(tblBody);
body.appendChild(tbl);



body.appendChild(cnvsDiv);
cnvsDiv.appendChild(canvas);

