const fs = require('fs');
let code = fs.readFileSync('components/workflow-editor.tsx', 'utf-8');

// Replace the wrapper
const oldGrid = `<div
        className="feature-grid justify-center w-full"
        style={{
          gridTemplateColumns:
            steps.length <= 4
              ? \`repeat(\${steps.length}, minmax(260px, 320px))\`
              : "repeat(auto-fit, minmax(260px, 320px))",
          gap: "24px",
        }}
      >`;
const newGrid = `<div className="flex flex-wrap justify-center gap-6 w-full">`;

code = code.replace(oldGrid, newGrid);

// Add width to the card
const oldCard = `<div className="feature glass-card pricing-deck-card flex flex-col justify-between p-8" key={step._id}>`;
const newCard = `<div className="feature glass-card pricing-deck-card flex flex-col justify-between p-8 w-full max-w-[320px]" key={step._id}>`;

code = code.replace(oldCard, newCard);

fs.writeFileSync('components/workflow-editor.tsx', code);
