const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

const fixCSS = `
/* Force normal weight for questions to match exactly */
.trial-advanced-grid label > span {
  font-weight: 400 !important;
}
`;

fs.writeFileSync('app/globals.css', css + fixCSS);
