'use strict';

const { tapDown, tapMove, tapUp } = {
  tapDown: typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  tapMove: typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  tapUp: typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};



const playButton = document.createElement('button');
playButton.id = 'play';
playButton.type = 'button';
playButton.textContent = 'Play';
//playButton.addEventListener(tapDown, Start);

const body = document.body;
body.appendChild(playButton);

const soundPath = '/System/Library/Audio/UISounds/SIMToolkitPositiveACK.caf';

window.addEventListener('load', async() => {
  const audioctx = new AudioContext();
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
