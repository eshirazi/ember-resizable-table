import Ember from "ember";

export default Ember.Helper.helper(function([value, incrementBy]) {
  return (
    parseInt("" + value) +
    parseInt("" + (incrementBy === undefined ? 1 : incrementBy))
  );
});
