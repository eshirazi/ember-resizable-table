import { htmlSafe } from '@ember/template';

export function formatStyle(styleHash) {
  let styleStr = '';

  Object.keys(styleHash).forEach((key) => {
    styleStr += `${key}: ${styleHash[key]}; `;
  });

  return htmlSafe(styleStr);
}
