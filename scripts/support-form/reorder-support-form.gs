/**
 * Reorders the existing "App Support / アプリに関するお問い合わせ" Google Form
 * without deleting or recreating existing question items.
 *
 * Run this from Apps Script bound to the target Google Form:
 * Extensions > Apps Script > paste this file > run reorderSupportFormForLowerCognitiveLoad().
 */
const SUPPORT_FORM_ITEM_IDS = {
  language: 1197277288,
  jaPage: 1040451078,
  enPage: 1470373665,
  ja: {
    app: 1571161321,
    inquiryType: 1579835177,
    details: 1206706401,
    deviceModel: 450691478,
    os: 1557025205,
    osVersion: 1755491690,
    appVersion: 486155211,
    buildNumber: 1587980853,
    store: 1244181685,
    email: 633578283,
  },
  en: {
    app: 598771427,
    inquiryType: 1816890723,
    details: 534860064,
    deviceModel: 2073931760,
    os: 318225903,
    osVersion: 431891318,
    appVersion: 1013730398,
    buildNumber: 1991354932,
    store: 846187719,
    email: 1639542359,
  },
};

const SUPPORT_FORM_TITLES = {
  jaAutoHeader: 'アプリ・端末情報',
  jaAutoHelpText: '以下は、アプリや端末についての情報です。お問い合わせ内容の確認に必要なため、基本的には編集せずそのまま送信してください。',
  enAutoHeader: 'App and device information',
  enAutoHelpText: 'The following information helps us confirm your app and device environment. It is usually filled in automatically, so you generally do not need to edit it.',
  legacyJaAutoHeader: '自動入力情報（通常は変更不要）',
  legacyEnAutoHeader: 'Auto-filled information (usually no need to edit)',
};

function reorderSupportFormForLowerCognitiveLoad() {
  const form = FormApp.getActiveForm();
  if (!form) {
    throw new Error('対象フォームに紐づいた Apps Script から実行してください。');
  }

  form.setTitle('App Support / アプリに関するお問い合わせ');
  form.setDescription('Please select your language first.\n最初に言語を選択してください。');
  form.setConfirmationMessage(
    'Thank you for your inquiry. / お問い合わせありがとうございます。確認させていただきます。'
  );

  const itemsById = getItemsById_(form);

  const language = requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.language).asMultipleChoiceItem();
  const jaPage = requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.jaPage).asPageBreakItem();
  const enPage = requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.enPage).asPageBreakItem();

  language
    .setTitle('Language / 言語')
    .setHelpText('Please select your preferred language. / ご希望の言語を選択してください。')
    .setRequired(true)
    .setChoices([
      language.createChoice('日本語', jaPage),
      language.createChoice('English', enPage),
    ]);

  jaPage.setTitle('日本語');
  enPage.setTitle('English').setGoToPage(FormApp.PageNavigationType.SUBMIT);

  const ja = getLocalizedItems_(itemsById, SUPPORT_FORM_ITEM_IDS.ja);
  const en = getLocalizedItems_(itemsById, SUPPORT_FORM_ITEM_IDS.en);

  configureJapaneseItems_(ja);
  configureEnglishItems_(en);

  const jaAutoHeader = findOrAddSectionHeader_(
    form,
    SUPPORT_FORM_TITLES.jaAutoHeader,
    SUPPORT_FORM_TITLES.jaAutoHelpText,
    [SUPPORT_FORM_TITLES.legacyJaAutoHeader]
  );
  const enAutoHeader = findOrAddSectionHeader_(
    form,
    SUPPORT_FORM_TITLES.enAutoHeader,
    SUPPORT_FORM_TITLES.enAutoHelpText,
    [SUPPORT_FORM_TITLES.legacyEnAutoHeader]
  );

  const desiredOrderIds = [
    SUPPORT_FORM_ITEM_IDS.language,
    SUPPORT_FORM_ITEM_IDS.jaPage,
    SUPPORT_FORM_ITEM_IDS.ja.inquiryType,
    SUPPORT_FORM_ITEM_IDS.ja.details,
    SUPPORT_FORM_ITEM_IDS.ja.email,
    jaAutoHeader.getId(),
    SUPPORT_FORM_ITEM_IDS.ja.app,
    SUPPORT_FORM_ITEM_IDS.ja.os,
    SUPPORT_FORM_ITEM_IDS.ja.osVersion,
    SUPPORT_FORM_ITEM_IDS.ja.appVersion,
    SUPPORT_FORM_ITEM_IDS.ja.buildNumber,
    SUPPORT_FORM_ITEM_IDS.ja.store,
    SUPPORT_FORM_ITEM_IDS.ja.deviceModel,
    SUPPORT_FORM_ITEM_IDS.enPage,
    SUPPORT_FORM_ITEM_IDS.en.inquiryType,
    SUPPORT_FORM_ITEM_IDS.en.details,
    SUPPORT_FORM_ITEM_IDS.en.email,
    enAutoHeader.getId(),
    SUPPORT_FORM_ITEM_IDS.en.app,
    SUPPORT_FORM_ITEM_IDS.en.os,
    SUPPORT_FORM_ITEM_IDS.en.osVersion,
    SUPPORT_FORM_ITEM_IDS.en.appVersion,
    SUPPORT_FORM_ITEM_IDS.en.buildNumber,
    SUPPORT_FORM_ITEM_IDS.en.store,
    SUPPORT_FORM_ITEM_IDS.en.deviceModel,
  ];

  desiredOrderIds.forEach((id, index) => {
    form.moveItem(requireItem_(getItemsById_(form), id), index);
  });

  logSupportFormOrder();
  Logger.log('Published URL: ' + form.getPublishedUrl());
}

function logSupportFormOrder() {
  const form = FormApp.getActiveForm();
  form.getItems().forEach((item, index) => {
    Logger.log(
      index + ': id=' + item.getId() + ' type=' + item.getType() + ' title=' + item.getTitle()
    );
  });
}

function getItemsById_(form) {
  const itemsById = {};
  form.getItems().forEach((item) => {
    itemsById[item.getId()] = item;
  });
  return itemsById;
}

function requireItem_(itemsById, id) {
  const item = itemsById[id];
  if (!item) {
    throw new Error('対象フォームに必要な既存項目が見つかりません: item id=' + id);
  }
  return item;
}

function getLocalizedItems_(itemsById, ids) {
  return {
    app: requireItem_(itemsById, ids.app).asListItem(),
    inquiryType: requireItem_(itemsById, ids.inquiryType).asMultipleChoiceItem(),
    details: requireItem_(itemsById, ids.details).asParagraphTextItem(),
    deviceModel: requireItem_(itemsById, ids.deviceModel).asTextItem(),
    os: requireItem_(itemsById, ids.os).asTextItem(),
    osVersion: requireItem_(itemsById, ids.osVersion).asTextItem(),
    appVersion: requireItem_(itemsById, ids.appVersion).asTextItem(),
    buildNumber: requireItem_(itemsById, ids.buildNumber).asTextItem(),
    store: requireItem_(itemsById, ids.store).asTextItem(),
    email: requireItem_(itemsById, ids.email).asTextItem(),
  };
}

function configureJapaneseItems_(items) {
  items.inquiryType
    .setTitle('お問い合わせ内容の種類')
    .setChoiceValues([
      '質問',
      '不具合の報告',
      '機能追加の要望',
      '購入・サブスクリプション',
      'プライバシー・利用規約',
      'その他',
    ])
    .setRequired(true);
  items.details.setTitle('お問い合わせ内容の詳細').setRequired(true);
  items.email
    .setTitle('メールアドレス')
    .setHelpText('返信をご希望の場合のみご記入ください。')
    .setRequired(false);

  items.app.setTitle('アプリ').setRequired(false);
  items.os.setTitle('OS').setRequired(false);
  items.osVersion.setTitle('OSバージョン').setRequired(false);
  items.appVersion.setTitle('アプリバージョン').setRequired(false);
  items.buildNumber.setTitle('ビルド番号').setRequired(false);
  items.store.setTitle('ストア').setRequired(false);
  items.deviceModel.setTitle('端末名').setRequired(false);
}

function configureEnglishItems_(items) {
  items.inquiryType
    .setTitle('Inquiry type')
    .setChoiceValues([
      'Question',
      'Bug report',
      'Feature request',
      'Purchase or subscription',
      'Privacy or terms',
      'Other',
    ])
    .setRequired(true);
  items.details.setTitle('Details').setRequired(true);
  items.email
    .setTitle('Email address')
    .setHelpText('Please enter this only if you would like a reply.')
    .setRequired(false);

  items.app.setTitle('App').setRequired(false);
  items.os.setTitle('Operating system').setRequired(false);
  items.osVersion.setTitle('OS version').setRequired(false);
  items.appVersion.setTitle('App version').setRequired(false);
  items.buildNumber.setTitle('Build number').setRequired(false);
  items.store.setTitle('Store').setRequired(false);
  items.deviceModel.setTitle('Device model').setRequired(false);
}

function findOrAddSectionHeader_(form, title, helpText, legacyTitles) {
  const titles = [title].concat(legacyTitles || []);
  const existing = form.getItems(FormApp.ItemType.SECTION_HEADER)
    .map((item) => item.asSectionHeaderItem())
    .find((item) => titles.indexOf(item.getTitle()) !== -1);

  if (existing) {
    return existing.setTitle(title).setHelpText(helpText);
  }

  return form.addSectionHeaderItem().setTitle(title).setHelpText(helpText);
}
