(function() {
    'use strict';

    // 一覧画面の編集ボタンを非表示
    kintone.events.on('app.record.index.show', function(event) {
      const editButton  = document.getElementsByClassName('recordlist-edit-gaia');
      for (let i = 0; i < editButton.length; i++) {
        editButton[i].style.display = 'none';
      }
    });

    // 徳永剛だったらグループフィールドを開く
    // console.log(`kintone.getLoginUser().name : ${kintone.getLoginUser().name}`);
    kintone.events.on('app.record.detail.show', event => {
        if (kintone.getLoginUser().name ===  '徳永剛') {
            kintone.app.record.setGroupFieldOpen('グループ1', true);
        }
        return event;
    });

    // チェックボックスにチェックがついてたらレコード詳細画面からの削除を実行できない
    kintone.events.on('app.record.detail.delete.submit', event => {
        if (event.record.削除フラグ.value[0] === 'チェックをつけると削除不可') {
            // 削除はされないがエラーメッセージが表示されない。バグの可能性あり↓。
            // https://krew.zendesk.com/hc/ja/articles/360012259294--修正済-保存実行前イベント内でevent-errorにてエラーを設定した場合-ステータスバーにエラーメッセージが表示されない
            event.error = '削除フラグにチェックが付いています。削除するには削除フラグのチェックを外してください。';
            return event;
        }
    });

    // ポータルにボタンを表示 (kintoneシステム管理 > カスタマイズ > JavaScript / CSSでカスタマイズ で設定する)
    kintone.events.on('portal.show', () => {
        // ポータル上部の空白部分を取得
        const portalSpaceElement = kintone.portal.getContentSpaceElement();

        const appButton = document.createElement('button');
        appButton.textContent = 'XXX アプリ';
        appButton.style.margin = '15px 0 0 8px';
        appButton.onclick = () => alert('appButtonを押しました');

        portalSpaceElement.appendChild(appButton);
    });

    // 日付選択肢の曜日表示 → 日付を選択したら、スペースフィールドに曜日を表示させる
    kintone.events.on('app.record.edit.change.日付', event => {
        const date = luxon.DateTime.fromISO(event.record.日付.value);
        // 曜日
        console.log(date.setLocale('ja').toFormat('EEEE'));
        // スペースフィールドに値を入れる
        kintone.app.record.getSpaceElement('dayOfWeek').textContent = '\n\n' + date.setLocale('ja').toFormat('EEEE');
        return event;
    });

    // ツールチップ
    kintone.events.on('app.record.detail.show', event => {
      console.log("aaa");
      tippy(kintone.app.record.getFieldElement('ツールチップ'), {
        content: 'ツールチップのテスト',
        arrow: true
      })
    });

    // サブテーブル内のラジオボタンの値で同一行の特定フィールドの編集可・不可を切り替える
    kintone.events.on('app.record.edit.change.ラジオボタン', event => {
      const tableRow = event.changes.row;
      tableRow.value['サブテーブルの文字列']['disabled'] = tableRow.value['ラジオボタン'].value === '表示' ? false : true;
      return event;
    });

    // 【デバッグ編】フィールドの表示/非表示制御
    const events = [
        'app.record.detail.show',
        'app.record.create.show',
        'app.record.edit.show',
        'app.record.edit.change.countries',
        'app.record.edit.change.countries'
      ]
    kintone.events.on(events, event => {
      console.log(`event : ${event}`);
      const countries = event.record['countries']['value'];
      // 初期状態
      if (countries.length === 0) {
        kintone.app.record.setFieldShown('country', false);
      }
      /*
       * 【デバッグ編の問題説明】
       * 前提
       * 行ってみたい国を「複数選択」フィールドで複数選択できる
       * 1つ国を選択しても何も起きない
       * 2つ以上選択したら、「その中でも一番言ってみたい国は?」という文字列（1行）フィールドが表示される
       * 2つ以上選択した状態から1つを選択した状態にしても「その中でも一番言ってみたい国は?」が表示されたままになっている
       * 問題
       * 2つ選択した状態から1つ選択した状態にしたら、文字列フィールドは消すにはどうすればいいか
       */

      // 答え
      // 1つ以下が選択されたら非表示にする処理を加える
      // if (countries.length <= 1) {
      //   kintone.app.record.setFieldShown('country', false);
      // }

      // 2つ以上選択されてから「その中でも一番言ってみたい国は?」を表示
      if (countries.length >= 2) {
        // trueのタイポ
        kintone.app.record.setFieldShown('country', ture);
        //kintone.app.record.setFieldShown('country', true);
      }
    });
  })();
