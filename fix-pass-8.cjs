const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

const fixCSS = `

/* ==========================================================================
   STRICT DESIGN SYSTEM ENFORCEMENT - PASS 8 (Typography & Fine-tuning)
   ========================================================================== */

/* 1. Fix Double Border Bottom on Custom Budget */
.trial-form .trial-custom-budget input,
.trial-form .trial-custom-budget input:focus,
.trial-form .trial-custom-budget input:active {
  border-bottom: none !important;
  background-color: transparent !important;
}

/* 2. Fix Placeholder Text Color */
/* Override any rogue !important rules from old themes */
.trial-form input::placeholder, 
.trial-form textarea::placeholder,
.cl-formFieldInput::placeholder,
.monthly-task-card input::placeholder,
.monthly-task-add input::placeholder,
input::placeholder {
  color: #0213B0 !important;
  opacity: 0.6 !important;
}

/* 3. Normalize Font Weights and Sizes for Sibling Elements */
/* Ensures inputs, selects, and buttons at the same level share identical typography */
.trial-form input,
.trial-form select,
.trial-form textarea,
.trial-form button,
.monthly-task-card input,
.monthly-task-card select,
.monthly-task-card button,
.monthly-task-add input,
.monthly-task-add button {
  font-size: 14px !important;
  font-weight: 500 !important;
  font-family: inherit !important;
}

/* Let the main hero headings and labels keep their intended larger/bolder sizes */
.trial-section-heading h1 {
  font-weight: 700 !important;
}
`;

fs.writeFileSync('app/globals.css', css + fixCSS);
