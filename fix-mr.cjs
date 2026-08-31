const fs = require('fs');
let code = fs.readFileSync('components/dashboard-view.tsx', 'utf-8');

code = code.replace(
  'className="btn-primary text-[11px] font-bold px-6 py-3 flex items-center justify-center gap-2 mr-4"',
  'className="btn-primary text-[11px] font-bold px-6 py-3 flex items-center justify-center gap-2 mr-3"'
);

fs.writeFileSync('components/dashboard-view.tsx', code);
