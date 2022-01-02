(() => {
  'use strict';

  const eventsShowAndEdit = ['app.record.detail.show'];
  kintone.events.on(eventsShowAndEdit, (event) => {
    let button = document.createElement('button');
    button.textContent = 'スレッドに投稿';
    kintone.app.record.getSpaceElement('space').appendChild(button);

    button.onclick = () => {
      const body = {
        space: 3,
        thread: 6,
        comment: {
          text: event.record.text.value,
        },
      };
      kintone.api(
        kintone.api.url('/k/v1/space/thread/comment.json'),
        'POST',
        body,
        (response) => {
          alert('スレッドに登録しました。投稿済みフラグを更新します。');
          console.log(`response : ${response}`);
          const body = {
            app: kintone.app.getId(),
            id: kintone.app.record.getId(),
            record: {
              postThreadFlg: {
                value: '投稿済み',
              },
            },
          };
          kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body, function(resp) {
            // success
            console.log('投稿フラグを更新しました');
            location.reload();
            console.log(resp);
          }, function(error) {
            // error
            console.log('投稿フラグの更新に失敗しました');
            console.log(error);
          });
        },
        (error) => {
          console.log('スレッドへ投稿するAPIでエラーが発生しました');
          console.log(`error : ${error}`);
        }
      );
    };
  });
})();
