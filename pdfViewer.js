(() => {
  'use strict';
  kintone.events.on('app.record.detail.show', (event) => {
    if (!event.record.pdf.value[0]) return;

    const fileKey = event.record.pdf.value[0].fileKey;
    const URL = 'https://`subdomain`.cybozu.com/k/v1/file.json?fileKey=' + fileKey;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', URL);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.responseType = 'blob';
    xhr.onload = function() {
      if (xhr.status === 200) {
        // const blob = new Blob([xhr.response]);
        var url = window.URL || window.webkitURL;
        // const blobUrl = url.createObjectURL(blob);
        const blobUrl = url.createObjectURL(xhr.response);
        const spaceElement = kintone.app.record.getSpaceElement('space');
        const objectElement = document.createElement('object');
        objectElement.data = blobUrl;
        let preview = '<object data="' + blobUrl + '" type="application/pdf" width="100%" height="100%">';
        preview += '</object>';
        $(spaceElement).append(preview).css('height', '500');
      } else {
        console.log(xhr.response.Text);
      }
    };
    xhr.send();
  });
})();