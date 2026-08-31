const fs = require('fs');
let code = fs.readFileSync('components/trial-results.tsx', 'utf-8');

code = code.replace(
  'complete ? "Specific AI. Specific jobs." :',
  'complete ? "Estimated cost" :'
);

code = code.replace(
  '<small>KNOWN AI COST</small>',
  ''
);

fs.writeFileSync('components/trial-results.tsx', code);
