const fs = require('fs');
let code = fs.readFileSync('components/workflow-editor.tsx', 'utf-8');

code = code.replace(
  '<div className="s-compare w-full max-w-6xl mx-auto my-auto pt-16 md:pt-24 pb-6">',
  '<div className="s-compare w-full max-w-6xl mx-auto pb-6">'
);

fs.writeFileSync('components/workflow-editor.tsx', code);
