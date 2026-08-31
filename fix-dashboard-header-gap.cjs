const fs = require('fs');
let code = fs.readFileSync('components/dashboard-view.tsx', 'utf-8');

// 1. Fix the main container classes
code = code.replace(
  'className="dash-content-block min-h-[485px] flex flex-col justify-between scroll-mt-24"',
  'className="dash-content-block min-h-[485px] flex flex-col gap-6 scroll-mt-24"'
);

// 2. Remove the pb-6 mb-6 from the header div
code = code.replace(
  '<div className="flex items-end justify-between gap-4 pb-6 mb-6">',
  '<div className="flex items-end justify-between gap-4">'
);

fs.writeFileSync('components/dashboard-view.tsx', code);
