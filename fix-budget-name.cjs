const fs = require('fs');
let code = fs.readFileSync('components/trial-experience.tsx', 'utf-8');

code = code.replace(
  '<legend>Total budget <InfoTip label="Monthly AI budget">',
  '<legend>AI budget <InfoTip label="Monthly AI budget">'
);

fs.writeFileSync('components/trial-experience.tsx', code);
