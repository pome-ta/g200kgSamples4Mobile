'use strict';

/* create document node element funcs */

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
        //element.addEventListener('change', Setup);
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
    //const selectElement = createSelectOpiton(obj['selectObj']);
    const inputElement = createInputRange(obj['inputObj']);
          //inputElement.addEventListener('input', Setup);
    const tdElement = document.createElement('td');
          tdElement.id = obj['tableId'];
          tdElement.textContent = inputElement.value;
    controllerObjs[obj['objName']] = [inputElement, tdElement];
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


function setAppendChild(nodes, parentNode=document.body) {
  let preNode = parentNode;
  nodes.forEach(node => {
    (Array.isArray(node)) ? setAppendChild(node, preNode) : parentNode.appendChild(node);
    preNode = node;
  });
}




// todo: MouseEvent TouchEvent wrapper
const { touchBegan, touchMoved, touchEnded } = {
  touchBegan: typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  touchMoved: typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  touchEnded: typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
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



/* setup document element */
/* create controller elements */
const freqvalObj = {
  inputObj: {
    id: 'freq',
    min: 100,
    max: 20000,
    value: 5000
  },
  tableId: 'freqval',
  objName: 'Freq'
};

const qvalObj = {
  inputObj: {
    id: 'q',
    min: 0,
    max: 50,
    step: 0.5,
    value: 5
  },
  tableId: 'qval',
  objName: 'Q'
};

const gainvalObj = {
  inputObj: {
    id: 'gain',
    min: -50,
    max: 50,
    value: 0
  },
  tableId: 'gainval',
  objName: 'Gain'
};



/* setup document element */
const mainTitleHeader = document.createElement('h2');
      mainTitleHeader.textContent = 'BiquadFilter Test';

const buttonDiv = document.createElement('div');
      buttonDiv.style.width = '100%';
const playnoiseButton = createButton('playnoise', 'Play Noise');
      playnoiseButton.addEventListener(touchBegan, () => {
        if(osc === null) {
          osc = new OscillatorNode(audioctx);
          osc.start();
        }
        play = 1;
      });
const stopButton = createButton('stop');
      stopButton.addEventListener(touchBegan, () => {
        play = 0;
      });


const controllerObjs = createControllerObjs([freqvalObj, qvalObj, gainvalObj]);
const controllerTable = createControllerTable(controllerObjs);

/* appendChild document element */
const nodeArray = [mainTitleHeader, buttonDiv, [playnoiseButton, stopButton], controllerTable];

setAppendChild(nodeArray);





