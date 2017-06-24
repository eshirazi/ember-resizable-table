import Ember from 'ember';

export default Ember.Mixin.create({
  style: {},

  injectStyleToElem: Ember.on('didInsertElement', Ember.observer('style', function () {
    this.$().css(this.get('style'));
  }))
});
