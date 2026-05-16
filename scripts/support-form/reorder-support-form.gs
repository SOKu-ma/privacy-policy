/**
 * Updates the existing "App Support / アプリに関するお問い合わせ" Google Form.
 *
 * This keeps existing fields whenever possible. The only intentional rebuild is
 * the app-name field: the old dropdown is replaced with a text field because the
 * app name is normally prefilled from each app.
 *
 * Run this from Apps Script bound to the target Google Form:
 * Extensions > Apps Script > paste this file > run reorderSupportFormForLowerCognitiveLoad().
 */
const SUPPORT_FORM_ITEM_IDS = {
  language: 1197277288,
  jaPage: 1040451078,
  enPage: 1470373665,
  ja: {
    legacyAppDropdown: 1571161321,
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
    legacyAppDropdown: 598771427,
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

  const ja = getLocalizedItems_(form, itemsById, SUPPORT_FORM_ITEM_IDS.ja);
  const en = getLocalizedItems_(form, itemsById, SUPPORT_FORM_ITEM_IDS.en);

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
    ja.app.getId(),
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
    en.app.getId(),
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
  logSupportFormPrefillUrl();
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

function getLocalizedItems_(form, itemsById, ids) {
  return {
    app: ensureTextItem_(form, itemsById, ids.legacyAppDropdown),
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

  items.app
    .setTitle('アプリ')
    .setHelpText('アプリ内から開いた場合は自動入力されます。必要な場合のみ修正してください。')
    .setRequired(false);
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

  items.app
    .setTitle('App')
    .setHelpText('This is filled in automatically when opened from the app. Edit it only if necessary.')
    .setRequired(false);
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

function ensureTextItem_(form, itemsById, legacyItemId) {
  const legacyItem = itemsById[legacyItemId];
  if (legacyItem) {
    if (legacyItem.getType() === FormApp.ItemType.TEXT) {
      return legacyItem.asTextItem();
    }

    form.deleteItem(legacyItem);
  }

  const expectedTitle = legacyItemId === SUPPORT_FORM_ITEM_IDS.ja.legacyAppDropdown ? 'アプリ' : 'App';
  const existingTextItem = findTextItemByTitle_(form, expectedTitle);
  if (existingTextItem) {
    return existingTextItem;
  }

  return form.addTextItem().setTitle(expectedTitle);
}

function findTextItemByTitle_(form, title) {
  const textItems = form.getItems(FormApp.ItemType.TEXT).map((item) => item.asTextItem());
  return textItems.find((item) => item.getTitle() === title) || null;
}

function logSupportFormPrefillUrl() {
  const form = FormApp.getActiveForm();
  const items = getCurrentSupportItemsForPrefill_(form);
  requirePrefillTextItem_(items.ja.app, 'アプリ');
  requirePrefillTextItem_(items.en.app, 'App');
  const response = form.createResponse();

  response.withItemResponse(items.language.createResponse('English'));
  response.withItemResponse(items.ja.inquiryType.createResponse('質問'));
  response.withItemResponse(items.ja.details.createResponse('__JA_DETAILS__'));
  response.withItemResponse(items.ja.email.createResponse('ja@example.com'));
  response.withItemResponse(items.ja.app.createResponse('__JA_APP__'));
  response.withItemResponse(items.ja.os.createResponse('__JA_OS__'));
  response.withItemResponse(items.ja.osVersion.createResponse('__JA_OS_VERSION__'));
  response.withItemResponse(items.ja.appVersion.createResponse('__JA_APP_VERSION__'));
  response.withItemResponse(items.ja.buildNumber.createResponse('__JA_BUILD_NUMBER__'));
  response.withItemResponse(items.ja.store.createResponse('__JA_STORE__'));
  response.withItemResponse(items.ja.deviceModel.createResponse('__JA_DEVICE_MODEL__'));

  response.withItemResponse(items.en.inquiryType.createResponse('Question'));
  response.withItemResponse(items.en.details.createResponse('__EN_DETAILS__'));
  response.withItemResponse(items.en.email.createResponse('en@example.com'));
  response.withItemResponse(items.en.app.createResponse('__EN_APP__'));
  response.withItemResponse(items.en.os.createResponse('__EN_OS__'));
  response.withItemResponse(items.en.osVersion.createResponse('__EN_OS_VERSION__'));
  response.withItemResponse(items.en.appVersion.createResponse('__EN_APP_VERSION__'));
  response.withItemResponse(items.en.buildNumber.createResponse('__EN_BUILD_NUMBER__'));
  response.withItemResponse(items.en.store.createResponse('__EN_STORE__'));
  response.withItemResponse(items.en.deviceModel.createResponse('__EN_DEVICE_MODEL__'));

  Logger.log('Prefilled URL for entry ID extraction: ' + response.toPrefilledUrl());
}

function requirePrefillTextItem_(item, title) {
  if (!item) {
    throw new Error('事前入力URL生成に必要なテキスト項目が見つかりません: ' + title);
  }
}

function getCurrentSupportItemsForPrefill_(form) {
  const itemsById = getItemsById_(form);
  return {
    language: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.language).asMultipleChoiceItem(),
    ja: {
      inquiryType: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.ja.inquiryType).asMultipleChoiceItem(),
      details: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.ja.details).asParagraphTextItem(),
      email: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.ja.email).asTextItem(),
      app: findTextItemByTitle_(form, 'アプリ'),
      os: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.ja.os).asTextItem(),
      osVersion: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.ja.osVersion).asTextItem(),
      appVersion: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.ja.appVersion).asTextItem(),
      buildNumber: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.ja.buildNumber).asTextItem(),
      store: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.ja.store).asTextItem(),
      deviceModel: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.ja.deviceModel).asTextItem(),
    },
    en: {
      inquiryType: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.en.inquiryType).asMultipleChoiceItem(),
      details: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.en.details).asParagraphTextItem(),
      email: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.en.email).asTextItem(),
      app: findTextItemByTitle_(form, 'App'),
      os: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.en.os).asTextItem(),
      osVersion: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.en.osVersion).asTextItem(),
      appVersion: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.en.appVersion).asTextItem(),
      buildNumber: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.en.buildNumber).asTextItem(),
      store: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.en.store).asTextItem(),
      deviceModel: requireItem_(itemsById, SUPPORT_FORM_ITEM_IDS.en.deviceModel).asTextItem(),
    },
  };
}
