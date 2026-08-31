const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// Fix primary button selectors to not be limited to <button>
css = css.replace(/button\.trial-primary-button/g, '.trial-primary-button');
css = css.replace(/button\.bg-blue-600/g, '.bg-blue-600');

fs.writeFileSync('app/globals.css', css);
