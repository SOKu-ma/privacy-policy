# 共通問い合わせフォーム仕様

各アプリの問い合わせ先は、アプリ別フォームではなく共通の Google Form に集約する。

- フォーム名: `App Support / アプリに関するお問い合わせ`
- 公開URL: https://docs.google.com/forms/d/e/1FAIpQLSfXp5cAOJq2tXp3apMVFXlDvcrSBMcM8Q_7Ysnpou1ofqeg5Q/viewform?usp=header
- 目的: 複数アプリ、複数言語の問い合わせを1つのフォームと回答スプレッドシートで扱う
- 初期構成: 最初に `Language / 言語` を選択し、選択した言語のセクションへ遷移する
- 対応言語: 日本語、English
- 関連スクリプト: [../scripts/support-form/reorder-support-form.gs](../scripts/support-form/reorder-support-form.gs)

## フォーム構成

1ページ目は言語選択のみを表示する。

- `Language / 言語`
  - `日本語`
  - `English`

日本語を選択した場合は日本語セクション、English を選択した場合は English セクションへ遷移する。今後ほかの言語を追加する場合も、同じフォーム内に言語別セクションを追加する。

日本語セクションでは、最初に問い合わせ本文に必要な項目だけを表示する。

1. `お問い合わせ内容の種類`
2. `お問い合わせ内容の詳細`
3. `メールアドレス`
4. `アプリ・端末情報`
5. `アプリ`
6. `OS`
7. `OSバージョン`
8. `アプリバージョン`
9. `ビルド番号`
10. `ストア`
11. `端末名`

English section also shows the inquiry fields first.

1. `Inquiry type`
2. `Details`
3. `Email address`
4. `App and device information`
5. `App`
6. `Operating system`
7. `OS version`
8. `App version`
9. `Build number`
10. `Store`
11. `Device model`

## アプリから開く場合

アプリ内の問い合わせ導線から開く場合は、Google Forms の事前入力URLを使って、取得可能な情報をURLパラメータに含める。

事前入力URLのベース:

```text
https://docs.google.com/forms/d/e/1FAIpQLSfXp5cAOJq2tXp3apMVFXlDvcrSBMcM8Q_7Ysnpou1ofqeg5Q/viewform?usp=pp_url
```

アプリ側では端末ロケールに応じて、該当言語セクションの `entry.xxxxx` に値を入れる。

- `ja`: `Language / 言語` に `日本語` を入れ、日本語セクションの entry ID を使う
- `en` または未対応言語: `Language / 言語` に `English` を入れ、English セクションの entry ID を使う

Google Forms の仕様上、`Language / 言語` を事前入力しても自動で次のセクションへは進まない。ユーザーは最初の画面で `次へ / Next` を押す必要がある。ただし、遷移先セクション内のアプリ名、OS、アプリバージョン等も事前入力される。

## 事前入力対象

アプリから自動入力する値は、ユーザーに見えて編集可能な情報として扱う。秘密情報、トークン、ユーザーを直接識別するIDは含めない。

推奨して自動入力する項目:

- アプリ名
- OS
- OSバージョン
- アプリバージョン
- ビルド番号
- ストア

必要に応じてユーザーが入力する項目:

- 問い合わせ内容の種類
- 問い合わせ内容の詳細
- 端末名
- メールアドレス

メールアドレスは返信希望時のみ任意入力とする。
端末名はアプリ・端末情報ブロックの末尾に置くが、ユーザーが必要に応じて入力する任意項目として扱う。

## entry ID 一覧

### 共通

| 項目 | entry ID | 値 |
| --- | --- | --- |
| Language / 言語 | `entry.2062129080` | `日本語` または `English` |

### 日本語セクション

| 項目 | entry ID |
| --- | --- |
| お問い合わせ内容の種類 | `entry.2039751679` |
| お問い合わせ内容の詳細 | `entry.855706164` |
| メールアドレス | `entry.463257604` |
| アプリ・端末情報 | entry ID なし |
| アプリ | `entry.1645608167` |
| OS | `entry.1090172573` |
| OSバージョン | `entry.848239561` |
| アプリバージョン | `entry.897002209` |
| ビルド番号 | `entry.1644795001` |
| ストア | `entry.1982869783` |
| 端末名 | `entry.105896020` |

日本語のアプリ選択肢:

- `サッカーフォーメーションボード`
- `野球打率ノート`
- `野球オーダー表アプリ`
- `Cosmic Gravity Merge`
- `その他`

### English section

| Field | entry ID |
| --- | --- |
| Inquiry type | `entry.585657871` |
| Details | `entry.503343398` |
| Email address | `entry.309431752` |
| App and device information | no entry ID |
| App | `entry.1176267794` |
| Operating system | `entry.47567059` |
| OS version | `entry.498972797` |
| App version | `entry.1930128288` |
| Build number | `entry.1853635124` |
| Store | `entry.312784306` |
| Device model | `entry.882611635` |

English app choices:

- `Soccer Lineup Board`
- `Batting Stats Tracker`
- `Baseball Order Board`
- `Cosmic Gravity Merge`
- `Other`

## URL例

日本語:

```text
https://docs.google.com/forms/d/e/1FAIpQLSfXp5cAOJq2tXp3apMVFXlDvcrSBMcM8Q_7Ysnpou1ofqeg5Q/viewform?usp=pp_url&entry.2062129080=日本語&entry.1645608167=サッカーフォーメーションボード&entry.1090172573=iOS&entry.848239561=18.5&entry.897002209=1.0.0&entry.1644795001=100&entry.1982869783=App%20Store
```

English:

```text
https://docs.google.com/forms/d/e/1FAIpQLSfXp5cAOJq2tXp3apMVFXlDvcrSBMcM8Q_7Ysnpou1ofqeg5Q/viewform?usp=pp_url&entry.2062129080=English&entry.1176267794=Soccer%20Lineup%20Board&entry.47567059=iOS&entry.498972797=18.5&entry.1930128288=1.0.0&entry.1853635124=100&entry.312784306=App%20Store
```

実装時はURLエンコードを行うこと。

## 運用メモ

- フォームの表示順を調整する場合は、[../scripts/support-form/reorder-support-form.gs](../scripts/support-form/reorder-support-form.gs) を対象フォームに紐づいた Apps Script で実行する
- `アプリ / App`、`OS`、`OSバージョン / OS version`、`アプリバージョン / App version`、`ビルド番号 / Build number`、`ストア / Store` はアプリ側から事前入力するため、ユーザーに最初に選ばせる位置へ置かない
- フォーム項目を削除して作り直すと `entry.xxxxx` が変わるため、アプリ実装後は削除・再作成を避ける
- 表示文言の変更や選択肢追加は可能
- 言語を追加する場合は、新しい言語セクションと、その言語用の entry ID マッピングをアプリ側に追加する
- ストアページ、プライバシーポリシー、利用規約から開く場合は、事前入力なしの公開URLでよい
- Google Forms の事前入力値は非表示ではないため、ユーザーに見えて問題ない診断情報だけを渡す
- ファイルアップロード項目は Google ログインが必要になりやすいため、原則追加しない
