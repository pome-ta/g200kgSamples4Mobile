'use strict';

// xxx: click とかtouch とか
const { tapDown, tapMove, tapUp } = {
  tapDown: typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  tapMove: typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  tapUp: typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};

window.addEventListener('load', async() => {
  sound = await loadSample(audioctx, soundPath);
});


const sleep = waitTime => new Promise(resolve => setTimeout(resolve, waitTime));
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
  const src = new AudioBufferSourceNode(audioctx, {buffer:sound});
  src.connect(audioctx.destination);
  src.start();
});

const body = document.body;
body.appendChild(playButton);

