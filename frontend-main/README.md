# FRONTEND MAIN

## ここは何

今回のプロジェクトでは Three.js と p5.js を利用するため、基本的には React を用いることができないが、複数人でのコーディングにおけるコード全体の可読性や保守性などの品質を上げるために言語は`TypeScript`、lint に`ESLint`と`StyleLint`を導入する。

## 初回セットアップ

### node の準備

node のバージョンをは`18.17.1`で固定とします。
2023 年 9 月現在、最新の LTS ではあるので普通に`brew install node`でも動きはするのですが、
今後 node を使い続けることと、このレポジトリ以外でのプロジェクトでバージョン違いが起こると大変なので
[asdf](https://asdf-vm.com/)や[nodenv](https://github.com/nodenv/nodenv)などのバージョン管理ツールを使うとよいでしょう。
この readme では`nodenv`を使ったガイドを載せるので、**こちらの利用を強く推奨**します。

---

<details>
<summary> nodenvのインストール for Mac </summary>

① HomeBrew で nodenv のインストールを行います。

```bash
$ brew install nodenv
```

② `~/.zshrc`の最終行に hook を追加します。以下のコマンド 2 つを実行してください。

（echo ではなく、vim 等で直接書き込んでも問題ありません）

```bash
$ echo 'export PATH="$HOME/.nodenv/bin:$PATH"' >> ~/.zshrc
```

```bash
$ echo 'eval "$(nodenv init -)"' >> ~/.zshrc
```

③ このままでは `.zshrc`が読み込まれていないので、再読み込みを行います。

```bash
$ source ~/.zshrc
```

④ `.node-version`に記載されている node のバージョンを確認して下さい。

(記事確認時点では `v18.17.1`)

確認したバージョンを nodenv でインストールします。

( `.node-version`に記載されているのが v18.17.1 でない場合はコマンドを適切に変更してください)

```bash
$ nodenv install 18.17.1
```

⑤ nodenv をリフレッシュします

```bash
$ nodenv rehash
```

⑥ インストールされた node のバージョンが合っているかを確認します

```bash
$ node -v
```

</details>

<details>
<summary> nodenvのインストール for Windows (Ubuntu)</summary>

**ここからは必ず WSL Ubuntu を使用してください**

① ビルドツールが無いかもしれないのでインストールします(あればスキップで構わない)

```bash
$ sudo apt install build-essential
```

② 公式の手順で nodenv のインストールを行います(公式: https://github.com/nodenv/nodenv)。さらに、 `nodenv install` を有効にするため、node-build もインストールします(野良記事: https://omohikane.com/ubuntu_intall_nodenv/)。

```bash
$ git clone https://github.com/nodenv/nodenv.git ~/.nodenv
$ cd ~/.nodenv && src/configure && make -C src
$ git clone https://github.com/nodenv/node-build.git ~/.nodenv/plugins/node-build
```

③ `~/.bashrc`の最終行に hook を追加します。以下のコマンド 2 つを実行してください。

（echo ではなく、vim 等で直接書き込んでも問題ありません）

（bash 以外のシェルを使っている場合は出力先を適宜変更してください）

```bash
$ echo 'export PATH="$HOME/.nodenv/bin:$PATH"' >> ~/.bashrc
```

```bash
$ echo 'eval "$(nodenv init -)"' >> ~/.bashrc
```

③ このままでは `.bashrc`が読み込まれていないので、再読み込みを行います。

```bash
$ source ~/.bashrc
```

④ `.node-version`に記載されている node のバージョンを確認して下さい。

(記事確認時点では `v18.17.1`)

確認したバージョンを nodenv でインストールします。

( `.node-version`に記載されているのが v18.17.1 でない場合はコマンドを適切に変更してください)

```bash
$ nodenv install 18.17.1
$ nodenv global 18.17.1
```

⑤ nodenv をリフレッシュします

```bash
$ nodenv rehash
```

⑥ インストールされた node のバージョンが合っているかを確認します

```bash
$ node -v
```

</details>

---

### 依存関係パッケージのインストール

このレポジトリでは基本的にパッケージ管理には`npm`を用います。
以下のコマンドを実行して依存関係をインストールしてください。

```bash
$ npm i
```

### VScode での開発

開発においてコーディングルールを eslint, stylelint に定義しています。
VScode では自動的にルールに合っているか解析+ルールに合ったように整形を行うことができるため、以下の拡張機能をインストールしてください。
VScode のユーザー設定は`.vscode`ディレクトリ内に定義済みのため特に変える必要はない(はず)です。

**重要 適切にeslintの設定を読み込むためには、`shibafes2023-g`をVSCodeで開くのではなく`frontend-main`を開く必要があることに注意してください**

- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

### 開発サーバーの立ち上げ

以下のコマンドで開発サーバーを立ち上げられます。
通常は http://localhost:8080 に立ち上がります。

```bash
$ npm run dev
```

### 使用する技術

基本的には以下の技術スタックを使用して開発を行うこととします。
lint は eslint と stylelint を使用し、SCSS は用いず通常の CSS のみで記述することとします。

#### 言語

- TypeScript

#### モジュール

- WebPack

#### パッケージ

- three.js

#### lint 関係

- eslint
- stylelint
- prettier
