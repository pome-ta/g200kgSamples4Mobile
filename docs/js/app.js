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

async function loadSample(actx, uri) {
  const res = await fetch(uri);
  const arraybuf = await res.arrayBuffer();
  await sleep(1000);
  console.log('hoge');
  return actx.decodeAudioData(arraybuf);
}

const playButton = createPlayButton();

//playButton.addEventListener(tapDown, Start);

const body = document.body;
body.appendChild(playButton);

//const soundPath = '/System/Library/Audio/UISounds/SIMToolkitPositiveACK.caf';
const soundPath = './sounds/440_out.wav';

window.addEventListener('load', async() => {
  const audioctx = new AudioContext();
  //const sound = await loadSample(audioctx, soundPath);
  const sound = await LoadSample(audioctx, soundPath);
  
  playButton.addEventListener(tapDown, () => {
    const src = new AudioBufferSourceNode(audioctx, {buffer:sound});
    src.connect(audioctx.destination);
    src.start();
  });
  
  function LoadSample(actx, url) {
    return new Promise((resolv) => {
      fetch(url).then((response) => {
        return response.arrayBuffer();
      }).then((arraybuf) => {
        return actx.decodeAudioData(arraybuf);
      }).then((buf) => {
        resolv(buf);
      })
    });
  }
  
  
});
