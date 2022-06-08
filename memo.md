# 📝 2022/06/08


## 進捗

ここのmemo に書いてなかったから、何を良しとして何を実装したいのか忘れてる


## 再生音源

### 確認用音源

[BiquadFilter Test](https://www.g200kg.com/jp/docs/webaudio/samples/test-filter.html)

記事で使われている[loop.wav](https://www.g200kg.com/jp/docs/webaudio/samples/loop.wav) へアクセスすることにした


### 裏側で

[pome-ta/soundShader4twigl](https://github.com/pome-ta/soundShader4twigl) この出ている音を何かして取得したいのでゴニョゴニョ中

[pome-ta/pystaWavSound](https://github.com/pome-ta/pystaWavSound)

`.png` から、呼び出せないか？とかやってるけど頓挫中



# 📝 2022/05/31


web audio よりもjs でのhtml タグ実装になってる


なるべく関数の機能を分ける

作り出す、呼び出すタイミングや、最終の呼び出しをどうするか(現在は、`id` の意味を成してない)



# 📝 2022/05/29

js で全て書き切ろうとしている

1ファイル内で、audio 設定からイベントハンドリング、Node作成とガチャガチャしちゃってる

そもそも、js でhtml 操作ってあまりよろしくないよね

変数と、処理する場所が遠かったり、あまり書き方的にもよろしくないかも

## `ScriptProcessor` と`AudioWorklet`

[AudioWorkletの導入|@ryoyakawai](https://qiita.com/ryoyakawai/items/1160586653330ccbf4a4)

イベントが非同期でメインスレッドで動作することが問題だった

AudioWorklet は、Audioスレッドで動作させる。音声処理をメインスレッドで処理しなくて済む(`AudioWorkletGloabalScope`)

# 📝 2022/05/26

`setInterval` と`requestAnimationFrame`

[2 つの時計のお話 - Web Audio の正確なスケジューリングについて](https://www.html5rocks.com/ja/tutorials/audio/scheduling/)

# 📝 2022/05/25

## `input` の`value`

文字列やんけ、、、

表示桁数等のバランスにより

``` .js
parseFloat(inputElement.value).toFixed(2);
```

と、文字列から`float` へ0埋めし、文字列化

## `#id` の管理

`index.html` ではなく、js 上にてelement 作成

``` .js
.appendChild(element);
```

`id` を呼び出すこともありそうだけど、js だと変数で持ててしまう？

想定する`#id`達は、羅列表記で変数化はできるけど、綺麗さはない印象

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
