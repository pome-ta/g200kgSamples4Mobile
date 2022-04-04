'use strict';

const tapStart = typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown';

const capitalize = str => {
  if (typeof str !== 'string' || !str) return `${str}`;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};


let playing = false;
function Play() {
  if (playing) return;
  const audioctx = new AudioContext();
  const osc = new OscillatorNode(audioctx);
  osc.connect(audioctx.destination);
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

const freq = document.createElement('input');
freq.type = 'range';
freq.id = 'freq';
freq.min = 50;
freq.max = 3000;
freq.value = 440;
freq.addEventListener('input', (e) => console.log(e.target.value));


const level = document.createElement('input');
level.type = 'range';
level.id = 'level';
level.min = 0.0;
level.max = 1.0;
level.step = 0.01;
level.value = 0.5;
level.addEventListener('input', (e) => console.log(e.target.value));



const tbl = document.createElement('table');
const tblBody = document.createElement('tbody');

const thValues = ['Type', 'Freq(Hz)', 'Level'];
for (const thValue of thValues) {
  const row = document.createElement('tr');
  const tHeader = document.createElement('th');
  tHeader.textContent = thValue;
  row.appendChild(tHeader);
  tblBody.appendChild(row);
}

// xxx: 関数つくろうかな
const body = document.body;
body.appendChild(playButton);
tbl.appendChild(tblBody);
body.appendChild(tbl);
body.appendChild(waveSelect);
body.appendChild(freq);
body.appendChild(level);

