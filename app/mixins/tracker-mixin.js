import Ember from 'ember';

function debug (message) {
  Ember.debug('[mixin:tracker] ' + message)
}
export default Ember.Mixin.create({
  track(setStateProperty, promise) {
    debug(setStateProperty ? setStateProperty.name || setStateProperty : 'undefined');
    
    if (!setStateProperty) {
      // setStateProperty = Ember.K;
      return promise;
    } else if (typeof setStateProperty === 'string') {
      setStateProperty = this.set.bind(this, setStateProperty);
    }
    
    setStateProperty('pending');
    return promise.then((result) => {
      setStateProperty('resolved');
      Ember.run.later(setStateProperty.bind('default'), 1500);
      return result;
    }).catch((error) => {
      setStateProperty('rejected');
      Ember.run.later(setStateProperty.bind('default'), 1500);
      throw error;
    });
    // Better not use finally cause we might not be dealing with an RSVP promise
  }
});