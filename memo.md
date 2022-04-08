# 📝 2022/04/07


```
/System/Library/Audio/UISounds/Swish.caf
/System/Library/Audio/UISounds/mail-sent.caf
```


# 📝 2022/04/05

[オプショナルチェーン `(?.)`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Optional_chaining)


## 機能仕様

音再生させないでcontroller 関係やるとエラー（←当たり前



## html の方

js でのelement こだわると終わりなさそうだから、効率悪くても、まぁええやろ





# 📝 2022/04/04


## `input type='range'` の`value`

`step` がある場合、`step` の後に設定。小数点設定は、`step` で指示しないと、整数になる(と、思われる)



## `step` のデフォルト値

文字列の空っぽい



# 📝 2022/04/04

[02.とりあえず音を出す](https://www.g200kg.com/jp/docs/webaudio/generatesound.html) では、html に処理を書いていたが、今回はjs で、完結させるようにしてる


## `new AudioContext()` 挙動

以前書いていた、Polyfill は不要っぽい？

``` .js
const AudioContext = window.AudioContext || window.webkitAudioContext;
```


## `button` Element

`input` でtype 指定ではなく`button` でやる

