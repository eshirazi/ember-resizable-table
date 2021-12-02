import { set } from '@ember/object';
import { schedule, bind } from '@ember/runloop';
import Component from '@ember/component';
import { A } from '@ember/array';
import layout from '../templates/components/resizable-table';
import { clamp } from '../utils/clamp';
import { getElementOffset } from '../utils/dom';

export default Component.extend({
  layout,
  classNames: ['resizable-table'],
  tagName: 'table',
  rows: undefined,
  numRows: 0,
  numColumns: 0,
  columnSizes: undefined,
  rowSizes: undefined,
  coordToCell: undefined,
  resizeColumnOrRow: undefined,
  resizeIndex: undefined,
  isResizing: false,
  sashWidth: 7,

  init() {
    this._super(...arguments);

    this.set('rows', A([]));
    this.set('columnSizes', A([]));
    this.set('rowSizes', A([]));
    this.set('coordToCell', {});

    this.startResize = bind(this, this.startResize);
    this.resizeMouseMove = bind(this, this.resizeMouseMove);
    this.resizeMouseUp = bind(this, this.resizeMouseUp);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.uninstallHooks();
  },

  buildCoordToCell() {
    let coordToCell = {};
    let deferredActions = [];

    function key(x, y) {
      return `${x}-${y}`;
    }

    let numColumns = this.numColumns;
    let numRows = this.numRows;

    function placeCell(x, y, cell) {
      if (
        x + cell.get('colSpan') > numColumns ||
        y + cell.get('rowSpan') > numRows
      ) {
        return false;
      }

      deferredActions.push(function () {
        cell.set('coordX', x);
        cell.set('coordY', y);
      });

      for (let w = 0; w < cell.get('colSpan'); w++) {
        for (let h = 0; h < cell.get('rowSpan'); h++) {
          coordToCell[key(x + w, y + h)] = cell;
        }
      }

      return true;
    }

    let dupGrid = [...this.rows.map((row) => [...row.get('cells')])];

    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numColumns; x++) {
        if (key(x, y) in coordToCell) {
          continue;
        }

        if (dupGrid.length === 0 || dupGrid[0].length === 0) {
          return false;
        }

        if (!placeCell(x, y, dupGrid[0].shift())) {
          return false;
        }
      }

      if (dupGrid.length === 0 || dupGrid[0].length !== 0) {
        return false;
      }

      dupGrid.shift();
    }

    this.set('coordToCell', coordToCell);

    schedule('afterRender', this, function () {
      while (deferredActions.length > 0) {
        const action = deferredActions.shift();
        action();
      }
    });

    return true;
  },

  resetColumnSizes() {
    if (this.initialColumnSizes) {
      this.set(
        'columnSizes',
        A(this.initialColumnSizes.map((item) => ({ size: item })))
      );
      return;
    }

    const count = this.numColumns;
    let size = 1.0 / count;
    let sizes = A([]);
    for (let i = 0; i < count; i++) {
      sizes.pushObject({ size });
    }
    this.set('columnSizes', sizes);
  },

  resetRowSizes() {
    if (this.initialRowSizes) {
      this.set(
        'rowSizes',
        A(this.initialRowSizes.map((item) => ({ size: item })))
      );
      return;
    }

    const count = this.numRows;
    let size = 1.0 / count;
    let sizes = A([]);
    for (let i = 0; i < count; i++) {
      sizes.pushObject({ size });
    }
    this.set('rowSizes', sizes);
  },

  reLayout() {
    this.set('numRows', 0);
    this.set('numColumns', 0);

    const rows = this.rows;

    if (rows.length === 0) {
      return;
    }

    let firstRowCells = rows[0].get('cells');
    for (let colIndex = 0; colIndex < firstRowCells.length; colIndex++) {
      this.incrementProperty(
        'numColumns',
        firstRowCells[colIndex].get('colSpan')
      );
    }

    for (let rowIndex = 0; rowIndex < rows.length; ) {
      const curRowCells = rows[rowIndex].get('cells');
      if (curRowCells.length === 0) {
        return;
      }
      this.incrementProperty('numRows', curRowCells[0].get('rowSpan'));
      rowIndex += curRowCells[0].get('rowSpan');
    }

    if (this.buildCoordToCell()) {
      this.resetColumnSizes();
      this.resetRowSizes();
    }
  },

  startResize(columnOrRow, index) {
    this.installHooks();
    this.set('resizeColumnOrRow', columnOrRow);
    this.set('resizeIndex', index);
  },

  installHooks() {
    this.uninstallHooks();
    document.addEventListener('mousemove', this.resizeMouseMove, false);
    document.addEventListener('mouseup', this.resizeMouseUp, false);
    this.set('isResizing', true);
  },

  uninstallHooks() {
    document.removeEventListener('mousemove', this.resizeMouseMove, false);
    document.removeEventListener('mouseup', this.resizeMouseUp, false);
    this.set('isResizing', false);
  },

  getSize(columnOrRow, index) {
    return columnOrRow === 'row'
      ? this.rowSizes[index].size
      : this.columnSizes[index].size;
  },

  setSize(columnOrRow, index, newSize) {
    if (columnOrRow === 'row') {
      const rowSizes = this.rowSizes;
      set(rowSizes[index], 'size', newSize);
    } else {
      const columnSizes = this.columnSizes;
      set(columnSizes[index], 'size', newSize);
    }

    const onSizeChanged = this.onSizeChanged;
    if (onSizeChanged) {
      onSizeChanged(columnOrRow, index, newSize);
    }
  },

  resizeMouseMove(event) {
    const offset = getElementOffset(this.element);
    const offsetLeft = offset.left;
    const offsetTop = offset.top;
    const { width, height } = this.element.getBoundingClientRect();

    const resizeColumnOrRow = this.resizeColumnOrRow;
    const resizeIndex = this.resizeIndex;

    let before = 0.0;
    for (let i = 0; i < resizeIndex - 1; i++) {
      before += this.getSize(resizeColumnOrRow, i);
    }

    const pair =
      this.getSize(resizeColumnOrRow, resizeIndex - 1) +
      this.getSize(resizeColumnOrRow, resizeIndex);
    let mouse;

    if (resizeColumnOrRow === 'column') {
      mouse = clamp((event.pageX - offsetLeft) / width, 0.0, 1.0);
    } else {
      mouse = clamp((event.pageY - offsetTop) / height, 0.0, 1.0);
    }

    this.setSize(resizeColumnOrRow, resizeIndex - 1, mouse - before);
    this.setSize(resizeColumnOrRow, resizeIndex, pair - (mouse - before));
  },

  resizeMouseUp() {
    this.uninstallHooks();
  },
});
