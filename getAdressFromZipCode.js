(() => {
    'use strict';

    const eventsShowAndEdit = [
        'app.record.create.show',
        'app.record.edit.show'
    ];
    let button;
    kintone.events.on(eventsShowAndEdit, event => {
        button = document.createElement('button');
        button.textContent = '住所取得';
        kintone.app.record.getSpaceElement('zipCodeButtonSpace').appendChild(button);
        return event;
    });

    const eventsZipCodeChange = [
        'app.record.create.change.zipCode',
        'app.record.edit.change.zipCode'
    ];
    kintone.events.on(eventsZipCodeChange, event => {
        const zipCode = event.record.zipCode.value;
        if (String(zipCode).length !== 7) {
            console.log("7文字ではないため終了");
            return event;
        }
        button.onclick = () => {
            console.log(`event : ${event}`);
            console.log(`zipCode : ${zipCode}`);
            const URL = 'https://zip-cloud.appspot.com/api/search?zipcode=' + zipCode;
            kintone.proxy(URL, 'GET', {}, {}).then(response => {
                console.log('response : ' + response);
                const obj = JSON.parse(response[0]);
                console.log("都道府県 : " + obj.results[0].address1);
                console.log("市区町村 : " + obj.results[0].address2);
                const address = obj.results[0].address1 + obj.results[0].address2;

                // eventオブジェクトに値を入れて return すれば良いと思ったが反映されず
                // event.record['address'].value = String(address);

                // kintone.events.on のイベントハンドラ内で kintone.app.record.get はできないと思ったができた。
                const recordObj = kintone.app.record.get();
                recordObj.record.address.value = address;
                kintone.app.record.set(recordObj);
                return event;
            });
        }
    });
})();