const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// Add .btn-primary to Type 1
css = css.replace(
  '.trial-primary-button, \n.bg-blue-600,',
  '.trial-primary-button, \n.bg-blue-600,\n.btn-primary,'
);

// Add .btn-secondary to Type 2
css = css.replace(
  '.trial-secondary-button,\nbutton[variant="outline"],',
  '.trial-secondary-button,\n.btn-secondary,\nbutton[variant="outline"],'
);

fs.writeFileSync('app/globals.css', css);
