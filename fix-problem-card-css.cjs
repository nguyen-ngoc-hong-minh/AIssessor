const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// Replace the Pass 20 Override
css = css.replace(
  /\/\* DASHBOARD STRATEGY CARD OVERRIDE \*\/\n\.problem-card {\n  background-color: #F4F7F5 !important;\n  border: none !important;\n  border-radius: 0\.25rem !important;\n}/,
  '/* DASHBOARD STRATEGY CARD OVERRIDE REMOVED - NOW USING TAILWIND UTILITIES */'
);

// Wait, I also had a global rule for .card, .glass-card, etc that might add border.
// If .problem-card still has .glass-card, it will get a border. But I removed .glass-card from the JSX.
// Let's check if the replacement worked.

fs.writeFileSync('app/globals.css', css);
