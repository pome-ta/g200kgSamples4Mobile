'use strict';

const tapStart = typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown';

/*
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
});
*/

/*
const playButton = document.createElement('button');
playButton.textContent = 'play';
document.body.appendChild(playButton);
*/
/*
const playButton = document.createElement('input');
  playButton.type = 'button';
  playButton.value = 'play';
*/

function Play() {
  console.log('call');
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioctx = new AudioContext();
  const osc = new OscillatorNode(audioctx);
  osc.connect(audioctx.destination);
  osc.start();
}


let playButton;
document.addEventListener('DOMContentLoaded', () => {
  playButton = document.createElement('button');
  playButton.textContent = 'play';
  playButton.addEventListener(tapStart, () => Play());
  document.body.appendChild(playButton);
});


