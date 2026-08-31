const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// Replace #CBF7EC with #F4F7F5 for .trial-advanced background
css = css.replace(/background: #CBF7EC !important;/g, 'background: #F4F7F5 !important;');
css = css.replace(/background-color: #CBF7EC !important;/g, 'background-color: #F4F7F5 !important;');

fs.writeFileSync('app/globals.css', css);
