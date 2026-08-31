const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// Remove the invalid CSS block completely
css = css.replace(
  /\/\* Ensure no transforms on hover anywhere except pseudo-elements \(checkbox ticks\) \*\/\s*\*:not\(\:\:after\):not\(\:\:before\):hover\s*{\s*transform:\s*none\s*!important;\s*}/g,
  ''
);

// Append the valid high-specificity hover killer
const killerCSS = `

/* ==========================================================================
   STRICT DESIGN SYSTEM ENFORCEMENT - PASS 27 (Ultimate Hover Kill)
   ========================================================================== */

/* Nuke ALL transforms on hover with overwhelming specificity */
html body *:hover,
html body *[class]:hover,
html body *[class][class]:hover,
html body *[id]:hover {
  transform: none !important;
}

/* Ensure checkbox ticks survive by specifically restoring their transform 
   (Even though pseudo elements shouldn't be affected by *:hover, just to be safe) */
input[type="checkbox"]:checked::after,
.cl-checkboxInput:checked::after,
.cl-checkbox__input:checked::after {
  transform: translate(-50%, -50%) rotate(45deg) !important;
}
`;

fs.writeFileSync('app/globals.css', css + killerCSS);
