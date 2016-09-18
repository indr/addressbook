import Ember from 'ember';
import TrackerMixin from './../mixins/tracker-mixin';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  passphrase: {
    validators: [
      validator('presence', true),
      validator('length', {min: 8, max: 64})
    ]
  }
});

export default Ember.Component.extend(TrackerMixin, Validations, {
  keychain: Ember.inject.service(),
  session: Ember.inject.service(),
  
  passphrase: null,
  
  actions: {
    decrypt() {
      const self = this;
      const keychain = self.get('keychain');
      const flash = self.get('flashMessages');
      
      const userId = self.get('session.data.authenticated.id');
      const passphrase = this.get('passphrase');
      
      flash.infoT('decrypt.decrypting', {sticky: true});
      this.track('decryptState', keychain.open(userId, passphrase)).then(() => {
        flash.clearMessages();
      }).catch((reason) => {
        if (reason.message.indexOf('Invalid passphrase') >= 0) {
          flash.dangerT('errors.invalid-passphrase');
        }
        else {
          flash.dangerT('decrypt.unknown-error', reason);
        }
      });
    },
    
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
