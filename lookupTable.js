(() => {
    'use strict';

    const events = [
        'app.record.create.change.number',
        'app.record,edit.change.number'
    ]
    kintone.events.on(events, event => {
        const body = {
            app: kintone.app.getLookupTargetAppId('lookup'),
            id: event.record['number'].value
        }
        kintone.api(kintone.api.url('/k/v1/record', true), 'GET', body, response => {
            event.record['table'].value = response.record['table'].value;
            kintone.app.record.set(event);
        }, error => {
            console.log(`ERROR : ${error.message}`);
        });
    });
})();