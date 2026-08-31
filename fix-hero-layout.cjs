const fs = require('fs');
let code = fs.readFileSync('app/globals.css', 'utf-8');

const oldHero = `/* 3. Hero Box */
.trial-result-hero {
  background-color: transparent !important;
  border: 1.5px solid #0213B0 !important;
  border-radius: 0.25rem !important;
  grid-template-columns: 1fr auto !important;
  align-items: center !important;
}`;

const newHero = `/* 3. Hero Box */
.trial-result-hero {
  background-color: transparent !important;
  border: 1.5px solid #0213B0 !important;
  border-radius: 0.25rem !important;
  grid-template-columns: 1fr auto !important;
  align-items: stretch !important;
  padding: 0 !important;
  gap: 0 !important;
}

.trial-result-hero > div:first-child {
  padding: 24px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}`;

code = code.replace(oldHero, newHero);

const oldCost = `/* 4. Cost Box in Hero */
.trial-result-summary-cost {
  background-color: transparent !important;
  border: none !important;
  border-left: 1.5px solid #0213B0 !important;
  border-radius: 0 !important;
  padding: 0 0 0 16px !important;
}`;

const newCost = `/* 4. Cost Box in Hero */
.trial-result-summary-cost {
  background-color: transparent !important;
  border: none !important;
  border-left: 1.5px solid #0213B0 !important;
  border-radius: 0 !important;
  padding: 24px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}`;

code = code.replace(oldCost, newCost);

fs.writeFileSync('app/globals.css', code);
