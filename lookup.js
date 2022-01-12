(function() {
    "use strict";
    // コンストラクタ定義
    var MyLookUp = (function(fieldSettings){
      function MyLookUp(fieldSettings) {
        this.fieldSettings = fieldSettings;
      }
      // 関数がオブジェクト形式でいくつかある createModal など
      MyLookUp.prototype = {
        createModal: function(){
          var _this = this;
          console.log(`10行目 this : ${this}`);
          this.modal = document.createElement('div');
          this.modalTable = document.createElement('table');
          this.modalTbody = document.createElement('tbody');
          this.modal.classList.add('lookUpModal');
          this.modalTable.classList.add('lookUpModalTable');
          this.modalTable.innerHTML = (
            '<thead><tr>' +
            this.fieldSettings.viewFields.reduce(function(columns, viewField){ // reduce調べる
              return columns + '<th>' + viewField + '</th>';  // return 調べる
            }, '') +
            '<th>取得</th>' +
            '</tr></thead>'
          );
          this.modal.addEventListener('click', function(e){
            if(e.target === _this.modal){
              _this.removeModal();
            }
          });
          this.modalTbody.addEventListener('click', function(e){
            if(e.target.classList.contains('modalGetButton')){
              _this.copyDatas(_this.records[e.target.getAttribute('data-index')]);
            }
          });
          this.modalTable.appendChild(this.modalTbody);
          this.modal.appendChild(this.modalTable);
          document.body.appendChild(this.modal);
          return this;
        },
        showModal: function(){
          var _this = this;
          this.modalTbody.innerHTML =(
            _this.records.reduce(function(rows, record, index){
              return (
                rows +
                '<tr>' +
                _this.fieldSettings.viewFields.reduce(function(columns, viewField){
                  return columns + '<td>' + record[viewField].value + '</td>';
                }, '') +
                '<td><a class="modalGetButton" data-index="' + index + '">取得</a></td>' +
                '</tr>'
              )
            }, '')
          );
          this.modal.classList.add('on');
        },
        removeModal: function(){
          this.modal.classList.remove('on');
        },
        createGetButton: function(){
          var _this = this;
          this.getButton = document.createElement('a');
          this.getButton.innerHTML = '取得';
          this.getButton.classList.add('lookUpButton');
          this.getButton.addEventListener('click', function(){
            var query;
            _this.event = kintone.app.record.get();
            if(_this.event.record[_this.fieldSettings.copyField.to].value){
              query = _this.fieldSettings.copyField.from + '="' + _this.event.record[_this.fieldSettings.copyField.to].value + '"';
              if(_this.fieldSettings.query)
                query += (' and ' + _this.fieldSettings.query);
            }else{
              query = _this.fieldSettings.query;
            }
            kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
              app: _this.fieldSettings.apps[_this.event.record[_this.fieldSettings.appSelectField].value],
              query: query + _this.fieldSettings.sort
            }).then(function(response){
              if(!response.records.length){
                alert('データがありません。');
              }else if(response.records.length === 1){
                _this.copyDatas(response.records[0]);
              }else{
                _this.records = response.records;
                _this.showModal(response.records);
              }
            });
          });
          return this;
        },
        createClearButton: function(){
          var _this = this;
          this.clearButton = document.createElement('a');
          this.clearButton.classList.add('lookUpButton');
          this.clearButton.innerHTML = 'クリア';
          this.clearButton.addEventListener('click', function(){
            _this.clearDatas();
          });
          return this.clearButton;
        },
        showButtons: function(){
          kintone.app.record.getSpaceElement(this.fieldSettings.buttonSpace).appendChild(this.getButton);
          kintone.app.record.getSpaceElement(this.fieldSettings.buttonSpace).appendChild(this.createClearButton());
          return this;
        },
        copyDatas: function(record){
          var _this = this;
          this.event.record[this.fieldSettings.copyField.to].value = record[this.fieldSettings.copyField.from].value;
          this.fieldSettings.otherCopyFields.forEach(function(otherCopyField){
            _this.event.record[otherCopyField.to].value = record[otherCopyField.from].value;
          });
          this.event.record[this.fieldSettings.recordIdField].value = record.レコード番号.value;
          kintone.app.record.set(this.event);
          this.removeModal();
          //alert('参照先からデータが取得されました。');
        },
        clearDatas: function(record){
          var _this = this;
          this.event = kintone.app.record.get();
          this.event.record[this.fieldSettings.copyField.to].value = null;
          this.fieldSettings.otherCopyFields.forEach(function(otherCopyField){
            _this.event.record[otherCopyField.to].value = null;
          });
          this.event.record[this.fieldSettings.recordIdField].value = null;
          kintone.app.record.set(this.event);
        },
        disableOtherCopyFields: function(event){
          this.fieldSettings.otherCopyFields.forEach(function(otherCopyField){
            event.record[otherCopyField.to].disabled = true;
          });
          event.record[this.fieldSettings.recordIdField].disabled = true;
          //kintone.app.record.setFieldShown(this.fieldSettings.recordIdField, false);
          return event;
        },
        createLink: function(event){
          kintone.app.record.getFieldElement(this.fieldSettings.copyField.to).innerHTML = (
            '<a href="../' +
            this.fieldSettings.apps[event.record[this.fieldSettings.appSelectField].value] +
            '/show#record=' +
            event.record[this.fieldSettings.recordIdField].value +
            '" target="_blank">' +
            event.record[this.fieldSettings.copyField.to].value +
            '</a>'
          );
        },
        createLinks: function(event){
          var _this = this;
          event.records.forEach(function(record, index){
            kintone.app.getFieldElements(_this.fieldSettings.copyField.to)[index].innerHTML = (
              '<div><a href="../' +
              _this.fieldSettings.apps[record[_this.fieldSettings.appSelectField].value] +
              '/show#record=' +
              record[_this.fieldSettings.recordIdField].value +
              '" target="_blank">' +
              record[_this.fieldSettings.copyField.to].value +
              '</a></div>'
            );
          });
        }
      }
      return MyLookUp;
    })();


    var lookUpParams = {
      appSelectField: 'マスタ', //関連付けるアプリを決めるフィールド
      buttonSpace: 'lookUpButton', //ボタン設置用のスペースフィールド
      recordIdField: '参照ID', //参照レコードのレコード番号保存用のフィールド
      apps: { //関連付けるアプリ
        マスタA: 77, //関連付けるアプリを決めるフィールドのvalue: アプリID
        マスタB: 78,
      },
      copyField: {
        to: 'ルックアップ', //自作のルックアップフィールド
        from: '数値' //コピー元のフィールド
      },
      otherCopyFields: [ //ほかのフィールドのコピー
        {to: '文字列コピー', from: '文字列'},
        {to: '日付コピー', from: '日付'},
      ],
      viewFields: ['レコード番号', '数値', '文字列', '日付'], //コピー元のレコードの選択時に表示するフィールド
      query: ' 更新日時 > "2018-07-27T09:00:00+0900" ', //絞り込み
      sort: ' order by レコード番号 asc ' //ソート
    };


    var lookUP = new MyLookUp(lookUpParams).createGetButton().createModal();
    kintone.events.on([
      'app.record.index.show'
    ], function(event){
      return lookUP.createLinks(event);
    });
    kintone.events.on([
      'app.record.detail.show'
    ], function(event){
      return lookUP.createLink(event);
    });
    kintone.events.on([
      'app.record.create.show',
      'app.record.edit.show'
    ], function(event){
      lookUP.event = event;
      return lookUP.showButtons().disableOtherCopyFields(event);
    });
  })();