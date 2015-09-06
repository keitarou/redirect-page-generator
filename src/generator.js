"use strict";

import Model from '../src/models/abstract.js';
import _ from 'lodash';
import Moment from 'moment';
import Template from 'handlebars';

var fs = require('fs');

class Generator extends Model
{
  /**
   * @Override
   */
  defaultProps()
  {
    return {
      title: null,
      urls: {
        pc: null,
        ios: null,
        android: null,
      }
    };
  }

  toHtml()
  {
    var html = `
<title>{{title}}</title>
<script>

{{#if urls.ios}}
  if(navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0)
  {
    window.location.href = {{urls.ios}};
  }
{{/if}}

{{#if urls.android}}
  if(navigator.userAgent.indexOf('Android') == -1))
  {
    window.location.href = {{urls.android}};
  }
{{/if}}

</script>
<body>
  <ul>
{{#if urls.ios}}
    <li>iOS: <a href="{{urls.ios}}">こちら</a></li>
{{/if}}
{{#if urls.android}}
    <li>Android: <a href="{{urls.android}}">こちら</a></li>
{{/if}}
{{#if urls.pc}}
    <li>PC: <a href="{{urls.pc}}">こちら</a></li>
{{/if}}
  </ul>
</body>
`;
    return Template.compile(html)(this.props);
  }

  generateSync()
  {
    var path = '/tmp/application-name/' + this.filename();
    fs.writeFileSync(path, this.toHtml());

    return path;
  }

  filename()
  {
    return this.unique() + '.html';
  }

  unique()
  {
    var now = Moment().unix();
    var rand = Math.random().toString(36).slice(-8);
    return String(now + rand);
  }
}

export default Generator;
