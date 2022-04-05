'use strict';

const tapStart = typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown';


function Play() {
  const audioctx = new AudioContext();
  const t0 = audioctx.currentTime;
  for (let i = 0; i < 1; i++) {
    const osc = new OscillatorNode(audioctx);
    osc.connect(audioctx.destination);
    osc.start(t0 + i * 0.5 + 0.5);
    osc.stop(t0 + i * 0.5 + 0.6);
  }
}


const playButton = document.createElement('button');
playButton.type = 'button';
playButton.textContent = 'play';
playButton.addEventListener(tapStart, Play);

const body = document.body;
body.appendChild(playButton);

