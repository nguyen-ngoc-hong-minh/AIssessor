const fs = require('fs');
let code = fs.readFileSync('components/workflow-editor.tsx', 'utf-8');

code = code.replace(
  '<div className="space-y-3 mt-1">',
  '<div className="space-y-6 mt-4">'
);

// Also let's make the textarea height a bit larger so it doesn't scroll so easily
code = code.replace(
  'min-h-[70px]',
  'min-h-[100px]'
);

fs.writeFileSync('components/workflow-editor.tsx', code);
