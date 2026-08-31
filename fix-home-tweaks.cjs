const fs = require('fs');
let code = fs.readFileSync('components/signed-in-home.tsx', 'utf-8');

// 1. Add div h=60px under the large title
code = code.replace(
  '<h1 id="signed-home-title">What would you like to plan?</h1>',
  '<h1 id="signed-home-title">What would you like to plan?</h1>\n        <div className="h-[60px]" />'
);

fs.writeFileSync('components/signed-in-home.tsx', code);
