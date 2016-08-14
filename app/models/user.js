import attr from 'ember-data/attr';
import DS from 'ember-data';

export default DS.Model.extend({
  username: attr('string'),
  email: attr('string'),
  password: attr('string'),
  createdAt: attr('date'),
  gravatarUrl: attr('string'),
  privateKey: attr('string'),
  publicKey: attr('string')
});
