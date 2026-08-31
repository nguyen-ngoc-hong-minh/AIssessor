const fs = require('fs');
let code = fs.readFileSync('app/globals.css', 'utf-8');

const oldCostBox = `/* 4. Cost Box in Hero */
.trial-result-summary-cost {
  background-color: transparent !important;
  border: 1.5px solid #0213B0 !important;
  border-radius: 0 !important;
}`;

const newCostBox = `/* 4. Cost Box in Hero */
.trial-result-summary-cost {
  background-color: transparent !important;
  border: none !important;
  border-left: 1.5px solid #0213B0 !important;
  border-radius: 0 !important;
}`;

code = code.replace(oldCostBox, newCostBox);

fs.writeFileSync('app/globals.css', code);
