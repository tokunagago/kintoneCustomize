/*
 * 同一レコードを編集したのユーザーがいればアラートを表示する
 * レコード詳細画面表示時／レコードの編集ボタンクリック時、レコードが変更されていたらアラートを表示して再読み込みする
 */
(() => {
    'use strict';
    kintone.events.on(['app.record.detail.show', 'app.record.edit.show'], event => {
        const body = {
            app: kintone.app.getId(),
            id: kintone.app.record.getId(),
        };
        kintone.api(kintone.api.url('/k/v1/record'), 'GET', body).then((response) => {
            if (response.record.$revision.value !== event.record.$revision.value) {
                if (window.confirm('レコードが更新されているため、再読み込みしてからレコードを表示します。')) {
                    location.reload();
                }
            }
        })
    });
})();