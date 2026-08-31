const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

const additionalStyles = `

/* ==========================================================================
   STRICT DESIGN SYSTEM ENFORCEMENT - PASS 21 (Dashboard Layout tweaks)
   ========================================================================== */

/* Stack the title and the buttons vertically */
.dashboard-create-bar {
  flex-direction: column !important;
  align-items: flex-start !important;
  gap: 24px !important;
}

/* Ensure buttons sit on the same row */
.dashboard-create-actions {
  flex-direction: row !important;
  justify-content: flex-start !important;
  gap: 16px !important;
}

/* Metric boxes style */
.metric {
  background-color: #CBF7EC !important;
  border-radius: 0.25rem !important;
}
`;

fs.writeFileSync('app/globals.css', css + additionalStyles);
