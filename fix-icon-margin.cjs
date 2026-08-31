const fs = require('fs');
let code = fs.readFileSync('app/globals.css', 'utf-8');

code = code.replace(
  'margin-bottom: 24px !important;',
  'margin-bottom: 36px !important;'
);

fs.writeFileSync('app/globals.css', code);
