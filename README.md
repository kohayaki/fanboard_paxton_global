# 汎用アンケートフォーム

開発環境:(https://develop.fanboard.me/form/[ブランドID]

## 関連URL

### Netlify
[https://develop.fanboard.me/form/development]

### スプレッドシート (本番環境と同様のシートを使っています)
[https://docs.google.com/spreadsheets/d/1zyUeSvAK9O8_h3n89gzrTEqNSPOA2yFEGpKdbIk73ts/edit](https://docs.google.com/spreadsheets/d/1zyUeSvAK9O8_h3n89gzrTEqNSPOA2yFEGpKdbIk73ts/edit)


## 汎用設定コンフィグ
[ブランド追加手順](docs/ADDBRAND.md)

### 全体設定ファイル
[config.yml](src/lib/config.yml)

### ブランド別設定ファイルのディレクトリ
[src/lib/](src/lib/)

### 言語切替
[src/locales](src/locales)
へ言語別のファイル（1ファイルの方が良い）を設置、config.ymlの `locale` を変更
brandの設定のyml内はその中を翻訳。

（ブラウザによって切り替えるためにi18nが入っているというよりは、JPサイト、ENサイトを作るために導入している形）

## ローカル開発用

### セットアップ
```
npm install
```

### 開発用ホットリロード
```
npm run serve
```

### ビルド　（Netlifyデプロイ時に自動ビルド）
```
npm run build
```
