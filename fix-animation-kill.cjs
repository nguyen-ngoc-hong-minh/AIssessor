const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

css = css.replace(
  '/* Ensure no transforms on hover anywhere */\n*:hover {\n  transform: none !important;\n}',
  '/* Ensure no transforms on hover anywhere except pseudo-elements (checkbox ticks) */\n*:not(::after):not(::before):hover {\n  transform: none !important;\n}'
);

fs.writeFileSync('app/globals.css', css);
