'use strict';

// xxx: click とかtouch とか
const { tapDown, tapMove, tapUp } = {
  tapDown: typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  tapMove: typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  tapUp: typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};

let x = 0;
let WIDTH, HEIGHT;

const audioctx = new AudioContext();
const osc = new OscillatorNode(audioctx);
const gain = new GainNode(audioctx, {gain: 0});
const ana = new AnalyserNode(audioctx);

const cnvsDiv = document.createElement('div');
      cnvsDiv.style.width = '100%';
const canvas = document.createElement('canvas');
const canvasctx = canvas.getContext('2d');
const canvasBgColor = '#222222';

cnvsDiv.addEventListener(tapDown, () => {
  if (audioctx.state === 'suspended') {
    audioctx.resume();
  }
  x = 0;
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

  setInterval(() => {
    if (x < WIDTH) {
      ana.getByteTimeDomainData(graphdata);
      let y = 0;
      for (let i = 0; i < 128; ++i) {
        const d = Math.abs(graphdata[i] - 128);
        if (Math.abs(d > y)) y = d;
      }
      canvasctx.fillStyle = '#222222';
      canvasctx.fillRect(x, 0, 2, HEIGHT);
      canvasctx.fillStyle = '#00ff00';
      canvasctx.fillRect(x, HEIGHT - 2 * y, 2, 2 * y);
    }
    x += 2;
  }, 50);
});

/*   xxx: 今度サイズ確認
window.addEventListener('resize', ()=>{
console.log('resize');
  canvas.width = cnvsDiv.clientWidth;
  canvas.height = cnvsDiv.clientHeight;
});*/

/* setup document element */
/* create controller elements */
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

const controllerObjs = createControllerObjs([
  attackObj, decayObj, sustainObj, releaseObj
]);

// xxx: 無駄打ち多い気がする
const { Attack: [atk, atkval], Decay: [dcy, dcyval], Sustain: [sus, susval], Release: [rel, relval] } = controllerObjs;

const tbl = document.createElement('table');
      tbl.style.width = '100%';
const tblBody = document.createElement('tbody');
for (const key of Object.keys(controllerObjs)) {
  const th = document.createElement('th');
        th.textContent = key;
        th.style.width = '0%';
  const tr = document.createElement('tr');
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




const mainTitleHeader = document.createElement('h2');
      mainTitleHeader.textContent = 'AudioParam Automation';
/* appendChild document element */
const body = document.body;
body.appendChild(mainTitleHeader);
body.appendChild(tbl);
  tbl.appendChild(tblBody);  // 自分認識用インデント
body.appendChild(cnvsDiv);
  cnvsDiv.appendChild(canvas);  // 自分認識用インデント


/* create document element funcs */
function createInputRange(rangeObj) {
  let element;
  const { id, min, max, value, step = '' } = rangeObj;
  element = document.createElement('input');
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
  let inputElement, tdElement;
  
  for (const obj of objArray) {
    inputElement = createInputRange(obj['inputObj']);
    inputElement.addEventListener('input', (e) => {
      tdElement.textContent = parseFloat(e.target.value).toFixed(2);
    });

    tdElement = document.createElement('td');
    tdElement.id = obj['tableId'];
    tdElement.textContent = parseFloat(inputElement.value).toFixed(2);

    controllerObjs[obj['objName']] = [inputElement, tdElement];
  }
  return controllerObjs;
}

