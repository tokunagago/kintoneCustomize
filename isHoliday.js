// 選択した日付が祝日か判定する
(() => {
    'use strict';
    kintone.events.on('app.record.detail.show', event => {
        console.log(event.record.date.value);
        // APIキーを生成 https://developers.google.com/calendar/api/quickstart/js
        const API_KEY = '{APIキーを生成して設定する}';
        const CALENDAR_ID = 'ja.japanese#holiday@group.v.calendar.google.com';
        const GAPI_PATH = 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(CALENDAR_ID) + '/events';

        function start() {
            gapi.client.init({
              'apiKey': API_KEY,
            }).then(function() {
              return gapi.client.request({
                'path': 'https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(CALENDAR_ID) + '/events'
              })
            }).then(function(response) {
              // let resultArea = kintone.app.record.getSpaceElement('space');
              let items = response.result.items;
              for(let i = 0; i < items.length; i++){
                  if (items[i].start.date === event.record.date.value) {
                      kintone.app.record.getFieldElement('date').style.color = '#ff0000';
                      break;
                  }
                // resultArea.insertAdjacentHTML('beforeend', items[i].summary + items[i].start.date + '<br>');
              }
            }, function(reason) {
              console.log('Error: ' + reason.result.error.message);
            });
          };
          gapi.load('client', start);
          return event;
    });
})();