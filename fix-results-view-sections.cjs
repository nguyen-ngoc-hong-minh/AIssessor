const fs = require('fs');
let code = fs.readFileSync('components/results-view.tsx', 'utf-8');

// Rename "Change any model..." and remove fluff
const oldHeading = '<div><p>OPTIONAL CUSTOMISATION</p><h2 id="customize-models-title">Change any model in your saved stack.</h2><span>Costs, workflow coverage, and your remaining budget update immediately.</span></div>';
const newHeading = '<div><h2 id="customize-models-title">Alternative Options</h2></div>';
code = code.replace(oldHeading, newHeading);

fs.writeFileSync('components/results-view.tsx', code);
