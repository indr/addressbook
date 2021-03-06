/**
 * secsy-webclient
 *
 * Copyright (c) 2016 Reto Inderbitzin <mail@indr.ch>
 *
 * For the full copyright and licence information, please view
 * the LICENSE file that was distributed with this source code.
 */

import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';

const {
  RSVP,
  $
} = Ember;

export default Base.extend({
  jQuery: $,
  
  restore(/*data*/) {
    return this._makeRequest('GET', '/api/users/me');
  },
  
  authenticate(identifier, password) {
    return this._makeRequest('POST', '/auth/local', {identifier, password})
      .catch((err/*, textStatus, errorThrown*/) => {
        throw err.responseJSON ? err.responseJSON : (err.statusText ? err.statusText.toLowerCase() : err)
      });
  },
  
  invalidate(/*data*/) {
    return new RSVP.Promise((resolve) => {
      this._makeRequest('POST', '/auth/logout').then(() => {
        resolve();
      }).catch((/*err, textStatus, errorThrown*/) => {
        resolve();
      });
    });
  },
  
  _makeRequest(type, url, data) {
    const options = {
      url,
      data: data != null ? JSON.stringify(data) : null,
      type: type,
      dataType: 'json',
      contentType: 'application/json'
    };
    
    return new RSVP.Promise((resolve, reject) => {
      this.jQuery.ajax(options).then(resolve, reject);
    });
  }
});
