const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

const fixCSS = `

/* ==========================================================================
   STRICT DESIGN SYSTEM ENFORCEMENT - PASS 11 (Fine-tuning Optional Details)
   ========================================================================== */

/* 1. Optional details outer box - New Color */
.trial-advanced {
  background: #CBF7EC !important;
  background-color: #CBF7EC !important;
}

/* 2. Remove divider line */
.trial-advanced-grid {
  border-top: none !important;
}

/* 3. Match Optional Details title strictly with Legend size */
.trial-advanced > summary,
.trial-form legend {
  font-size: 16px !important;
  font-weight: 700 !important;
  color: #0213B0 !important;
}
@media (max-width: 768px) {
  .trial-advanced > summary,
  .trial-form legend {
    font-size: 15px !important;
  }
}

/* 4. Match Question lines weight to HOW OFTEN (normal weight) */
.trial-advanced-grid label > span {
  font-weight: 500 !important; /* or normal, whichever matches var(--font-mono) default */
}
`;

fs.writeFileSync('app/globals.css', css + fixCSS);
