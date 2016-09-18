import Ember from 'ember';
import TrackerMixin from './../mixins/tracker-mixin';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  emailAddress: {
    validators: [
      validator('presence', true),
      validator('format', {type: 'email'})
    ]
  },
  password: {
    validators: [
      validator('presence', true),
      validator('length', {min: 8, max: 64})
    ]
  }
});

export default Ember.Component.extend(TrackerMixin, Validations, {
  session: Ember.inject.service(),
  
  emailAddress: null,
  password: null,
  
  actions: {
    login() {
      const flash = this.get('flashMessages');
      const {emailAddress, password} = this.getProperties('emailAddress', 'password');
      
      flash.clearMessages();
      this.track('loginState', this.get('session').authenticate('authenticator:local', emailAddress, password)).then(() => {
        const locale = this.get('session').get('data.authenticated.locale');
        if (locale) {
          this.sendAction('setLocale', locale);
        }
      }, (reason) => {
        reason = reason.message ? reason.message : 'invalid-username-or-password';
        
        if (reason === 'user-not-confirmed') {
          this.sendAction('userNotConfirmed', emailAddress);
        } else {
          flash.dangerT('login.unknown-error', reason, {sticky: true});
        }
      });
    }
  }
});
