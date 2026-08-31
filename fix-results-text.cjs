const fs = require('fs');
let code = fs.readFileSync('components/trial-results.tsx', 'utf-8');

// 1. ResultSummary
code = code.replace(
  '<p>{complete ? "YOUR AI MATCH IS READY" : "HONEST PARTIAL MATCH"}</p>',
  ''
);
code = code.replace(
  '<span>{complete ? "Each model below has one clear role in your workflow." : "We only show a model when current evidence supports the whole job."}</span>',
  ''
);

// 2. trial-bottom-line
code = code.replace(
  '<p>THE BOTTOM LINE</p>',
  ''
);

// 3. trial-save-panel
code = code.replace(
  '<p>{mode === "saved" ? "SAVED CONSULTATION" : "SAVE YOUR RESULT"}</p>',
  ''
);
code = code.replace(
  '<span>{mode === "saved" ? "Return to it anytime, edit the workflow, or customize the selected models below." : "Sign in is only needed to add it to consultation history."}</span>',
  ''
);

// 4. trial-optimise-tease
code = code.replace(
  '<p>OPTIONAL</p>',
  ''
);

fs.writeFileSync('components/trial-results.tsx', code);
