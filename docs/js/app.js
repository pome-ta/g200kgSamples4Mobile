'use strict';

const {tapDown, tapMove, tapUp} = {
  tapDown: typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  tapMove: typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  tapUp: typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};


let audioctx, mastervol;

function Start() {
  if (!audioctx) {
    audioctx = new AudioContext();
    mastervol = new GainNode(audioctx);
    mastervol.connect(audioctx.destination);
  }
  const t0 = audioctx.currentTime;
  for (let i = 0; i < 24; i++) {
    const osc = new OscillatorNode(audioctx);
    const gain = new GainNode(audioctx);
    osc.frequency.value = 100.0 + Math.random() * 1000.0;
    gain.gain.value = 0.2 + Math.random() * 0.8;
    osc.connect(gain).connect(mastervol);
    osc.start(t0 + i * 0.5 + 0.5);
    osc.stop(t0 + i * 0.5 + 0.6);
  }
  
}

const playButton = document.createElement('button');
playButton.id = 'play';
playButton.type = 'button';
playButton.textContent = 'Play';
playButton.addEventListener(tapDown, Start);

const body = document.body;
body.appendChild(playButton);

