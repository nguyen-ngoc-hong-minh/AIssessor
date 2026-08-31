const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// Fix the dangerous * selector
css = css.replace(
  '/* 8. NO HOVER ANIMATIONS GLOBALLY */\n*, *:hover {\n  box-shadow: none !important;\n  transition: none !important;\n  transform: none !important;\n}',
  '/* 8. NO HOVER ANIMATIONS GLOBALLY */\n*:hover {\n  box-shadow: none !important;\n  transform: none !important;\n}\n* {\n  box-shadow: none !important;\n}'
);

fs.writeFileSync('app/globals.css', css);
