## FRONTEND REACT

## ここは何

今回のプロジェクトでは Three.js と p5.js を利用するため、基本的には React を用いることができないが、実際のメインの描画を行うページ以外は React および Next.js を用いることで開発自体の効率化と管理のしやすさを担保させる。
主にユーザーの名前、色などの設定画面やトップページなどの予定。

## 初回セットアップ

### nodeの準備

nodeのバージョンをは`18.17.1`で固定とします。
2023年9月現在、最新のLTSではあるので普通に`brew install node`でも動きはするのですが、
今後nodeを使い続けることと、このレポジトリ以外でのプロジェクトでバージョン違いが起こると大変なので
[asdf](https://asdf-vm.com/)や[nodenv](https://github.com/nodenv/nodenv)などのバージョン管理ツールを使うとよいでしょう。
このreadmeでは`nodenv`を使ったガイドを載せるので、**こちらの利用を強く推奨**します。

---

<details>
<summary> nodenvのインストール for Mac </summary>

① HomeBrewでnodenvのインストールを行います。

```bash
$ brew install nodenv
```

② `~/.zshrc`の最終行にhookを追加します。以下のコマンド2つを実行してください。

（echoではなく、vim等で直接書き込んでも問題ありません）

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

④ `.node-version`に記載されているnodeのバージョンを確認して下さい。

(記事確認時点では `v18.17.1`)

確認したバージョンをnodenvでインストールします。

( `.node-version`に記載されているのがv18.17.1でない場合はコマンドを適切に変更してください)

```bash
$ nodenv install 18.17.1
```

⑤ nodenvをリフレッシュします

```bash
$ nodenv rehash
```

⑥ インストールされたnodeのバージョンが合っているかを確認します

```bash
$ node -v
```

</details>

<details>
<summary> nodenvのインストール for Windows (Ubuntu)</summary>

**ここからは必ずWSL Ubuntuを使用してください**

① ビルドツールが無いかもしれないのでインストールします(あればスキップで構わない)

```bash
$ sudo apt install build-essential
```

② 公式の手順でnodenvのインストールを行います(公式: https://github.com/nodenv/nodenv)。さらに、 `nodenv install` を有効にするため、node-buildもインストールします(野良記事: https://omohikane.com/ubuntu_intall_nodenv/)。

```bash
$ git clone https://github.com/nodenv/nodenv.git ~/.nodenv
$ cd ~/.nodenv && src/configure && make -C src
$ git clone https://github.com/nodenv/node-build.git ~/.nodenv/plugins/node-build
```

③ `~/.bashrc`の最終行にhookを追加します。以下のコマンド2つを実行してください。

（echoではなく、vim等で直接書き込んでも問題ありません）

（bash以外のシェルを使っている場合は出力先を適宜変更してください）

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

④ `.node-version`に記載されているnodeのバージョンを確認して下さい。

(記事確認時点では `v18.17.1`)

確認したバージョンをnodenvでインストールします。

( `.node-version`に記載されているのがv18.17.1でない場合はコマンドを適切に変更してください)

```bash
$ nodenv install 18.17.1
$ nodenv global 18.17.1
```

⑤ nodenvをリフレッシュします

```bash
$ nodenv rehash
```

⑥ インストールされたnodeのバージョンが合っているかを確認します

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

### VScodeでの開発

開発においてコーディングルールをeslintに定義しています。
VScodeでは自動的にルールに合っているか解析+ルールに合ったように整形を行うことができるため、以下の拡張機能をインストールしてください。
VScodeのユーザー設定は`.vscode`ディレクトリ内に定義済みのため特に変える必要はない(はず)です。

**重要 適切にeslintの設定を読み込むためには、`shibafes2023-g`をVSCodeで開くのではなく`frontend-react`を開く必要があることに注意してください**

- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### 開発サーバーの立ち上げ

以下のコマンドで開発サーバーを立ち上げられます。
通常は http://localhost:3000 に立ち上がります。

```bash
$ npm run dev
```

### 使用する技術

基本的には以下の技術スタックを使用して開発を行うこととします。
lintはeslintのみとし、Chakra UIを用いることで特殊なケースを除いてCSSファイル自体の記述を行わないこととします。

#### 言語

- TypeScript

#### モジュール

- React
- Next.js

#### パッケージ

- Chakra UI
- react-p5

#### lint関係

- eslint
- prettier
