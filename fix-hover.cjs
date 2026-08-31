const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// Remove the bad hover rule I just appended
css = css.replace(
  '/* STRIP ALL HOVER ANIMATIONS & COLOR CHANGES */\n*:not(input[type="checkbox"]):not(.cl-checkboxInput):not(::after):not(::before):hover {\n  transform: none !important;\n  background-color: inherit;\n  color: inherit;\n}',
  '/* KILL HOVER TRANSFORMS */\n*:not(input[type="checkbox"]):not(.cl-checkboxInput):not(::after):not(::before):hover {\n  transform: none !important;\n}'
);

fs.writeFileSync('app/globals.css', css);
