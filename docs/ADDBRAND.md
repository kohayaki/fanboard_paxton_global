# 汎用アンケートフォーム ブランド追加手順

Github上からでもブランド追加作業は完結できますが、可能な限りローカル環境での作業を推奨します。

## 1. 追加ブランド用設定ファイルを作成

ディレクトリ [src/lib/](../src/lib/) に```(半角文字).yml```というブランド用設定ファイルを作成します。ファイルの中身は[ブランド設定用テンプレートファイル](../src/lib/brands/template.yml)
をコピーし、必要事項を編集します。

### .yml
<table>
  <thead>
    <tr>
      <th>設定項目</th>
      <th>データ型</th>
      <th>備考</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>name</td>
      <td>半角文字列</td>
      <td>URLの識別子になります。他ブランドとかぶらないようご注意ください。</td>        
    </tr>
    <tr>
      <td>label</td>
      <td>文字列 - 全角可</td>
      <td>ブランド名</td>        
    </tr>
    <tr>
      <td>title</td>
      <td>文字列 - 全角可</td>
      <td>ウェルカムページの最上部に表記するタイトル</td>        
    </tr>
    <tr>
      <td>heroTitle</td>
      <td>文字列 - 全角可</td>
      <td>ウェルカムページのヒーロータイトル</td>        
    </tr>
    <tr>
      <td>heroContent</td>
      <td>文字列 - 全角可</td>
      <td>ウェルカムページのヒーローコンテンツ</td>        
    </tr>
    <tr>
      <td>gifts</td>
      <td>※GIFTのリスト</td>
      <td>ギフト券を１つ以上、３つ以下で指定します。ギフト券の種類には制限があります。</td>        
    </tr>
    <tr>
      <td>shops</td>
      <td>*SHOPのリスト</td>
      <td>販売している店舗を設定します。制限はありません。</td>        
    </tr>
    <tr>
      <td>questions</td>
      <td>*QUESTIONのリスト</td>
      <td>質問を設定します。設定できる質問のタイプは、テキスト自由入力/選択肢/ラジオボタン の３種類のみです。</td>        
    </tr>
    <tr>
      <td>requestReview</td>
      <td>レビュー投稿へ誘導頻度</td>
      <td>満足度評価の1〜5（★〜★★★★★）に対し、それぞれ0〜100の数値(整数)を設定します。0:誘導しない、100:必ず誘導、70:70%の確率で誘導</td>        
    </tr>
    <tr>
      <td>lineAddFriendUrl</td>
      <td>半角文字列</td>
      <td>アンケート回答完了ページのLINE友達追加のURL</td>        
    </tr>
    <tr>
      <td>emailAddress</td>
      <td>半角文字列</td>
      <td>アンケート回答完了ページのメールアドレス</td>        
    </tr>
    <tr>
      <td>color</td>
      <td>各種</td>
      <td>ウェブページ全体の色の設定</td>        
    </tr>
  </tbody>
 </table>




### ＊GIFT
<table>
  <thead>
    <tr>
      <th>設定項目</th>
      <th>データ型</th>
      <th>備考</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td>半角文字列</td>
      <td>amazon_giftcard, starbucks_giftcard, quocardの３タイプのみ指定可能です。</td>        
    </tr>
    <tr>
      <td>amount</td>
      <td>数値</td>
      <td>金額を指定します。</td>        
    </tr>
  </tbody>
 </table>


### ＊SHOP
<table>
  <thead>
    <tr>
      <th>設定項目</th>
      <th>データ型</th>
      <th>備考</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td>半角文字列</td>
      <td>一意な識別子になります。</td>        
    </tr>
    <tr>
      <td>label</td>
      <td>文字列 - 全角可</td>
      <td>店舗の名称</td>        
    </tr>
    <tr>
      <td>url</td>
      <td>半角文字列</td>
      <td>注文番号確認用URL。urlの設定がない場合は表示されません。</td>        
    </tr>
    <tr>
      <td>masks</td>
      <td>半角文字列のリスト</td>
      <td>注文番号入力時に、番号チェックします。mask設定がない場合は、番号チェックはスキップされます。複数設定できます。</td>        
    </tr>
    <tr>
      <td>reviewUrl</td>
      <td>半角文字列</td>
      <td>満足度5の場合に表示される、レビュー投稿用のURL。reviewUrlの設定がない場合は、Amazonのレビューページにリンクします。</td>        
    </tr>
  </tbody>
 </table>

### ＊QUESTION
<table>
  <thead>
    <tr>
      <th>設定項目</th>
      <th>データ型</th>
      <th>備考</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>title</td>
      <td>文字列 - 全角可</td>
      <td>質問文</td>        
    </tr>
    <tr>
      <td>type</td>
      <td>半角文字列</td>
      <td>テキスト自由入力・・・"text"、選択肢・・・"select"、ラジオ・・・"radio" </td>        
    </tr>
    <tr>
      <td>placeholder</td>
      <td>文字列 - 全角可</td>
      <td>未入力時に表示される文字列</td>        
    </tr>
    <tr>
      <td>options</td>
      <td>文字列 - 全角可</td>
      <td>type="select",type="radio"の場合、選択肢のtextとvalueを設定します。 textは表示されるラベル、valueはスプレッドシートに送信される値になります。</td>        
    </tr>
  </tbody>
 </table>



## 2. 全体設定ファイルを変更
[config.yml](src/lib/config.yml)

### brands
1.で作成したファイル名を追加します。
