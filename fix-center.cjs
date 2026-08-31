const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

const fixCSS = `
/* Ensure text in all option picker buttons is perfectly centered */
.trial-form .trial-choice-grid button,
.trial-form .trial-budget-row button,
.trial-form .trial-tool-picker button,
.trial-form .trial-choice-grid.four button {
  justify-content: center !important;
  text-align: center !important;
}
`;
fs.writeFileSync('app/globals.css', css + fixCSS);
