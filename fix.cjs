const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// We want to completely NUKE the first set of brute-force rules that forced 0px everywhere.
// These are:
// .trial-page * { border-radius: 0px !important; box-shadow: none !important; }
// .editorial-app-shell * { ... }
// .trial-page select, .trial-page textarea ... { border-radius: 0px !important; }
// *, *::before, *::after { border-radius: 0px !important; box-shadow: none !important; }

css = css.replace(/\.trial-page \* \{[\s\S]*?\}/g, '');
css = css.replace(/\.editorial-app-shell \* \{[\s\S]*?\}/g, '');
css = css.replace(/\.trial-page select,[\s\S]*?border-radius: 0px !important;\n\}/g, '');
css = css.replace(/\*, \*::before, \*::after \{\n\s*border-radius: 0px !important;\n\s*box-shadow: none !important;\n\}/g, '');
css = css.replace(/\.cl-userButtonTrigger, \.cl-userButtonAvatarBox, \.cl-userButtonAvatarImage \{\n\s*border-radius: 0px !important;\n\s*box-shadow: none !important;\n\}/g, '');

// Also clean up my Pass 2 and Pass 3 blocks so we can write a definitive final block.
css = css.split('/* ==========================================================================')[0];

const finalCSS = `
/* ==========================================================================
   STRICT DESIGN SYSTEM ENFORCEMENT - PASS 3 (FINAL)
   ========================================================================== */

/* 1. Global Backgrounds and Resets */
html, body, .trial-page, .editorial-app-shell, .editorial-app-main, :root[data-theme="dark"] body, :root[data-theme="dark"] html, :root[data-theme="dark"] .trial-page {
  background-color: #FFFFF1 !important;
  color: #0213B0 !important;
}

*, *::before, *::after {
  box-shadow: none !important;
  transition: none !important;
}

/* Kill all hover scaling/translating */
*:hover, *:active, *:focus {
  box-shadow: none !important;
  transition: none !important;
}
.trial-primary-button:hover,
.signed-home-option:hover,
.trial-model-choice:hover,
.menu-btn:hover,
.trial-secondary-button:hover,
.signed-home-history:hover,
.theme-toggle-btn:hover,
.cl-socialButtonsBlockButton:hover {
  transform: none !important;
}

/* 2. Global Border Radius (0.25rem for almost everything) */
div, section, article, nav, header, footer, dialog, aside, main, button, fieldset, .info-tip > div, .trial-progress span, .trial-progress i, .trial-progress.result span, .trial-progress.result i, .monthly-task-card, .trial-model-choice, .signed-home-option, .trial-choice-grid, .cl-card, .cl-header, .cl-socialButtonsBlockButton, .trial-budget-row, .trial-tool-picker {
  border-radius: 0.25rem !important;
}

/* 3. Type 3 Box (Input Fields - STRICTLY SQUARE AND BORDER BOTTOM 1.5px) */
input:not([type="checkbox"]):not([type="radio"]), 
textarea, 
select,
.trial-form input,
.trial-form textarea,
.trial-form select,
.cl-formFieldInput {
  background-color: #F4F7F5 !important;
  border: none !important;
  border-bottom: 1.5px solid #0213B0 !important;
  border-radius: 0px !important;
  color: #0213B0 !important;
  padding: 12px 16px !important;
  outline: none !important;
}

/* 4. Type 1 Box (Solid Buttons) */
button:not(.trial-secondary-button):not(.signed-home-history):not(.cl-socialButtonsBlockButton):not(.trial-model-choice),
.trial-primary-button,
.cl-formButtonPrimary,
.signed-home-option {
  background-color: #0213B0 !important;
  border: none !important;
  border-radius: 0.25rem !important;
  color: #FFFFF1 !important;
}

/* 5. Type 2 Box (Outline Buttons / Secondary) - 1.5px Border */
.trial-secondary-button,
.signed-home-history,
.cl-socialButtonsBlockButton {
  background-color: transparent !important;
  border: 1.5px solid #0213B0 !important;
  border-radius: 0.25rem !important;
  color: #0213B0 !important;
}

/* 6. Option Pickers (Segmented Control Style for Budget, Tools, Frequency) */
/* The outer container gets the border and padding */
.trial-form .trial-choice-grid,
.trial-form .trial-budget-row,
.trial-form .trial-tool-picker {
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
.trial-form .trial-tool-picker button {
  border: none !important;
  background-color: transparent !important;
  color: #0213B0 !important;
  border-radius: 0.25rem !important;
  flex: 1 1 auto;
}

/* Selected pill is solid blue */
.trial-form .trial-choice-grid button[aria-pressed="true"],
.trial-form .trial-budget-row button[aria-pressed="true"],
.trial-form .trial-tool-picker button[aria-pressed="true"] {
  background-color: #0213B0 !important;
  color: #FFFFF1 !important;
}

/* 7. Checkboxes - EXACTLY SQUARE */
/* Hide Clerk's internal SVG checkmark completely */
.cl-checkbox__input ~ svg,
.cl-checkbox__mark,
.cl-internal-1lg1hqm,
.cl-internal-102mxs9 {
  display: none !important;
  opacity: 0 !important;
}

/* Force standard and Clerk checkboxes to look exactly like the design */
input[type="checkbox"], 
.cl-checkbox__input,
.cl-formFieldInput[type="checkbox"] {
  appearance: none !important;
  -webkit-appearance: none !important;
  background-color: transparent !important;
  border: 1.5px solid #0213B0 !important; /* EXACTLY 1.5px */
  border-radius: 0.25rem !important;
  width: 20px !important; /* EXACTLY SQUARE */
  height: 20px !important; /* EXACTLY SQUARE */
  cursor: pointer !important;
  position: relative !important;
  display: inline-block !important;
  vertical-align: middle !important;
  margin: 0 !important;
  opacity: 1 !important;
  box-sizing: border-box !important;
}

/* Checked state: Solid blue fill */
input[type="checkbox"]:checked, 
.cl-checkbox__input:checked,
.cl-formFieldInput[type="checkbox"]:checked {
  background-color: #0213B0 !important;
  border-color: #0213B0 !important;
}

/* Custom Checkmark using CSS borders */
input[type="checkbox"]:checked::after, 
.cl-checkbox__input:checked::after,
.cl-formFieldInput[type="checkbox"]:checked::after {
  content: "" !important;
  position: absolute !important;
  top: 40% !important;
  left: 50% !important;
  width: 5px !important;
  height: 10px !important;
  border: solid #FFFFF1 !important;
  border-width: 0 1.5px 1.5px 0 !important; /* Matches 1.5px line weight */
  transform: translate(-50%, -50%) rotate(45deg) !important;
  color: transparent !important;
}

/* 8. Fix Tooltips (.info-tip > div) -> Type 2 */
.info-tip > div {
  background-color: #FFFFF1 !important;
  border: 1.5px solid #0213B0 !important;
  color: #0213B0 !important;
  box-shadow: none !important;
  border-radius: 0.25rem !important;
}

/* 9. Fix Progress Steps */
.trial-progress span {
  background-color: transparent !important;
  border: 1.5px solid #0213B0 !important;
  color: #0213B0 !important;
  border-radius: 0.25rem !important;
  width: 32px !important;
  height: 32px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.trial-progress span.active, .trial-progress span.done {
  background-color: #0213B0 !important;
  border: none !important;
  color: #FFFFF1 !important;
}
.trial-progress i {
  background-color: #0213B0 !important;
  height: 1.5px !important; /* Thick line to match 1.5px borders */
}

/* Fix Clerk Form gaps to exactly 1.125rem */
.cl-form, .cl-cardBox {
  gap: 1.125rem !important;
}
.cl-header {
  margin-bottom: 1.125rem !important;
}
.cl-formFieldRow {
  margin-bottom: 1.125rem !important;
}
`;

fs.writeFileSync('app/globals.css', css + finalCSS);
