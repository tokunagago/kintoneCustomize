(() => {
    'use strict';

    kintone.events.on('app.record.create.submit.success', event => {
        console.log(`event.record.authorizer : ${event.record.authorizer}`);
        const body = {
            'action': '申請する',
            'app': event.appId,
            'assignee': event.record.authorizer.value[0].code,
            'id': event.recordId,
            'revision': 1
        };

        return kintone.api(kintone.api.url('/k/v1/record/status.json', true), 'PUT', body).then(resp => {
            alert('申請するボタンを実行しました');
            return event;
        }, error => {
            alert(error.message);
            return event;
        });
    });

})();