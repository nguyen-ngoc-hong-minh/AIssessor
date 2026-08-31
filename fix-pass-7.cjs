const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

const fixCSS = `

/* ==========================================================================
   STRICT DESIGN SYSTEM ENFORCEMENT - PASS 7 (Monthly Task Cards & Icons)
   ========================================================================== */

/* 1. Monthly Task Card Outer Border */
.monthly-task-card {
  border: 1.5px solid #0213B0 !important;
  background: transparent !important;
  background-color: transparent !important;
}

/* 2. Monthly Task Icon Buttons (e.g. Trash) */
.monthly-task-card-heading button,
.monthly-task-card-heading button:hover,
.monthly-task-card-heading button:focus,
.monthly-task-card-heading button:active {
  border: none !important;
  background: transparent !important;
  background-color: transparent !important;
  color: #0213B0 !important;
  box-shadow: none !important;
  transform: none !important;
  outline: none !important;
}

/* 3. Global Icon Hover Kill */
/* Ensure NO icon buttons anywhere have rogue borders or color changes on hover */
button svg, button:hover svg {
  color: inherit !important;
  transition: none !important;
  transform: none !important;
}
`;

fs.writeFileSync('app/globals.css', css + fixCSS);
