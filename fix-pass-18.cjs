const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// Update TYPE 3 BOXES
css = css.replace(
  'border-bottom: 1.5px solid #0213B0 !important;\n  border-radius: 0 !important;',
  'border: none !important;\n  border-radius: 0.25rem !important;'
);

// Kill all Tailwind hover classes broadly without breaking checkboxes
const killHover = `
/* STRIP ALL HOVER ANIMATIONS & COLOR CHANGES */
*:not(input[type="checkbox"]):not(.cl-checkboxInput):not(::after):not(::before):hover {
  transform: none !important;
  background-color: inherit;
  color: inherit;
}
`;

fs.writeFileSync('app/globals.css', css + killHover);
