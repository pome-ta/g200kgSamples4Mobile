# 📝 2022/04/04

[02.とりあえず音を出す](https://www.g200kg.com/jp/docs/webaudio/generatesound.html) では、html に処理を書いていたが、今回はjs で、完結させるようにしてる


## `new AudioContext()` 挙動

以前書いていた、Polyfill は不要っぽい？

``` .js
const AudioContext = window.AudioContext || window.webkitAudioContext;
```


## `button` Element

`input` でtype 指定ではなく`button` でやる

