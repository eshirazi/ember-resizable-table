import Component from "@ember/component";

export default Component.extend({
  initialColumnSizes: undefined,
  initialRowSizes: undefined,

  init() {
    this._super();
    this.initialColumnSizes = [0.5, 0.25, 0.25];
    this.initialRowSizes = [0.25, 0.5, 0.25];
  },
});
