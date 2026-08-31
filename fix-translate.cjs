const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// Nuke all translateY transforms on hover
css = css.replace(/transform:\s*translateY\([^)]+\)\s*!important;/g, 'transform: none !important;');
css = css.replace(/transform:\s*translateY\([^)]+\);/g, 'transform: none;');

fs.writeFileSync('app/globals.css', css);
