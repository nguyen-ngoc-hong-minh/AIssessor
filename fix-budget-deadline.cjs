const fs = require('fs');
let code = fs.readFileSync('components/trial-experience.tsx', 'utf-8');

// Change Total budget to AI budget and make it full width
code = code.replace(
  '<fieldset className="trial-field-half"><legend>Total budget',
  '<fieldset className="trial-field-wide"><legend>AI budget'
);

// Make Deadline full width
code = code.replace(
  '<fieldset className="trial-field-half"><legend>Deadline',
  '<fieldset className="trial-field-wide"><legend>Deadline'
);

fs.writeFileSync('components/trial-experience.tsx', code);
