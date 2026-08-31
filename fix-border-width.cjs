const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

css = css.replace(
  'border-width: 0 2px 2px 0 !important;',
  'border-width: 0 1.5px 1.5px 0 !important;'
);

fs.writeFileSync('app/globals.css', css);
