"use strict";

import _ from 'lodash';

class Model
{
  defaultProps()
  {
    throw new Error('required override');
  }

  constructor()
  {
    this.props = this.defaultProps();
  }

  get(path, defaultValue=null)
  {
    return _.get(this.props, path, defaultValue);
  }

  set(path, value)
  {
    _.set(this.props, path, value);
    return this;
  }
}

export default Model;
