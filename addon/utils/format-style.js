import Ember from "ember";

export function formatStyle(styleHash) {
  let styleStr = "";
  Object.keys(styleHash).forEach(key => {
    styleStr += `${key}: ${styleHash[key]}; `;
  });
  return Ember.String.htmlSafe(styleStr);
}
