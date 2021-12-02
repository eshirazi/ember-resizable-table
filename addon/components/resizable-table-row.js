import Component from '@ember/component';
import { A } from '@ember/array';
import layout from '../templates/components/resizable-table-row';

export default Component.extend({
  layout,
  classNames: ['resizable-table-row'],
  tagName: 'tr',
  cells: undefined,

  init() {
    this._super();
    this.set('cells', A());
  },

  reLayout() {
    this.table.reLayout();
  },

  didInsertElement() {
    this._super(...arguments);
    this.table?.rows.pushObject(this);
    this.reLayout();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.table?.rows.removeObject(this);
    this.reLayout();
  },
});
