const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// Add Shadcn bg colors to transparent
css = css.replace(
  '.bg-white, .bg-slate-50, .bg-slate-100, .bg-transparent, .glass-card {',
  '.bg-white, .bg-slate-50, .bg-slate-100, .bg-transparent, .glass-card, .bg-background, .bg-card, .bg-muted, .bg-accent {'
);

// Add Shadcn text colors to #0213B0
css = css.replace(
  '[class*="text-slate"], [class*="text-ink"], [class*="text-gray"],',
  '[class*="text-slate"], [class*="text-ink"], [class*="text-gray"], [class*="text-muted"], [class*="text-primary"], [class*="text-accent"], [class*="text-destructive"],'
);

// Add shadcn borders to the 1.5px border rule
css = css.replace(
  '[class*="border-slate"], [class*="border-gray"],',
  '[class*="border-slate"], [class*="border-gray"], [class*="border-input"], [class*="border-border"],'
);

fs.writeFileSync('app/globals.css', css);
