import Ember from 'ember';
import layout from '../templates/components/resizable-table-row';

export default Ember.Component.extend({
  layout,
  classNames: ['resizable-table-row'],
  tagName: 'tr',
  cells: undefined,

  init() {
    this._super();
    this.set('cells', Ember.A());
  },

  reLayout() {
    this.get('table').reLayout();
  },

  didInsertElement() {
    this._super(...arguments);
    this.get('table.rows').pushObject(this);
    this.reLayout();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.get('table.rows').removeObject(this);
    this.reLayout();
  }
});
