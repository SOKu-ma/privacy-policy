/**
 * Creates the Google Form used for account and server-side data deletion requests.
 *
 * Run this from a standalone Apps Script project:
 * 1. Open https://script.new/
 * 2. Paste this file
 * 3. Run createBattingLogAccountDeletionRequestForm()
 * 4. Copy the logged Published URL and update the Google Form link in
 *    batting-log/account-deletion.html if you are replacing the current form.
 */
const ACCOUNT_DELETION_FORM = {
  title: 'Batting Stats Tracker Account and Data Deletion Request / 野球打率ノート アカウントおよびデータ削除リクエスト',
  description: [
    'Use this form to request deletion of your Batting Stats Tracker account and server-side data.',
    'このフォームは、野球打率ノートのアカウントおよびサーバー上のデータ削除をリクエストするためのものです。',
    '',
    'Please enter the email address used for Apple or Google sign-in so we can verify your request.',
    '本人確認のため、Apple または Google ログインに使用したメールアドレスを入力してください。',
  ].join('\n'),
  confirmationMessage: [
    'Your deletion request has been submitted. After verifying your identity, we will generally process the request within 30 days.',
    '削除リクエストを受け付けました。本人確認後、原則30日以内に対応します。',
  ].join('\n'),
};

function createBattingLogAccountDeletionRequestForm() {
  const form = FormApp.create(ACCOUNT_DELETION_FORM.title);
  configureAccountDeletionForm_(form);

  Logger.log('Edit URL: ' + form.getEditUrl());
  Logger.log('Published URL: ' + form.getPublishedUrl());
  Logger.log('Update the Google Form link in batting-log/account-deletion.html if you are replacing the current form.');

  return form;
}

function configureAccountDeletionForm_(form) {
  form
    .setTitle(ACCOUNT_DELETION_FORM.title)
    .setDescription(ACCOUNT_DELETION_FORM.description)
    .setConfirmationMessage(ACCOUNT_DELETION_FORM.confirmationMessage)
    .setCollectEmail(false)
    .setLimitOneResponsePerUser(false)
    .setAllowResponseEdits(false)
    .setAcceptingResponses(true);

  form.addSectionHeaderItem()
    .setTitle('Before You Submit / 送信前の確認')
    .setHelpText([
      'This request covers your login account and server-side data for Batting Stats Tracker.',
      'If you still have access to the app, you can also use the in-app account deletion flow.',
      'Deleting your account through this request does not delete local records stored on your device or cancel App Store / Google Play subscriptions.',
      '',
      'このリクエストは、野球打率ノートのログインアカウントおよびサーバー上のデータを対象とします。',
      'アプリを利用できる場合は、アプリ内のアカウント削除導線からも削除できます。',
      'このリクエストでアカウントを削除しても、端末内のローカル記録は削除されず、App Store / Google Play のサブスクリプションも自動解約されません。',
    ].join('\n'));

  form.addTextItem()
    .setTitle('Email address used for sign-in / ログインに使ったメールアドレス')
    .setHelpText('Required for identity verification. / 本人確認のために必要です。')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Sign-in method / ログイン方法')
    .setHelpText('Select the method used for the account you want to delete. / 削除したいアカウントで使用したログイン方法を選択してください。')
    .setChoiceValues([
      'Apple',
      'Google',
      'Not sure / わからない',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Request type / 希望内容')
    .setHelpText('Select the request that best matches your situation. / 該当する希望内容を選択してください。')
    .setChoiceValues([
      'Account deletion / アカウント削除',
      'Deletion of server-side shared data / サーバー上の共有データ削除',
      'Other / その他',
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Additional details / 補足')
    .setHelpText([
      'If you selected "Other", or if there is anything we should know before processing your request, enter it here.',
      '「その他」を選択した場合や、削除対応前に確認してほしい内容がある場合は入力してください。',
    ].join('\n'))
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle('Confirmation / 確認事項')
    .setHelpText('Please confirm before submitting. / 送信前に確認してください。')
    .setChoiceValues([
      'I understand that local records stored on my device are not deleted by this request. / このリクエストでは端末内のローカル記録は削除されないことを理解しました。',
      'I understand that App Store / Google Play subscriptions must be canceled separately from the store account settings. / App Store / Google Play のサブスクリプションはストアのアカウント設定から別途解約する必要があることを理解しました。',
    ])
    .setRequired(true);

  form.addSectionHeaderItem()
    .setTitle('Data Covered by This Request / このリクエストの削除対象')
    .setHelpText([
      'After identity verification, the following server-side data may be deleted:',
      '- Login account',
      '- Shared codes stored on the server',
      '- Shared participation information',
      '- Game records, plate appearance records, and practice records uploaded for sharing',
      '- Account linkage information required to verify premium entitlement',
      '',
      '本人確認後、以下のサーバー上のデータを削除対象とします。',
      '- ログインアカウント',
      '- サーバー上に保存された共有コード',
      '- 共有参加情報',
      '- 共有用にアップロードされた試合記録、打席記録、練習記録',
      '- 課金権限確認に必要なアカウント連携情報',
    ].join('\n'));

  form.addSectionHeaderItem()
    .setTitle('Data That May Be Retained / 保持される可能性があるデータ')
    .setHelpText([
      'Some data may not be deleted by this request, including:',
      '- Local records stored on your device',
      '- Purchase history, payment information, and authentication-related information retained by Apple, Google, or payment and subscription management services',
      '- Minimum records necessary for legal compliance, fraud prevention, support, or security purposes',
      '- Aggregated or anonymized analytics data that does not identify an individual',
      '',
      '以下のデータは、このリクエストでは削除されない、または必要な範囲で保持される場合があります。',
      '- 端末内に保存されているローカル記録',
      '- Apple、Google、決済・課金管理サービスなど外部サービスが保持する購入履歴、決済、認証関連情報',
      '- 法令遵守、不正防止、問い合わせ対応、セキュリティ対応に必要な最小限の記録',
      '- 個人を特定できない形に集計・匿名化された分析データ',
    ].join('\n'));

  return form;
}
