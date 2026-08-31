const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');
css = css.replace(/#F8F6E7/g, '#F4F7F5');
fs.writeFileSync('app/globals.css', css);
