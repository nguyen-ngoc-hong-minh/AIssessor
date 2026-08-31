const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

const fixCSS = `

/* ==========================================================================
   STRICT DESIGN SYSTEM ENFORCEMENT - PASS 10 (Optional Details Styling)
   ========================================================================== */

/* 1. Optional details outer box (Hình 1) */
.trial-advanced {
  background: #F8F6E7 !important;
  background-color: #F8F6E7 !important;
  border: none !important;
  border-radius: 0.25rem !important;
  box-shadow: none !important;
}

/* 2. Divider line 1.5px */
.trial-advanced-grid {
  border-top: 1.5px solid #0213B0 !important;
}

/* 3. Optional details title size and weight */
.trial-advanced > summary {
  font-size: clamp(21px, 2vw, 28px) !important;
  font-weight: 700 !important;
  color: #0213B0 !important;
}
@media (max-width: 768px) {
  .trial-advanced > summary {
    font-size: 17px !important;
  }
}

/* 4. Question lines & Commercial use checkbox text (match Hình 2) */
.trial-advanced-grid label > span {
  font-family: var(--font-mono) !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
  color: #0213B0 !important;
}
`;

fs.writeFileSync('app/globals.css', css + fixCSS);
