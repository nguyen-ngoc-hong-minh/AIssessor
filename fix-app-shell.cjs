const fs = require('fs');
let code = fs.readFileSync('components/app-shell.tsx', 'utf-8');

code = code.replace(
  'const isWorkspaceStart = pathname === "/home" || pathname === "/dashboard";',
  'const isWorkspaceStart = pathname === "/home" || pathname === "/dashboard" || pathname.includes("/workflow") || pathname.includes("/strategy/");'
);

fs.writeFileSync('components/app-shell.tsx', code);
