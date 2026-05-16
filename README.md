# Privacy Policy Pages

This repository hosts privacy policy documents for released applications.

## 共通問い合わせフォーム仕様

各アプリの問い合わせ先は、アプリ別フォームではなく共通の Google Form に集約する。

- フォーム名: `App Support / アプリに関するお問い合わせ`
- 公開URL: https://docs.google.com/forms/d/e/1FAIpQLSfXp5cAOJq2tXp3apMVFXlDvcrSBMcM8Q_7Ysnpou1ofqeg5Q/viewform?usp=header
- 目的: 複数アプリ、複数言語の問い合わせを1つのフォームと回答スプレッドシートで扱う
- 初期構成: 最初に `Language / 言語` を選択し、選択した言語のセクションへ遷移する
- 対応言語: 日本語、English

### フォーム構成

1ページ目は言語選択のみを表示する。

- `Language / 言語`
  - `日本語`
  - `English`

日本語を選択した場合は日本語セクション、English を選択した場合は English セクションへ遷移する。今後ほかの言語を追加する場合も、同じフォーム内に言語別セクションを追加する。

### アプリから開く場合

アプリ内の問い合わせ導線から開く場合は、Google Forms の事前入力URLを使って、取得可能な情報をURLパラメータに含める。

事前入力URLのベース:

```text
https://docs.google.com/forms/d/e/1FAIpQLSfXp5cAOJq2tXp3apMVFXlDvcrSBMcM8Q_7Ysnpou1ofqeg5Q/viewform?usp=pp_url
```

アプリ側では端末ロケールに応じて、該当言語セクションの `entry.xxxxx` に値を入れる。

- `ja`: `Language / 言語` に `日本語` を入れ、日本語セクションの entry ID を使う
- `en` または未対応言語: `Language / 言語` に `English` を入れ、English セクションの entry ID を使う

Google Forms の仕様上、`Language / 言語` を事前入力しても自動で次のセクションへは進まない。ユーザーは最初の画面で `次へ / Next` を押す必要がある。ただし、遷移先セクション内のアプリ名、OS、アプリバージョン等も事前入力される。

### 事前入力対象

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

### entry ID 一覧

#### 共通

| 項目 | entry ID | 値 |
| --- | --- | --- |
| Language / 言語 | `entry.2062129080` | `日本語` または `English` |

#### 日本語セクション

| 項目 | entry ID |
| --- | --- |
| アプリ | `entry.1645608167` |
| お問い合わせ内容の種類 | `entry.2039751679` |
| お問い合わせ内容の詳細 | `entry.855706164` |
| 端末名 | `entry.105896020` |
| OS | `entry.1090172573` |
| OSバージョン | `entry.848239561` |
| アプリバージョン | `entry.897002209` |
| ビルド番号 | `entry.1644795001` |
| ストア | `entry.1982869783` |
| メールアドレス | `entry.463257604` |

日本語のアプリ選択肢:

- `サッカーフォーメーションボード`
- `野球打率ノート`
- `野球オーダー表アプリ`
- `Cosmic Gravity Merge`
- `その他`

#### English section

| Field | entry ID |
| --- | --- |
| App | `entry.1176267794` |
| Inquiry type | `entry.585657871` |
| Details | `entry.503343398` |
| Device model | `entry.882611635` |
| Operating system | `entry.47567059` |
| OS version | `entry.498972797` |
| App version | `entry.1930128288` |
| Build number | `entry.1853635124` |
| Store | `entry.312784306` |
| Email address | `entry.309431752` |

English app choices:

- `Soccer Lineup Board`
- `Batting Stats Tracker`
- `Baseball Order Board`
- `Cosmic Gravity Merge`
- `Other`

### URL例

日本語:

```text
https://docs.google.com/forms/d/e/1FAIpQLSfXp5cAOJq2tXp3apMVFXlDvcrSBMcM8Q_7Ysnpou1ofqeg5Q/viewform?usp=pp_url&entry.2062129080=日本語&entry.1645608167=サッカーフォーメーションボード&entry.1090172573=iOS&entry.848239561=18.5&entry.897002209=1.0.0&entry.1644795001=100&entry.1982869783=App%20Store
```

English:

```text
https://docs.google.com/forms/d/e/1FAIpQLSfXp5cAOJq2tXp3apMVFXlDvcrSBMcM8Q_7Ysnpou1ofqeg5Q/viewform?usp=pp_url&entry.2062129080=English&entry.1176267794=Soccer%20Lineup%20Board&entry.47567059=iOS&entry.498972797=18.5&entry.1930128288=1.0.0&entry.1853635124=100&entry.312784306=App%20Store
```

実装時はURLエンコードを行うこと。

### 運用メモ

- フォーム項目を削除して作り直すと `entry.xxxxx` が変わるため、アプリ実装後は削除・再作成を避ける
- 表示文言の変更や選択肢追加は可能
- 言語を追加する場合は、新しい言語セクションと、その言語用の entry ID マッピングをアプリ側に追加する
- ストアページ、プライバシーポリシー、利用規約から開く場合は、事前入力なしの公開URLでよい
- Google Forms の事前入力値は非表示ではないため、ユーザーに見えて問題ない診断情報だけを渡す
- ファイルアップロード項目は Google ログインが必要になりやすいため、原則追加しない
