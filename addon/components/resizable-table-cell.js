import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { bind } from '@ember/runloop';
import Component from '@ember/component';
import layout from '../templates/components/resizable-table-cell';
import { formatStyle } from '../utils/format-style';

export default Component.extend({
  layout,
  classNames: ['resizable-table-cell'],
  attributeBindings: ['colSpan:colspan', 'rowSpan:rowspan', 'htmlStyle:style'],
  tagName: 'td',
  colSpan: 1,
  rowSpan: 1,
  coordX: undefined /* set by resizable-table */,
  coordY: undefined /* set by resizable-table */,
  numColumns: alias('row.table.numColumns'),
  numRows: alias('row.table.numRows'),

  columnSizes: alias('row.table.columnSizes'),
  rowSizes: alias('row.table.rowSizes'),
  sashWidth: alias('row.table.sashWidth'),
  sashDistance: 0,

  _aCondition: computed('coordY', function () {
    return this.coordY !== 0;
  }),

  _bCondition: computed('coordX', 'colSpan', 'numColumns', function () {
    return (
      Number(this.coordX) + Number(this.colSpan) !== Number(this.numColumns)
    );
  }),

  _cCondition: computed('coordY', 'rowSpan', 'numRows', function () {
    return Number(this.coordY) + Number(this.rowSpan) !== Number(this.numRows);
  }),

  _dCondition: computed('coordX', function () {
    return this.coordX !== 0;
  }),

  init() {
    this._super();

    this.sashClicked = bind(this, this.sashClicked);

    /* eslint-disable ember/no-get */
    get(this, 'myWidth');
    get(this, 'myHeight');
    get(this, 'style');
    /* eslint-enable ember/no-get */
  },

  myWidth: computed(
    'colSpan',
    'columnSizes.@each.size',
    'coordX',
    'coordY',
    function () {
      if (
        this.coordX === undefined ||
        this.coordY === undefined ||
        this.columnSizes === undefined
      ) {
        return undefined;
      }

      const x = this.coordX;
      let ret = 0.0;
      for (let w = 0; w < this.colSpan; w++) {
        const cur = this.columnSizes[x + w];
        if (cur === undefined) {
          return undefined;
        }
        ret += cur.size;
      }
      return ret;
    }
  ),

  myHeight: computed(
    'coordX',
    'coordY',
    'rowSizes.@each.size',
    'rowSpan',
    function () {
      if (
        this.coordY === undefined ||
        this.coordY === undefined ||
        this.rowSizes === undefined
      ) {
        return undefined;
      }

      const y = this.coordY;
      let ret = 0.0;
      for (let h = 0; h < this.rowSpan; h++) {
        const cur = this.rowSizes[y + h];
        if (cur === undefined) {
          return undefined;
        }
        ret += cur.size;
      }
      return ret;
    }
  ),

  style: computed('myWidth', 'myHeight', function () {
    return {
      position: 'relative',
      width: `${this.myWidth * 100.0}%`,
      height: `${this.myHeight * 100.0}%`,
    };
  }),

  htmlStyle: computed('style', function () {
    return formatStyle(this.style);
  }),

  sashBaseStyle: computed(function () {
    return {
      position: 'absolute',
      'user-select': 'none',
      'z-index': '1000000',
    };
  }),

  sashTopStyle: computed(
    'baseSashStyle',
    'sashBaseStyle',
    'sashDistance',
    'sashWidth',
    function () {
      return formatStyle(
        Object.assign({}, this.sashBaseStyle, {
          top: '-1px',
          left: `${this.sashDistance}px`,
          right: `${this.sashDistance}px`,
          height: `${this.sashWidth}px`,
          cursor: 'row-resize',
        })
      );
    }
  ),

  sashRightStyle: computed(
    'baseSashStyle',
    'sashBaseStyle',
    'sashDistance',
    'sashWidth',
    function () {
      return formatStyle(
        Object.assign({}, this.sashBaseStyle, {
          right: '-1px',
          top: `${this.sashDistance}px`,
          bottom: `${this.sashDistance}px`,
          width: `${this.sashWidth}px`,
          cursor: 'col-resize',
        })
      );
    }
  ),

  sashBottomStyle: computed(
    'baseSashStyle',
    'sashBaseStyle',
    'sashDistance',
    'sashWidth',
    function () {
      return formatStyle(
        Object.assign({}, this.sashBaseStyle, {
          bottom: '-1px',
          left: `${this.sashDistance}px`,
          right: `${this.sashDistance}px`,
          height: `${this.sashWidth}px`,
          cursor: 'row-resize',
        })
      );
    }
  ),

  sashLeftStyle: computed(
    'baseSashStyle',
    'sashBaseStyle',
    'sashDistance',
    'sashWidth',
    function () {
      return formatStyle(
        Object.assign({}, this.sashBaseStyle, {
          left: '-1px',
          top: `${this.sashDistance}px`,
          bottom: `${this.sashDistance}px`,
          width: `${this.sashWidth}px`,
          cursor: 'col-resize',
        })
      );
    }
  ),

  /**
   * Helpers
   */

  reLayout() {
    this.row.reLayout();
  },

  /**
   * Life cycle
   */

  didInsertElement() {
    this._super(...arguments);
    this.row?.cells?.pushObject(this);
    this.reLayout();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.row?.cells?.removeObject(this);
    this.reLayout();
  },

  /**
   * Actions
   */

  sashClicked(sashType) {
    let columnOrRow, index;
    switch (sashType) {
      case 'top':
        columnOrRow = 'row';
        index = this.coordY;
        break;
      case 'right':
        columnOrRow = 'column';
        index = this.coordX + this.colSpan;
        break;
      case 'bottom':
        columnOrRow = 'row';
        index = this.coordY + this.rowSpan;
        break;
      case 'left':
        columnOrRow = 'column';
        index = this.coordX;
        break;
    }

    this.row?.table?.startResize?.(columnOrRow, index);
  },
});
