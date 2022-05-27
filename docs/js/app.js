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

const cnvsDiv = document.createElement('div');
      cnvsDiv.style.width = '100%';
      cnvsDiv.addEventListener(touchBegan, touchBeganHandler);
      cnvsDiv.addEventListener(touchEnded, touchEndedHandler);
      cnvsDiv.appendChild(canvas);


let WIDTH, HEIGHT;
let x = 0;
let ratio;
const setting_height = 0.75;  // 4:3
const uint8length = 128;
const canvasBgColor = '#222222';
let isTouch = false;


function touchBeganHandler() {
  isTouch = true;
  (audioctx.state === 'suspended') ? audioctx.resume() : null;
  const t0 = audioctx.currentTime;
  const t1 = t0 + parseFloat(atk.value);
  const d = parseFloat(dcy.value);
  const s = parseFloat(sus.value);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(1, t1);
  gain.gain.setTargetAtTime(s, t1, d);
  initCanvas();
  
}


function touchEndedHandler() {
  isTouch = false;
  const r = parseFloat(rel.value);
  const t0 = audioctx.currentTime;
  (gain.gain.cancelAndHoldAtTime) ? gain.gain.cancelAndHoldAtTime(t0) : null;
  gain.gain.setTargetAtTime(0, t0, r);
}


function initCanvas() {
  canvas.width = cnvsDiv.clientWidth;
  canvas.height = cnvsDiv.clientWidth * setting_height;
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  
  x = 0;
  ratio = HEIGHT / 128  // todo: uint8
  canvasctx.fillStyle = canvasBgColor;
  canvasctx.fillRect(0, 0, WIDTH, HEIGHT);
}


//window.addEventListener('resize', initCanvas);
/*
document.addEventListener('DOMContentLoaded', () => {
  const graphdata = new Uint8Array(uint8length);
  osc.connect(gain)
     .connect(ana)
     .connect(audioctx.destination);
  osc.start();
  
  initCanvas();
  function draw() {
    if (x < WIDTH) {
      ana.getByteTimeDomainData(graphdata);
      let y = 0;
      for (const setData of new Set(graphdata)) {
        const data = Math.abs(setData - uint8length);
        if (Math.abs(data > y)) y = data;
      }
      canvasctx.fillStyle = canvasBgColor;
      canvasctx.fillRect(x, 0, 2, HEIGHT);
      
      canvasctx.fillStyle = (isTouch) ? '#ff00ff' : '#00ff00';
      canvasctx.fillRect(x, HEIGHT - (y * ratio), 1, HEIGHT);
    } else {
      x = -1;
    }
    x += 2;
    requestAnimationFrame(draw);
  }
  draw();
});
*/


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

const [[op1freq, op1freqval], [op1level, op1levelval], [op2freq, op2freqval], [op2level, op2levelval]] = Object.keys(controllerObjs).map(key => controllerObjs[key]);

const controllerTable = createControllerTable(controllerObjs);

const mainTitleHeader = document.createElement('h2');
      mainTitleHeader.textContent = 'FM synthesize Test';


/* appendChild document element */
const body = document.body;
body.appendChild(mainTitleHeader);
body.appendChild(controllerTable);
//body.appendChild(cnvsDiv);


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
          inputElement.addEventListener('input', (e) => {
            tdElement.textContent = zeroPadding(e.target.value);
            //tdElement.textContent = parseFloat(e.target.value).toFixed(2);
          });

    const tdElement = document.createElement('td');
          tdElement.id = obj['tableId'];
          tdElement.textContent = zeroPadding(inputElement.value);
          //tdElement.textContent = inputElement.value;

    controllerObjs[obj['objName']] = [inputElement, tdElement];
  }
  return controllerObjs;
}

/*

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
*/


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

