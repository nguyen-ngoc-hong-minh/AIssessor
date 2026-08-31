const fs = require('fs');
let code = fs.readFileSync('components/signed-in-home.tsx', 'utf-8');

// 1. Remove "YOUR AI WORKSPACE" and subtitle
code = code.replace(
  '<p>YOUR AI WORKSPACE</p>',
  ''
);
code = code.replace(
  '<span>Start with one project, or optimize work you repeat every month.</span>',
  ''
);

// 2. Change the large headings and remove redundant <small> tags
code = code.replace(
  '<small>ONE-OFF PROJECT</small>',
  ''
);
code = code.replace(
  '<h2>Build a stack for one goal.</h2>',
  '<h2>One-off Project</h2>'
);

code = code.replace(
  '<small>MONTHLY WORKFLOW</small>',
  ''
);
code = code.replace(
  '<h2>Optimize recurring work.</h2>',
  '<h2>Monthly Workflow</h2>'
);

fs.writeFileSync('components/signed-in-home.tsx', code);
