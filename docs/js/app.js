'use strict';

// xxx: click とかtouch とか
const { tapDown, tapMove, tapUp } = {
  tapDown:
    typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  tapMove:
    typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  tapUp: typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};

window.addEventListener('load', async () => {
  sound = await loadSample(audioctx, soundPath);
});

const sleep = (waitTime) =>
  new Promise((resolve) => setTimeout(resolve, waitTime));
async function loadSample(actx, uri) {
  const res = await fetch(uri);
  const arraybuf = await res.arrayBuffer();
  await sleep(3000);
  return actx.decodeAudioData(arraybuf);
}

const soundPath = './sounds/440_out.wav';
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

const body = document.body;
body.appendChild(playButton);


function createInputRange(rangeObj) {
  const {id, min, max, value, step=''} = rangeObj;
  const element = document.createElement('input');
  element.type = 'range';
  element.id = id;
  element.min = min;
  element.max = max;
  element.step = step;
  element.value = value;
  return element;
}

const attackObj = {
  id: 'atk',
  min: 0.0,
  max: 5.0,
  step: 0.01,
  value: 0.3
};

const decayObj = {
  id: 'dcy',
  min: 0.0,
  max: 5.0,
  step: 0.01,
  value: 1.0
};

const sustainObj = {
  id: 'sus',
  min: 0.0,
  max: 1.0,
  step: 0.01,
  value: 0.5
};

const releaseObj = {
  id: 'rel',
  min: 0.0,
  max: 5.0,
  step: 0.01,
  value: 1.0
};

const attackInput = createInputRange(attackObj);
const decayInput = createInputRange(decayObj);
const sustainInput = createInputRange(sustainObj);
const releaseInput = createInputRange(releaseObj);

/*
lfofreq.addEventListener('input', Setup);
depthfreq.addEventListener('input', Setup);
oscfreq.addEventListener('input', Setup);
*/
//document.addEventListener('DOMContentLoaded', Setup);

const atkval = document.createElement('td');
atkval.id = 'atkval';

const dcyval = document.createElement('td');
dcyval.id = 'dcyval';

const susval = document.createElement('td');
susval.id = 'susval';

const relval = document.createElement('td');
relval.id = 'relval';


const controllerObjs = {
  'Attack': [attackInput, atkval],
  'Decay': [decayInput, dcyval],
  'Sustain': [sustainInput, susval],
  'Release': [releaseInput, relval]
};

const tbl = document.createElement('table');
const tblBody = document.createElement('tbody');
for (const key of Object.keys(controllerObjs)) {
  const row = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = key;
  row.appendChild(th);
  for (const value of controllerObjs[key]) {
    if (value === 'TD') {
      row.appendChild(value);
    } else {
      const td = document.createElement('td');
      td.appendChild(value);
      row.appendChild(td);
    }
  }
  tblBody.appendChild(row);
}



const mainTitleHeader = document.createElement('h1');
mainTitleHeader.textContent = 'AudioParam Automation';

body.appendChild(mainTitleHeader);
tbl.appendChild(tblBody);
body.appendChild(tbl);
