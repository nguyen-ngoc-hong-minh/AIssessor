const fs = require('fs');
let code = fs.readFileSync('app/globals.css', 'utf-8');

// Update Hero Box
const oldHero = `/* 3. Hero Box */
.trial-result-hero {
  background-color: transparent !important;
  border: 1.5px solid #0213B0 !important;
  border-radius: 0.25rem !important;
}`;

const newHero = `/* 3. Hero Box */
.trial-result-hero {
  background-color: transparent !important;
  border: 1.5px solid #0213B0 !important;
  border-radius: 0.25rem !important;
  grid-template-columns: 1fr auto !important;
  align-items: center !important;
}`;

code = code.replace(oldHero, newHero);

// Update Cost Box padding
const oldCost = `/* 4. Cost Box in Hero */
.trial-result-summary-cost {
  background-color: transparent !important;
  border: none !important;
  border-left: 1.5px solid #0213B0 !important;
  border-radius: 0 !important;
}`;

const newCost = `/* 4. Cost Box in Hero */
.trial-result-summary-cost {
  background-color: transparent !important;
  border: none !important;
  border-left: 1.5px solid #0213B0 !important;
  border-radius: 0 !important;
  padding: 0 0 0 16px !important;
}`;

code = code.replace(oldCost, newCost);

fs.writeFileSync('app/globals.css', code);
