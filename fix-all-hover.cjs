const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// Remove the invalid CSS
css = css.replace(
  /\*:not\(\:\:after\):not\(\:\:before\):hover\s*{\s*transform:\s*none\s*!important;\s*}/g,
  ''
);

// Nuke all translateX and translate and scale inside :hover blocks
css = css.replace(/transform:\s*translateX\([^)]+\)[^;]*;/g, '/* killed transform */');
css = css.replace(/transform:\s*translateY\([^)]+\)[^;]*;/g, '/* killed transform */');
css = css.replace(/transform:\s*translate\([^)]+\)[^;]*;/g, '/* killed transform */');
css = css.replace(/transform:\s*scale\([^)]+\)[^;]*;/g, '/* killed transform */');

fs.writeFileSync('app/globals.css', css);
