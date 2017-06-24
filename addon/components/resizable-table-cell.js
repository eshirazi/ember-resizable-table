import Ember from "ember";
import layout from "../templates/components/resizable-table-cell";
import InjectStyle from "../mixins/inject-style";
import { formatStyle } from "../utils/format-style";

export default Ember.Component.extend(InjectStyle, {
  layout,
  classNames: ["resizable-table-cell"],
  attributeBindings: ["colSpan:colspan", "rowSpan:rowspan"],
  tagName: "td",
  colSpan: 1,
  rowSpan: 1,
  coordX: undefined /* set by resizable-table */,
  coordY: undefined /* set by resizable-table */,
  numColumns: Ember.computed.alias("row.table.numColumns"),
  numRows: Ember.computed.alias("row.table.numRows"),

  columnSizes: Ember.computed.alias("row.table.columnSizes"),
  rowSizes: Ember.computed.alias("row.table.rowSizes"),
  sashWidth: Ember.computed.alias("row.table.sashWidth"),
  sashDistance: 0,

  init() {
    this._super();
    this.get("myWidth");
    this.get("myHeight");
    this.get("style");
  },

  myWidth: Ember.computed(
    "coordX",
    "coordY",
    "columnSizes",
    "columnSizes.@each.size",
    function() {
      if (
        this.get("coordX") === undefined ||
        this.get("coordY") === undefined ||
        this.get("columnSizes") === undefined
      ) {
        return undefined;
      }

      const x = this.get("coordX");
      let ret = 0.0;
      for (let w = 0; w < this.get("colSpan"); w++) {
        const cur = this.get("columnSizes")[x + w];
        if (cur === undefined) {
          return undefined;
        }
        ret += Ember.get(cur, "size");
      }
      return ret;
    }
  ),

  myHeight: Ember.computed(
    "coordX",
    "coordY",
    "rowSizes",
    "rowSizes.@each.size",
    function() {
      if (
        this.get("coordY") === undefined ||
        this.get("coordY") === undefined ||
        this.get("rowSizes") === undefined
      ) {
        return undefined;
      }

      const y = this.get("coordY");
      let ret = 0.0;
      for (let h = 0; h < this.get("rowSpan"); h++) {
        const cur = this.get("rowSizes")[y + h];
        if (cur === undefined) {
          return undefined;
        }
        ret += Ember.get(cur, "size");
      }
      return ret;
    }
  ),

  style: Ember.computed("myWidth", "myHeight", function() {
    return {
      position: "relative",
      width: `${this.get("myWidth") * 100.0}%`,
      height: `${this.get("myHeight") * 100.0}%`
    };
  }),

  sashBaseStyle: Ember.computed(function() {
    return {
      position: "absolute",
      "user-select": "none",
      "z-index": "1000000"
    };
  }),

  sashTopStyle: Ember.computed(
    "sashWidth",
    "sashDistance",
    "baseSashStyle",
    function() {
      return formatStyle(
        Object.assign({}, this.get("sashBaseStyle"), {
          top: "-1px",
          left: `${this.get("sashDistance")}px`,
          right: `${this.get("sashDistance")}px`,
          height: `${this.get("sashWidth")}px`,
          cursor: "row-resize"
        })
      );
    }
  ),

  sashRightStyle: Ember.computed(
    "sashWidth",
    "sashDistance",
    "baseSashStyle",
    function() {
      return formatStyle(
        Object.assign({}, this.get("sashBaseStyle"), {
          right: "-1px",
          top: `${this.get("sashDistance")}px`,
          bottom: `${this.get("sashDistance")}px`,
          width: `${this.get("sashWidth")}px`,
          cursor: "col-resize"
        })
      );
    }
  ),

  sashBottomStyle: Ember.computed(
    "sashWidth",
    "sashDistance",
    "baseSashStyle",
    function() {
      return formatStyle(
        Object.assign({}, this.get("sashBaseStyle"), {
          bottom: "-1px",
          left: `${this.get("sashDistance")}px`,
          right: `${this.get("sashDistance")}px`,
          height: `${this.get("sashWidth")}px`,
          cursor: "row-resize"
        })
      );
    }
  ),

  sashLeftStyle: Ember.computed(
    "sashWidth",
    "sashDistance",
    "baseSashStyle",
    function() {
      return formatStyle(
        Object.assign({}, this.get("sashBaseStyle"), {
          left: "-1px",
          top: `${this.get("sashDistance")}px`,
          bottom: `${this.get("sashDistance")}px`,
          width: `${this.get("sashWidth")}px`,
          cursor: "col-resize"
        })
      );
    }
  ),

  reLayout() {
    this.get("row").reLayout();
  },

  didInsertElement() {
    this._super(...arguments);
    this.get("row.cells").pushObject(this);
    this.reLayout();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.get("row.cells").removeObject(this);
    this.reLayout();
  },

  actions: {
    sashClicked(sashType) {
      let columnOrRow, index;
      switch (sashType) {
        case "top":
          columnOrRow = "row";
          index = this.get("coordY");
          break;
        case "right":
          columnOrRow = "column";
          index = this.get("coordX") + this.get("colSpan");
          break;
        case "bottom":
          columnOrRow = "row";
          index = this.get("coordY") + this.get("rowSpan");
          break;
        case "left":
          columnOrRow = "column";
          index = this.get("coordX");
          break;
      }

      this.get("row.table.startResize")(columnOrRow, index);
    }
  }
});
