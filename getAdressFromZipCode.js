(() => {
    'use strict';


    const eventsShowAndEdit = [
        'app.record.create.show',
        'app.record.edit.show'
    ];
    let button;
    kintone.events.on(eventsShowAndEdit, event => {
        console.log('表示イベント発生');
        button = document.createElement('button');
        button.textContent = '住所取得';
        const space = kintone.app.record.getSpaceElement('zipCodeButtonSpace').appendChild(button);
        console.log('表示イベント返却');
        return event;
    });

    const eventsZipCodeChange = [
        'app.record.create.change.zipCode',
        'app.record.edit.change.zipCode'
    ];
    kintone.events.on(eventsZipCodeChange, event => {
        console.log("変更イベント発生")
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
                //const obj = JSON.parse(response);
                console.log('response : ' + response);
                const obj = JSON.parse(response[0]);
                //const address = obj.results[0].address1 + obj.results[0].address2 + 3
                console.log("都道府県 : " + obj.results[0].address1);
                console.log("市区町村 : " + obj.results[0].address2);
                const address = obj.results[0].address1 + obj.results[0].address2;

                // eventオブジェクトに値を入れて return すれば
                // event.record['address'].value = String(address);

                const recordObj = kintone.app.record.get();
                recordObj.record.address.value = address;
                kintone.app.record.set(recordObj);

                console.log("変更イベント返却")
                return event;
            });
            // console.log("終了1");
            // return event;
        }
        // console.log("終了2");
        // return event;
    });
})();