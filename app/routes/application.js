import Ember from 'ember';
import SimpleAuthApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import CustomApplicationRouteMixin from '../mixins/application-route-mixin';

const {
  assign,
  debug,
  K
} = Ember;

export default Ember.Route.extend(SimpleAuthApplicationRouteMixin, CustomApplicationRouteMixin, {
  intl: Ember.inject.service(),
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  crypto: Ember.inject.service(),
  sharer: Ember.inject.service(),
  
  beforeModel()  {
    this.restoreLocale();
  },
  
  restoreLocale() {
    const localeName = this.get('session').get('data.localeName') || 'en-us';
    this.get('intl').setLocale(localeName);
  },
  
  restoreProgress() {
    this.controller.set('progress.max', 0);
    this.controller.set('progress.type', 'info');
  },
  
  onProgress(status) {
    this.controller.set('progress.value', status.value);
    this.controller.set('progress.max', status.max);
    if (status.value === status.max) {
      this.controller.set('progress.type', 'success');
      Ember.run.later(this.restoreProgress.bind(this), 1000);
    }
  },
  
  actions: {
    error: function (error, transition) {
      Ember.Logger.error(error, transition);
      
      // Clear flash messages. Success messages at this point are confusing
      this.get('flashMessages').clearMessages();
      
      // Render template. Remember that {{outlet}} inside error.hbs would render
      // the currents route content
      this.render('error', {
        into: 'application',
        model: error
      });
      
      // More specific errors could be rendered this way
      // if (error.isAdapterError && error.errors && error.errors[0] && error.errors[0].status) {
      //   const status = error.errors[0].status;
      //   this.render('error.404', {
      //     into: 'error'
      //   });
      // }
    },
    
    setLocale(localeName) {
      this.get('intl').setLocale(localeName);
      this.get('session').set('data.localeName', localeName);
    },
    
    invalidateSession() {
      this.get('session').invalidate();
    },
    
    getShares(options) {
      options = assign({silent: false}, options);
      
      debug('routes/application/actions#getShares() / silent:' + options.silent);
      
      const onProgress = options.silent ? K : this.onProgress.bind(this);
      
      this.get('sharer').getShares(onProgress).then((shares) => {
        return this.get('sharer').digestShares(shares);
      });
    },
    
    onProgress(status) {
      this.onProgress(status);
    }
  }
});
