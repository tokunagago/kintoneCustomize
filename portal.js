(() => {
    'use strict';
    // ポータルにボタンを表示
    kintone.events.on('portal.show', () => {
        // ポータル上部の空白部分を取得
        const portalSpaceElement = kintone.portal.getContentSpaceElement();

        const appButton = document.createElement('button');
        appButton.textContent = 'XXX アプリ';
        appButton.style.margin = '15px 0 0 8px';
        appButton.onclick = () => alert('appButtonを押しました');

        portalSpaceElement.appendChild(appButton);
    });
})();
