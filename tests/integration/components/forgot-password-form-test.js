import { expect } from 'chai';
import { describeComponent, it } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import instanceInitializer from '../../../instance-initializers/ember-intl';

describeComponent('forgot-password-form', 'Integration: ForgotPasswordFormComponent', {
    integration: true,
    setup() {
      // manually invoke the ember-intl initializer
      instanceInitializer.initialize(this);
      let intl = this.container.lookup('service:intl');
      intl.setLocale('en-us');
    }
  },
  function () {
    it('renders', function () {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#forgot-password-form}}
      //     template content
      //   {{/forgot-password-form}}
      // `);
      
      this.render(hbs`{{forgot-password-form}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);