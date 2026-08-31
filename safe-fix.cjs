const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// 1. Remove rogue border-radius 0px rules
css = css.replace(/\.trial-page \* \{[\s\S]*?\}/g, '');
css = css.replace(/\.editorial-app-shell \* \{[\s\S]*?\}/g, '');
css = css.replace(/\.trial-page select,[\s\S]*?border-radius: 0px !important;\n\}/g, '');
css = css.replace(/\*, \*::before, \*::after \{\n\s*border-radius: 0px !important;\n\s*box-shadow: none !important;\n\}/g, '');
css = css.replace(/\.cl-userButtonTrigger, \.cl-userButtonAvatarBox, \.cl-userButtonAvatarImage \{\n\s*border-radius: 0px !important;\n\s*box-shadow: none !important;\n\}/g, '');

// 2. We'll append the Pass 3 fixes that override everything nicely.
const pass3CSS = `

/* ==========================================================================
   STRICT DESIGN SYSTEM ENFORCEMENT - PASS 3 (FINAL)
   ========================================================================== */

/* Update all 1px and 2px borders to 1.5px */
.trial-secondary-button,
.signed-home-history,
.cl-socialButtonsBlockButton,
.info-tip > div,
.trial-progress span {
  border: 1.5px solid #0213B0 !important;
}

/* 6. Option Pickers (Segmented Control Style for Budget, Tools, Frequency) */
/* The outer container gets the border and padding */
.trial-form .trial-choice-grid,
.trial-form .trial-budget-row,
.trial-form .trial-tool-picker,
.trial-form .trial-choice-grid.four {
  border: 1.5px solid #0213B0 !important;
  border-radius: 0.25rem !important;
  padding: 4px !important;
  background-color: transparent !important;
  gap: 4px !important;
  display: flex !important;
  flex-wrap: wrap !important;
}

/* The buttons inside act as pills (no border) */
.trial-form .trial-choice-grid button,
.trial-form .trial-budget-row button,
.trial-form .trial-tool-picker button,
.trial-form .trial-choice-grid.four button {
  border: none !important;
  background-color: transparent !important;
  color: #0213B0 !important;
  border-radius: 0.25rem !important;
  flex: 1 1 auto;
}

/* Selected pill is solid blue */
.trial-form .trial-choice-grid button[aria-pressed="true"],
.trial-form .trial-budget-row button[aria-pressed="true"],
.trial-form .trial-tool-picker button[aria-pressed="true"],
.trial-form .trial-choice-grid.four button[aria-pressed="true"] {
  background-color: #0213B0 !important;
  color: #FFFFF1 !important;
}

/* Checkboxes - EXACTLY SQUARE */
input[type="checkbox"], 
.cl-checkbox__input,
.cl-formFieldInput[type="checkbox"] {
  border: 1.5px solid #0213B0 !important;
  width: 20px !important; 
  height: 20px !important; 
  box-sizing: border-box !important;
}

/* Checked state CSS checkmark thickness 1.5px */
input[type="checkbox"]:checked::after, 
.cl-checkbox__input:checked::after,
.cl-formFieldInput[type="checkbox"]:checked::after {
  border-width: 0 1.5px 1.5px 0 !important;
}

/* Input Fields - Border bottom 1.5px */
input:not([type="checkbox"]):not([type="radio"]), 
textarea, 
select,
.trial-form input,
.trial-form textarea,
.trial-form select,
.cl-formFieldInput {
  border-bottom: 1.5px solid #0213B0 !important;
}
input:not([type="checkbox"]):not([type="radio"]):focus, 
textarea:focus, 
select:focus {
  border-bottom: 1.5px solid #0213B0 !important;
}
`;

fs.writeFileSync('app/globals.css', css + pass3CSS);
