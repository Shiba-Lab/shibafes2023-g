# WEBSOCKET SERVER

## ここは何

今回のプロジェクトにおいて各端末間のリアルタイムな通信は非常に重要である。
通信プロトコルには WebSocket を採用し、サーバーでは Python と WebSockets ライブラリを使用する。

**整備途中なのでもう少々お待ちください。**

## How to use

### 1. ビルド

Docker をビルドして、バックグラウンドで起動するようにします。

```bash
docker compose up -d
```

### 2. いざ開発！

サーバの IP は `localhost:8080` です。

`src/main.py` にサーバプログラムが記述できます。ホットリロードに対応しているので、書き直すたびにサーバを再起動する必要はありません。

注: Sep 17 現在、複数ファイルには対応していないので、main.py のみを編集してください。

## メモ

pyenv + poetry + flake8 + black
