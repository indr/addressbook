import Ember from 'ember';

function debug (message) {
  Ember.debug('[route:contacts/view] ' + message);
}

export default Ember.Route.extend({
  store: Ember.inject.service(),
  
  model(params) {
    return this.get('store').findRecord('contact', params.id).then((record) => {
      debug('Found record ' + (record.get('id') || record));
      return record;
    });
  },
  
  actions: {
    delete() {
      const model = this.controller.get('model');
      
      if (model.get('me')) {
        const flash = this.get('flashMessages');
        flash.dangerT('errors.no-delete-self');
        return;
      }
      
      model.destroyRecord().then(() => {
        this.transitionTo('contacts');
      }).catch((err) => {
        this.get('flashMessages').dangerT('errors.delete-unknown-error', err.message || err);
      });
    }
  }
});
