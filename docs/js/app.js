'use strict';

const tapStart = typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown';


const playButton = document.createElement('button');
playButton.type = 'button';
playButton.textContent = 'play';
playButton.addEventListener(tapStart, Play);
document.body.appendChild(playButton);


function Play() {
  //console.log('call');
  //const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioctx = new AudioContext();
  const osc = new OscillatorNode(audioctx);
  osc.connect(audioctx.destination);
  osc.start();
}

