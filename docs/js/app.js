'use strict';

const tapStart = typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown';

let playing = false;

const audioctx = new AudioContext();
const osc = new OscillatorNode(audioctx);
const lfo = new OscillatorNode(audioctx, {frequency:5});
const depth = new GainNode(audioctx, {gain:10});
osc.connect(audioctx.destination);
lfo.connect(depth).connect(osc.frequency);


function Play() {
  if (playing) return;
  osc.start();
  lfo.start();
  playing = true;
}


function Setup() {
  osc.frequency.value = document.getElementById("oscfreqval").innerHTML
            = document.getElementById("oscfreq").value;
}



const playButton = document.createElement('button');
playButton.id = 'play';
playButton.type = 'button';
playButton.textContent = 'Play';
playButton.addEventListener(tapStart, Play);



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
  value: 5.0
};

const depthObj = {
  id: 'depth',
  min: 0.0,
  max: 100.0,
  value: 10.0
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

lfofreq.addEventListener('input', Setup);
depthfreq.addEventListener('input', Setup);
oscfreq.addEventListener('input', Setup);

const lfofreqval = document.createElement('td');
lfofreqval.id = 'lfofreqval';
lfofreqval.textContent = lfofreq.value;
const depthval = document.createElement('td');
depthval.id = 'depthval';
depthval.textContent = depthfreq.value;
const oscfreqval = document.createElement('td');
oscfreqval.id = 'oscfreqval';
oscfreqval.textContent = oscfreq.value;


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

// xxx: 関数つくろうかな
const body = document.body;
body.appendChild(playButton);
tbl.appendChild(tblBody);
body.appendChild(tbl);
