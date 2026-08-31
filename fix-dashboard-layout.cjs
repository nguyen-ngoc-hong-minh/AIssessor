const fs = require('fs');
let code = fs.readFileSync('components/dashboard-view.tsx', 'utf-8');

// 1. Remove flex-col from dashboard-create-actions and add flex-row
code = code.replace(
  'className="dashboard-create-actions flex-col !items-start"',
  'className="dashboard-create-actions !flex-row"'
);

fs.writeFileSync('components/dashboard-view.tsx', code);
