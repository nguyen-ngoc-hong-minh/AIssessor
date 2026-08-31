const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

css = css.replace(
  '.trial-primary-button, \n.bg-blue-600,\n.cl-formButtonPrimary,',
  '.trial-primary-button, \n.bg-blue-600,\n.cl-formButtonPrimary,\n.btn-primary,'
);
css = css.replace(
  '.trial-primary-button *, \n.bg-blue-600 *,\n.cl-formButtonPrimary *,\nbutton[aria-pressed="true"] * {',
  '.trial-primary-button *, \n.bg-blue-600 *,\n.cl-formButtonPrimary *,\n.btn-primary *,\nbutton[aria-pressed="true"] * {'
);

fs.writeFileSync('app/globals.css', css);
