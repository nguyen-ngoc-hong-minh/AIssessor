const fs = require('fs');
let code = fs.readFileSync('components/dashboard-view.tsx', 'utf-8');

// 1. Remove <p>START A NEW CONSULTATION</p>
code = code.replace('<p>START A NEW CONSULTATION</p>', '');

// 2. Remove Consultation history eyebrow
code = code.replace(
  '<div className="eyebrow mb-6">\n            <span className="dt" />\n            Consultation history\n          </div>',
  ''
);

// 3. Remove 3 saved
code = code.replace(
  '<div className="flex items-center gap-2 text-ink-3 mb-1">\n              <History className="w-4 h-4" aria-hidden="true" />\n              <span className="font-mono text-xs">{strategies.length} saved</span>\n            </div>',
  ''
);

// 4. Make "Monthly workflow" button btn-primary and stack them vertically
code = code.replace(
  'className="dashboard-create-actions"',
  'className="dashboard-create-actions flex-col !items-start"'
);
code = code.replace(
  '<Link className="btn-secondary" href="/strategy/new/monthly">',
  '<Link className="btn-primary" href="/strategy/new/monthly">'
);

// 5. Remove hover:scale-105 from the empty state button
code = code.replace(
  'hover:scale-105 transition-transform',
  ''
);

fs.writeFileSync('components/dashboard-view.tsx', code);
