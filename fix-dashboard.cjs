const fs = require('fs');
let code = fs.readFileSync('components/dashboard-view.tsx', 'utf-8');

// 1. Remove the redundant line
code = code.replace(
  '<span>Choose a one-off project or a monthly workflow.</span>',
  ''
);

// 2. Remove the inner border-b border-line that might be annoying
code = code.replace(
  'className="flex items-end justify-between gap-4 pb-6 mb-6 border-b border-line"',
  'className="flex items-end justify-between gap-4 pb-6 mb-6"'
);

fs.writeFileSync('components/dashboard-view.tsx', code);
