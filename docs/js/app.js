'use strict';

// xxx: click とかtouch とか
const { tapDown, tapMove, tapUp } = {
  tapDown: typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  tapMove: typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  tapUp: typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};

function createPlayButton() {
  const bttn = document.createElement('button');
  bttn.id = 'play';
  bttn.type = 'button';
  bttn.textContent = 'Play';
  return bttn;
}

const sleep = waitTime => new Promise(resolve => setTimeout(resolve, waitTime));


async function loadSample(actx, uri) {
  const res = await fetch(uri);
  const arraybuf = await res.arrayBuffer();
  await sleep(1000);
  return actx.decodeAudioData(arraybuf);
}

const soundPath = './sounds/440_out.wav';
const audioctx = new AudioContext();

const sound = await loadSample(audioctx, soundPath);


const playButton = createPlayButton();

//playButton.addEventListener(tapDown, Start);



//const soundPath = '/System/Library/Audio/UISounds/SIMToolkitPositiveACK.caf';
const body = document.body;

window.addEventListener('load', async() => {
  
body.appendChild(playButton);
});


//const sound = await LoadSample(audioctx, soundPath);

playButton.addEventListener(tapDown, () => {
  const src = new AudioBufferSourceNode(audioctx, {buffer:sound});
  src.connect(audioctx.destination);
  src.start();
});
/*
window.addEventListener('load', async() => {
  const audioctx = new AudioContext();
  const sound = await loadSample(audioctx, soundPath);
  //const sound = await LoadSample(audioctx, soundPath);
  
  playButton.addEventListener(tapDown, () => {
    const src = new AudioBufferSourceNode(audioctx, {buffer:sound});
    src.connect(audioctx.destination);
    src.start();
  });
});
*/




