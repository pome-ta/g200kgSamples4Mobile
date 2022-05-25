# 📝 2022/05/24


## `06-2` branch

- Promise をasync に書き換え
- クソデカオーディオデータ読む時の挙動確認もしとる？

## 07.パラメータとオートメーション

sample が鳴らない [07.パラメータとオートメーション](https://www.g200kg.com/jp/docs/webaudio/audioparam.html)


ブラウザで、確認したところ長押しで、音が鳴る感じ。

長押し判定とか、見てみるか

### 原因

`"mousedown"` で呼び出していた


``` .js
const tapStart = typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown';
```

`tapStart` <= `"mousedown"`

置き換え




## 長押し選択を解除する


これで、ええか

``` .css
html {
  height: 100%;
  /* タップアクション制御 */
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

```


# 📝 2022/04/18

```
/System/Library/Audio/UISounds/SIMToolkitPositiveACK.caf
```


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

