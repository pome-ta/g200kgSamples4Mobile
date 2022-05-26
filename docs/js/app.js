'use strict';

// todo: MouseEvent TouchEvent wrapper
const { touchBegan, touchMoved, touchEnded } = {
  touchBegan: typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  touchMoved: typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  touchEnded: typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};

/* audio */
const audioctx = new AudioContext();
const osc = new OscillatorNode(audioctx);
const gain = new GainNode(audioctx, { gain: 0 });
const ana = new AnalyserNode(audioctx);


/* canvas */
const canvas = document.createElement('canvas');
      canvas.style.width = '100%';
const canvasctx = canvas.getContext('2d');

let x = 0;
let WIDTH, HEIGHT;
const setting_height = 0.75;  // 4:3
const uint8length = 128;
const canvasBgColor = '#222222';


const cnvsDiv = document.createElement('div');
      cnvsDiv.style.width = '100%';
      cnvsDiv.addEventListener(touchBegan, touchBeganHandler);
      cnvsDiv.addEventListener(touchEnded, touchEndedHandler);
      cnvsDiv.appendChild(canvas);


function touchBeganHandler() {
  x = 0;
  canvasctx.fillStyle = canvasBgColor;
  canvasctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  (audioctx.state === 'suspended') ? audioctx.resume() : null;
  const t0 = audioctx.currentTime;
  const t1 = t0 + parseFloat(atk.value);
  const d = parseFloat(dcy.value);
  const s = parseFloat(sus.value);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(1, t1);
  gain.gain.setTargetAtTime(s, t1, d);
}


function touchEndedHandler() {
  const r = parseFloat(rel.value);
  const t0 = audioctx.currentTime;
  (gain.gain.cancelAndHoldAtTime) ? gain.gain.cancelAndHoldAtTime(t0) : null;
  gain.gain.setTargetAtTime(0, t0, r);
}


document.addEventListener('DOMContentLoaded', () => {
  x = 0;
  
  const graphdata = new Uint8Array(uint8length);
  
  canvas.width = cnvsDiv.clientWidth;
  canvas.height = cnvsDiv.clientWidth * setting_height;
  
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  const ratio = HEIGHT / 128  // todo: uint8

  canvasctx.fillStyle = canvasBgColor;
  canvasctx.fillRect(0, 0, WIDTH, HEIGHT);

  osc.connect(gain)
     .connect(ana)
     .connect(audioctx.destination);
  osc.start();
  
  
  draw();
  function draw() {
    requestAnimationFrame(draw);
    if (x < WIDTH) {
      ana.getByteTimeDomainData(graphdata);
      let y = 0;
      for (let i = 0; i < uint8length; ++i) {
        const d = Math.abs(graphdata[i] - uint8length);
        if (Math.abs(d > y)) y = d;
      }
      
      // todo: 最大が128 の音量
      // 300 <= 128
      // HEIGHT = 128
      // 0=0
      // xxx: 不要？上書きしてる様子。`touchBegan` でリセット済
      const ratioHeight = HEIGHT - (y * ratio);
      canvasctx.fillStyle = canvasBgColor;
      canvasctx.fillRect(x, 0, 2, HEIGHT);
      canvasctx.fillStyle = '#00ff00';
      //canvasctx.fillRect(x, HEIGHT - 2 * y, 1, 2 * y);
      canvasctx.fillRect(x, ratioHeight, 1, HEIGHT);
    } else {
      x = 0;
    }
    x += 2;
  }
  
});

/*   xxx: リサイズ処理確認
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
const {
  Attack: [atk, atkval],
  Decay: [dcy, dcyval],
  Sustain: [sus, susval],
  Release: [rel, relval]
} = controllerObjs;

const controllerTable = createControllerTable(controllerObjs);

const mainTitleHeader = document.createElement('h2');
      mainTitleHeader.textContent = 'AudioParam Automation';


/* appendChild document element */
const body = document.body;
body.appendChild(mainTitleHeader);
body.appendChild(controllerTable);
body.appendChild(cnvsDiv);


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


function createControllerObjs(objArray) {
  const controllerObjs = {};
  for (const obj of objArray) {
    const inputElement = createInputRange(obj['inputObj']);
          inputElement.addEventListener('input', (e) => {
            tdElement.textContent = parseFloat(e.target.value).toFixed(2);
          });

    const tdElement = document.createElement('td');
          tdElement.id = obj['tableId'];
          tdElement.textContent = parseFloat(inputElement.value).toFixed(2);

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

