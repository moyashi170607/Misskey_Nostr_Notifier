# Misskey_Nostr_Notifier

## 概要
Misskey_Nostr_Notifierは、Arudino互換機である**UIAPduino**とNode.jsを用いたMisskeyとNostrの通知を検知するデバイス、プログラムです。

Misskeyの通知を受け取るとLEDが緑色に、Nostrの通知を受け取ると紫色に光ります。\
また、パッシブブザーの音でも知らせます。

### 対応している通知
#### Misskey
通知として届くもの全て

### Nostr
対応しているイベントのkind\
ただし、投稿のpタグに自身の公開鍵が含まれてる必要あり

- 1 投稿内のメンション
- 4 DM(NIP-04)
- 6 リポスト
- 7 リアクション
- 8 バッジの授与
- 16 汎用リポスト
- 42 チャンネルメッセージ
- 1059 DM(NIP-17)
- 9735 Zap
- 30023 長文投稿



## misskey_nostr_notifier_node
このフォルダにはNode.js上で動くプログラムが含まれています。\
またフォルダ内のdocsには、プログラムについてのドキュメントがあります。

## misskey_nostr_notifier_uiap
このフォルダにはハードウェアに関するプログラムが含まれています。

## 環境構築

### ハードウェア
- UIAPduino Pro Micro CH32V003 V1.4
- USBシリアル変換モジュール (CH340E)
- platformIO Core 6.1.18·Home 3.4.4
- platform-ch32v https://github.com/Community-PIO-CH32V/platform-ch32v

その他は回路図や`platform.ini`を参照

### ソフトウェア
- Node.js v24.11.1

その他は`package.json`および`package-lock.json`を参照

### デバイスの回路図例
<image src="img/notifier_circuit.png">
<img src="img/MN_notifier.jpg">

## セットアップ

### ハードウェア
```
git clone https://github.com/moyashi170607/Misskey_Nostr_Notifier.git
```

まずはデバイスのセットアップについて説明します。\
先述の回路図や写真をもとにデバイスを作成してください。

その後、次のコマンドを入力してください。
```
cd misskey_nostr_notifier_uiap
```
`src/main.c`に、プログラムが書かれています。
必要に応じてLEDやブザーのピンの番号などを変更してください。

各種platformIOの設定はUIAPduinoに合わせて設定されています。
必要に応じて変更してください。

マイコンを情報線のあるケーブルなどを用いてUSBポートに書き込みモードで接続し、以下のコマンドを実行してください\
(誤ってシリアル通信デバイス側のUSBソケットに接続しないように注意してください)

```
pio run --target upload --environment genericCH32V003F4P6
```

書き込みが成功すれば、無事ハードウェアのセットアップは完了です。

### ソフトウェア

```
cd ../
cd misskey_nostr_notifier_node
touch config.yml
```

その後、以下のファイルを編集してください

#### config.yml
```
PK_HEX: あなたのNostr公開鍵（HEX形式）
RELAY:
  - リレーサーバーのWebSocketのURL1
  - URL2
  - URL3

MISSKEY_ORIGIN: 接続するMisskeyインスタンスのオリジン(URL)
MISSKEY_API: あなたのMisskeyアカウントAPIキー

PORT: マイコンを接続するポート
```

これらの設定が済んだら、デバイスのUSBシリアル変換モジュールのUSBソケットにプラグを差し込みパソコンと接続してください。

その後、以下のコマンドを実行しましょう。
```
npm run start
```

無事シリアル通信が確立し、各種サーバーとの接続が確認出来たら成功です。

## コントリビュート
issue, PR どちらも大歓迎です。

## リンク集
- UIAPduino公式 https://www.uiap.jp/
- platform-ch32v https://github.com/Community-PIO-CH32V/platform-ch32v \
  インストール手順
  https://pio-ch32v.readthedocs.io/en/latest/installation.html#install-platformio

## ライセンス
このプロジェクトはMITライセンスの下でライセンスされています。詳細についてはLICENSEファイルを参照してください。