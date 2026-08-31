const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

css = css.replace(/button\.trial-secondary-button/g, '.trial-secondary-button');

fs.writeFileSync('app/globals.css', css);
