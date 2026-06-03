# アカウント削除リクエストフォーム仕様

野球打率ノート / Batting Stats Tracker のアカウント削除・サーバー上のデータ削除リクエスト用 Google Form を、GAS で作成する。

- 関連ページ: `batting-log/account-deletion.html`
- 関連スクリプト: `scripts/account-deletion-form/create-account-deletion-form.gs`
- 現在のフォームURL: https://forms.gle/xK3sR8Sy6kxXutg77
- 現在の問い合わせメールアドレス: `sokumaeng2020@gmail.com`

## 作成手順

1. https://script.new/ を開く
2. `scripts/account-deletion-form/create-account-deletion-form.gs` の内容を貼り付ける
3. `createBattingLogAccountDeletionRequestForm()` を実行する
4. 権限確認を許可する
5. 実行ログに出力された `Published URL` をコピーする
6. フォームを作り直した場合は、`batting-log/account-deletion.html` のフォームURLを新しい公開URLに差し替える

## フォーム方針

Appleログイン利用者も削除依頼できるように、Google Forms のメール自動収集は使わない。代わりに、フォーム内で「ログインに使ったメールアドレス」を必須入力にする。

ファイルアップロード項目は追加しない。Googleログイン必須になりやすく、削除依頼ページの目的に合わないため。

## フォーム項目

1. `Email address used for sign-in / ログインに使ったメールアドレス`
   - 必須
   - 本人確認用
2. `Sign-in method / ログイン方法`
   - 必須
   - `Apple`
   - `Google`
   - `Not sure / わからない`
3. `Request type / 希望内容`
   - 必須
   - `Account deletion / アカウント削除`
   - `Deletion of server-side shared data / サーバー上の共有データ削除`
   - `Other / その他`
4. `Additional details / 補足`
   - 任意
5. `Confirmation / 確認事項`
   - 必須
   - 端末内ローカル記録はこのリクエストでは削除されないこと
   - App Store / Google Play のサブスクリプションは別途解約が必要なこと

## 運用メモ

- フォームを作り直した場合は、`batting-log/account-deletion.html` の Google Form URL を必ず差し替える
- 問い合わせ用メールアドレスを変更した場合は、同じHTML内のメールリンクも差し替える
- Google Form のタイトルや説明文を大きく変えた場合は、このドキュメントと GAS も同期する
- 回答スプレッドシートを使う場合は、Google Form の管理画面から回答先を作成・紐づける
- フォームを作り直すとURLが変わるため、公開後はむやみに再作成しない
