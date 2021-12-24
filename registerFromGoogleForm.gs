function registerGoogleFormToKintone(event) {
    const API_TOKEN = 'XXXXXXXXXXXX';
    const APP_ID = 'XXX';

    const itemResponses = event.response.getItemResponses();

    let insertData = '[{';
    for (let i = 0; i < itemResponses.length; i++) {
      let itemResponse = itemResponses[i];
      if (itemResponse.getItem().getTitle() == '名前') {
        insertData += Utilities.formatString('"名前": { "value" : "%s" },', itemResponse.getResponse());
      } else if (itemResponse.getItem().getTitle() == '住所') {
        insertData += Utilities.formatString('"住所": { "value" : "%s" }', itemResponse.getResponse());
      }
    }
    insertData += '}]';

    const records = JSON.parse(insertData);
    if (records.length) {
      const apps = {
        APP: {
          appid: APP_ID,
          token: API_TOKEN
        }
      };
      const kintoneManager = new KintoneManager.KintoneManager("33hm3rm0va23", apps);
      const kintoneResponse = kintoneManager.create("APP", records);
      const statusCode = kintoneResponse.getResponseCode();
      Logger.log(`STATUS CODE : ${statusCode}`);
    }
}