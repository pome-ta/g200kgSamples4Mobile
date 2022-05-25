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

const FREQUENCY_VALUE = 5.0;
const GAIN_VALUE = 10.0;

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

const lfofreqObj = {
  id: 'lfofreq',
  min: 0.1,
  max: 20.0,
  step: 0.1,
  value: FREQUENCY_VALUE
};

const depthObj = {
  id: 'depth',
  min: 0.0,
  max: 100.0,
  value: GAIN_VALUE
};

const oscfreqObj = {
  id: 'oscfreq',
  min: 50.0,
  max: 3000.0,
  value: 440.0
};

const lfofreq = createInputRange(lfofreqObj);
const depthfreq = createInputRange(depthObj);
const oscfreq = createInputRange(oscfreqObj);

/*
lfofreq.addEventListener('input', Setup);
depthfreq.addEventListener('input', Setup);
oscfreq.addEventListener('input', Setup);
*/
//document.addEventListener('DOMContentLoaded', Setup);

const lfofreqval = document.createElement('td');
lfofreqval.id = 'lfofreqval';

const depthval = document.createElement('td');
depthval.id = 'depthval';

const oscfreqval = document.createElement('td');
oscfreqval.id = 'oscfreqval';


const controllerObjs = {
  'LFO Freq': [lfofreq, lfofreqval],
  'Depth': [depthfreq, depthval],
  'OSC Freq': [oscfreq, oscfreqval]
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
