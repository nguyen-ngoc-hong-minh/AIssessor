const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

// Replace the Pass 21 Metric boxes style
css = css.replace(
  /\/\* Metric boxes style \*\/\n\.metric {\n  background-color: #CBF7EC !important;\n  border-radius: 0\.25rem !important;\n}/,
  '/* Metric boxes style */\n.metric {\n  background-color: transparent !important;\n  border: 1.5px solid #0213B0 !important;\n  border-radius: 0.25rem !important;\n}'
);

fs.writeFileSync('app/globals.css', css);
