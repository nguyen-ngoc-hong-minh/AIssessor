const fs = require('fs');
let code = fs.readFileSync('app/(product)/strategy/[strategyId]/workflow/page.tsx', 'utf-8');

code = code.replace(
  '<div className="w-full max-w-6xl mx-auto pt-10 md:pt-14 pb-10 px-4 md:px-8">',
  '<div className="w-full max-w-6xl mx-auto pt-[40px] pb-10 px-[20px]">'
);

fs.writeFileSync('app/(product)/strategy/[strategyId]/workflow/page.tsx', code);
