'use strict';

const tapStart = typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown';

const capitalize = str => {
  if (typeof str !== 'string' || !str) return `${str}`;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};


let playing = false;
let osc, gain;
function Play() {
  if (playing) return;
  const audioctx = new AudioContext();
  osc = new OscillatorNode(audioctx);
  gain = new GainNode(audioctx);
  osc.connect(gain).connect(audioctx.destination);
  osc.start();
  playing = true;
}



const playButton = document.createElement('button');
playButton.type = 'button';
playButton.textContent = 'play';
playButton.addEventListener(tapStart, Play);


const waveSelect = document.createElement('select');
waveSelect.id = 'type';

const waveTypes = ['sine', 'square', 'sawtooth', 'triangle'];
for (const wType of waveTypes) {
  const option = document.createElement('option');
  option.value = wType.toLowerCase();
  option.text = capitalize(wType);
  waveSelect.appendChild(option);
}
waveSelect.addEventListener('change', Setup);

const freq = document.createElement('input');
freq.type = 'range';
freq.id = 'freq';
freq.min = 50;
freq.max = 3000;
freq.value = 440;
freq.addEventListener('input', Setup);

//const freqdisp = document.createElement('div');
const freqdisp = document.createElement('td');
freqdisp.id = 'freqdisp';
freqdisp.textContent = freq.value;

const level = document.createElement('input');
level.type = 'range';
level.id = 'level';
level.min = 0.0;
level.max = 1.0;
level.step = 0.01;
level.value = 0.5;
level.addEventListener('input', Setup);

//const leveldisp = document.createElement('div');
const leveldisp = document.createElement('td');
leveldisp.id = 'freqdisp';
leveldisp.textContent = level.value;
console.log(leveldisp.nodeName==='td');
console.log(leveldisp.nodeName==='TD');
function Setup() {
  const typeValue = waveSelect.value;
  const freqValue = freq.value;
  const levelValue = level.value;
  
  freqdisp.textContent = freqValue;
  leveldisp.textContent = levelValue;
  
  osc.type = typeValue;
  osc.frequency.value = freqValue;
  gain.gain.value = levelValue;
  
}


const tbl = document.createElement('table');
const tblBody = document.createElement('tbody');

const controllerObj = {
  'Type': [waveSelect],
  'Freq(Hz)': [freq, freqdisp],
  'Level': [level, leveldisp]
};

for (const key of Object.keys(controllerObj)) {
  const row = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = key;
  row.appendChild(th);
  for (const value of controllerObj[key]) {
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
/*
const thValues = ['Type', 'Freq(Hz)', 'Level'];
for (const thValue of thValues) {
  const row = document.createElement('tr');
  const tHeader = document.createElement('th');
  tHeader.textContent = thValue;
  row.appendChild(tHeader);
  tblBody.appendChild(row);
}
*/
// xxx: 関数つくろうかな
const body = document.body;
body.appendChild(playButton);
tbl.appendChild(tblBody);
body.appendChild(tbl);
/*
body.appendChild(waveSelect);
body.appendChild(freqdisp);
body.appendChild(freq);
body.appendChild(leveldisp);
body.appendChild(level);

*/
