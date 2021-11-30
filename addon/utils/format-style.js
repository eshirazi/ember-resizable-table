import { htmlSafe } from "@ember/string";

export function formatStyle(styleHash) {
  let styleStr = "";

  Object.keys(styleHash).forEach((key) => {
    styleStr += `${key}: ${styleHash[key]}; `;
  });

  return htmlSafe(styleStr);
}
