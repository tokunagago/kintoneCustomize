(() => {
  'use strict';
  kintone.events.on('app.record.index.show', (event) => {
    console.log('test ui componet');

    // ボタン
    const button = new Kuc.Button({
      text: '送信',
      type: 'submit',
    });
    button.addEventListener('click', (event) => {
      console.log(event);
    });

    // チェックボックス
    const checkbox = new Kuc.Checkbox({
      className: '',
      // error: 'エラーが発生しました',
      id: 'ui-component-id',
      // itemLayout: 'vertical',
      requiredIcon: true,
      items: [
        { label: 'orange', value: 'Orange' },
        { label: 'apple', value: 'Apple' },
      ],
      borderVisible: false,
    });

    // ポップアップ通知
    const notification = new Kuc.Notification({
      text: '通知のテスト',
      type: 'info',
      duration: 5000,
    });
    // notification.open();
    notification.addEventListener('close', (event) => {
      console.log(`event : ${event}`);
    });

    // ローディングスピナー
    const spinner = new Kuc.Spinner({
      text: 'ロード中',
    });
    spinner.open();
    setTimeout(() => {
      spinner.close();
    }, 1000);

    // テキストボックス
    const text = new Kuc.Text({
      // label: 'ラベル テスト',
      placeholder: 'プレースホルダー テスト',
      // prefix: 'プリフィックス テスト',
      // suffix: 'サフィックス テスト',
      textAlign: 'right',
      // requiredIcon: true
    });

    kintone.app.getHeaderMenuSpaceElement().appendChild(text);
  });
})();
