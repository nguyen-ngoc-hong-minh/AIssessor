const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

const fixCSS = `

/* ==========================================================================
   STRICT DESIGN SYSTEM ENFORCEMENT - PASS 14 (Spacing)
   ========================================================================== */

/* Increase space below main title */
.trial-section-heading {
  margin-bottom: 90px !important;
}
@media (max-width: 768px) {
  .trial-section-heading {
    margin-bottom: 60px !important;
  }
}
`;

fs.writeFileSync('app/globals.css', css + fixCSS);
