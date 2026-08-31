const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// Fix the hover selector properly
css = css.replace(
  '/* 8. NO HOVER ANIMATIONS GLOBALLY */\n*:hover {\n  box-shadow: none !important;\n  transform: none !important;\n}\n* {\n  box-shadow: none !important;\n}',
  '/* 8. NO BOX SHADOWS GLOBALLY */\n* {\n  box-shadow: none !important;\n}\n/* KILL TRANSITIONS (INSTANT SNAP) */\n* {\n  transition: none !important;\n}'
);

fs.writeFileSync('app/globals.css', css);
