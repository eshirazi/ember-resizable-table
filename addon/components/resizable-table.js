/* globals $ */
import Ember from "ember";
import layout from "../templates/components/resizable-table";
import { clamp } from "ember-resizable-table/utils/clamp";

export default Ember.Component.extend({
  layout,
  classNames: ["resizable-table"],
  tagName: "table",
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
    this.set("rows", Ember.A());
    this.set("columnSizes", []);
    this.set("rowSizes", []);
    this.set("coordToCell", {});
    this.set("startResize", this.get("startResize").bind(this));
    this.set("resizeMouseMove", this.get("resizeMouseMove").bind(this));
    this.set("resizeMouseUp", this.get("resizeMouseUp").bind(this));
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

    let numColumns = this.get("numColumns");
    let numRows = this.get("numRows");

    function placeCell(x, y, cell) {
      if (
        x + cell.get("colSpan") > numColumns ||
        y + cell.get("rowSpan") > numRows
      ) {
        return false;
      }

      deferredActions.push(function() {
        cell.set("coordX", x);
        cell.set("coordY", y);
      });

      for (let w = 0; w < cell.get("colSpan"); w++) {
        for (let h = 0; h < cell.get("rowSpan"); h++) {
          coordToCell[key(x + w, y + h)] = cell;
        }
      }

      return true;
    }

    let dupGrid = [...this.get("rows").map(row => [...row.get("cells")])];

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

    this.set("coordToCell", coordToCell);

    this.spreadColumnSizesEvenly();
    this.spreadRowSizesEvenly();

    Ember.run.scheduleOnce("afterRender", this, function() {
      while (deferredActions.length > 0) {
        deferredActions.shift()();
      }
    });

    return true;
  },

  spreadColumnSizesEvenly() {
    const count = this.get("numColumns");
    let size = 1.0 / count;
    let sizes = [];
    for (let i = 0; i < count; i++) {
      sizes.push({ size: size });
    }
    this.set("columnSizes", sizes);
  },

  spreadRowSizesEvenly() {
    const count = this.get("numRows");
    let size = 1.0 / count;
    let sizes = [];
    for (let i = 0; i < count; i++) {
      sizes.push({ size: size });
    }
    this.set("rowSizes", sizes);
  },

  reLayout() {
    this.set("numRows", 0);
    this.set("numColumns", 0);

    const rows = this.get("rows");

    if (rows.length === 0) {
      return;
    }

    let firstRowCells = rows[0].get("cells");
    for (let colIndex = 0; colIndex < firstRowCells.length; colIndex++) {
      this.incrementProperty(
        "numColumns",
        firstRowCells[colIndex].get("colSpan")
      );
    }

    for (let rowIndex = 0; rowIndex < rows.length; ) {
      const curRowCells = rows[rowIndex].get("cells");
      if (curRowCells.length === 0) {
        return;
      }
      this.incrementProperty("numRows", curRowCells[0].get("rowSpan"));
      rowIndex += curRowCells[0].get("rowSpan");
    }

    if (this.buildCoordToCell()) {
      this.spreadColumnSizesEvenly();
      this.spreadRowSizesEvenly();
    }
  },

  startResize(columnOrRow, index) {
    this.installHooks();
    this.set("resizeColumnOrRow", columnOrRow);
    this.set("resizeIndex", index);
  },

  installHooks() {
    this.uninstallHooks();
    let jDocument = $(document);
    jDocument.on("mousemove", this.get("resizeMouseMove"));
    jDocument.on("mouseup", this.get("resizeMouseUp"));
    this.set("isResizing", true);
  },

  uninstallHooks() {
    let jDocument = $(document);
    jDocument.off("mousemove", this.get("resizeMouseMove"));
    jDocument.off("mouseup", this.get("resizeMouseUp"));
    this.set("isResizing", false);
  },

  getSize(columnOrRow, index) {
    return columnOrRow === "row"
      ? Ember.get(this.get("rowSizes")[index], "size")
      : Ember.get(this.get("columnSizes")[index], "size");
  },

  setSize(columnOrRow, index, newSize) {
    if (columnOrRow === "row") {
      Ember.set(this.get("rowSizes")[index], "size", newSize);
    } else {
      Ember.set(this.get("columnSizes")[index], "size", newSize);
    }
  },

  resizeMouseMove(event) {
    const $this = this.$();
    const offset = $this.offset();
    const resizeColumnOrRow = this.get("resizeColumnOrRow");
    const resizeIndex = this.get("resizeIndex");

    let before = 0.0;
    for (let i = 0; i < resizeIndex - 1; i++) {
      before += this.getSize(resizeColumnOrRow, i);
    }

    let pair =
      this.getSize(resizeColumnOrRow, resizeIndex - 1) +
      this.getSize(resizeColumnOrRow, resizeIndex);
    let mouse;

    if (resizeColumnOrRow === "column") {
      mouse = clamp((event.pageX - offset.left) / $this.width(), 0.0, 1.0);
    } else {
      mouse = clamp((event.pageY - offset.top) / $this.height(), 0.0, 1.0);
    }

    this.setSize(resizeColumnOrRow, resizeIndex - 1, mouse - before);
    this.setSize(resizeColumnOrRow, resizeIndex, pair - (mouse - before));
  },

  resizeMouseUp() {
    this.uninstallHooks();
  }
});
