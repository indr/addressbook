import Model from 'ember-data/model';
import attr from 'ember-data/attr';
// import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  emailSha256: attr('string', {
    readonly: true
  }),
  
  isPublic: attr('boolean', {
    readonly: true
  }),
  
  privateKey: attr('string'),
  
  publicKey: attr('string'),
});
