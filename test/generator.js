'use strict';

import assert from 'power-assert';
import Generator from '../src/generator';

var fs = require('fs');


describe('Generator', () => {

  var create = () => {
    return new Generator();
  }

  describe('constructor', () => {

    it('単純にコンストラクタが動くか', () => {
      assert(create() instanceof Generator);
    });

    it('インスタンス生成直後のpropsはだいたいnull', () => {
      var i = create();
      assert(i.get('title') === null);
      assert(i.get('urls.pc')      === null);
      assert(i.get('urls.ios')     === null);
      assert(i.get('urls.android') === null);
    });
  });

  describe('set / get', () => {
    it('1階層のpropsを操作することができる', () => {
      var actual = create()
        .set('title', 'hoge')
        .get('title');
      assert(actual === 'hoge');
    });
    it('2階層のpropsを操作する事ができる', () => {
      var actual = create()
        .set('urls.ios', 'https://ios.com')
        .get('urls.ios');
      assert(actual === 'https://ios.com');
    });
  });

  describe('htmlを吐き出すことができる', () => {
    it('吐き出されたhtmlの出力パスを取得することができる', () => {
      var actual = create()
        .set('title', 'hoge')
        .generateSync();
      assert(typeof actual === 'string');
    });
    it('xxx.htmlで終わるN文字の文字列である', () => {
      var actual = create()
        .set('title', 'hoge')
        .filename();

      // timestamp + 8文字の乱数 + .htmlで決まることを期待している
      assert(/\.html$/.test(actual));
      assert(actual.length === 10+8+5);
    });
    it('出力したファイルが存在することを確認することができる', () => {
      var path = create()
        .set('title', 'hoge')
        .generateSync();
      assert(fs.statSync(path));
    });
  });

  describe('htmlにリダイレクトの情報が入力されている', () => {
    it('iosのみを指定するとiosのurlだけがhtmlに出力されている', () => {
      var actual = create()
        .set('urls.ios', 'https://ios.com')
        .set('title', 'iOS only')
        .toHtml();
      assert(actual, `
<title>iOS only</title>
<script>
  if(navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0)
  {
    window.location.href = 'https://ios.com';
  }

</script>
<body>
  <ul>
    <li>iOS: <a href="https://ios.com">こちら</a>
  </ul>
</body>
      `);
    });

    it('ios/android/pcのリダイレクト情報を入力するとすべてのリダイレクト情報が出力されている', () => {
      var actual = create()
        .set('urls.ios'     ,'https://ios.com')
        .set('urls.android' ,'https://android.com')
        .set('urls.pc'      ,'https://px.com')
        .set('title', 'ALL')
        .toHtml();
      assert(actual, `
<title>ALL</title>
<script>
  if(navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0)
  {
    window.location.href = 'https://ios.com';
  }
  if(navigator.userAgent.indexOf('Android') == -1)
  {
    window.location.href = 'https://android.com';
  }

</script>
<body>
  <ul>
    <li>iOS: <a href="https://ios.com">こちら</a>
    <li>Android: <a href="https://android.com">こちら</a>
    <li>PC: <a href="https://pc.com">こちら</a>
  </ul>
</body>
      `);
    });
  });

});
