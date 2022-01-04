// 関連レコードを自作
(() => {
  'use strict';
  // 案件内容とリンクだけ表示してみる
  const PROJECT_MANAGEMENT_APP_ID = 63;
  kintone.events.on('app.record.detail.show', (event) => {
      // 会社名が一致するレコードを取得
      const qurey = 'companyName = \"' + event.record.companyName.value + '\"';
      const body = {
        'app': PROJECT_MANAGEMENT_APP_ID,
        'query': qurey,
        'fields': ['content']
      };
      const relatedRecordSpace = kintone.app.record.getSpaceElement('relatedRecord');

      kintone.api(kintone.api.url('/k/v1/records.json'), 'GET', body, response => {
          for (let i = 0; i < response.records.length; i++) {
            console.log(`RESONSE : ${response.records[i].content.value}`);
            relatedRecordSpace.innerText += response.records[i].content.value + '\n';
          }
      }, error => {
        console.log(`ERROR : ${error}`);
      });
  });
})();
