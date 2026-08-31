const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

const fixCSS = `

/* ==========================================================================
   STRICT DESIGN SYSTEM ENFORCEMENT - PASS 16 (GLOBAL APPLICATION)
   ========================================================================== */

/* 1. MAIN BACKGROUND & TEXT COLOR */
body, main, .app-shell, .dashboard-layout, #root, #__next, .cl-rootBox, .cl-card {
  background-color: #FFFFF1 !important;
}

/* Force all typical background classes to transparent so body shows through */
.bg-white, .bg-slate-50, .bg-slate-100, .bg-transparent, .glass-card {
  background-color: transparent !important;
}

/* 2. ALL TEXT TO NAVY BLUE */
/* Use a very broad selector to catch Tailwind text classes and Clerk classes */
h1, h2, h3, h4, h5, h6, p, span, li, a, label, legend, div,
[class*="text-slate"], [class*="text-ink"], [class*="text-gray"],
.cl-headerTitle, .cl-headerSubtitle, .cl-dividerText, .cl-formFieldLabel,
.cl-socialButtonsBlockButtonText, .cl-internal-180wb59, .cl-internal-1f2h3nt {
  color: #0213B0 !important;
}

/* EXCEPTIONS: Text inside solid (active/primary) buttons */
button.trial-primary-button, 
button.bg-blue-600,
.cl-formButtonPrimary,
button[aria-pressed="true"],
.plan-cta-btn {
  color: #FFFFF1 !important;
}
button.trial-primary-button *, 
button.bg-blue-600 *,
.cl-formButtonPrimary *,
button[aria-pressed="true"] * {
  color: #FFFFF1 !important;
}

/* 3. TYPE 2 BOXES (Outline / Cards / Secondary Buttons) */
/* Apply 1.5px border, 0.25rem radius, no shadow */
.card, .glass-card, .ui-card, .pricing-deck-card,
.cl-card, .cl-socialButtonsBlockButton, .cl-alert,
[class*="border-slate"], [class*="border-gray"],
button.trial-secondary-button,
button[variant="outline"],
button[variant="ghost"],
.trial-workflow-list article,
.trial-tool-card,
.trial-task-card,
.border,
.rounded-xl {
  border: 1.5px solid #0213B0 !important;
  border-radius: 0.25rem !important;
  box-shadow: none !important;
}

/* Protect Optional Details box (User explicitly requested #F4F7F5, no border) */
.trial-advanced {
  background-color: #F4F7F5 !important;
  border: none !important;
  border-radius: 0.25rem !important;
  box-shadow: none !important;
}

/* 4. TYPE 1 BOXES (Solid Primary Buttons) */
button.trial-primary-button, 
button.bg-blue-600,
.cl-formButtonPrimary,
.plan-cta-btn {
  background-color: #0213B0 !important;
  border: none !important;
  border-radius: 0.25rem !important;
  box-shadow: none !important;
}

/* 5. TYPE 3 BOXES (Inputs / Forms) */
/* Fill #F4F7F5, border bottom ONLY, sharp corners */
input:not([type="checkbox"]):not([type="radio"]), 
select, 
textarea,
.cl-input, 
.cl-select, 
.cl-textarea {
  background-color: #F4F7F5 !important;
  border: none !important;
  border-bottom: 1.5px solid #0213B0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  color: #0213B0 !important;
  padding: 12px 16px !important;
  font-family: var(--font-sans) !important;
  font-size: 14px !important;
  font-weight: 500 !important;
}

/* Placeholders */
input::placeholder, textarea::placeholder, .cl-input::placeholder {
  color: #0213B0 !important;
  opacity: 0.6 !important;
}

/* 6. CHECKBOXES (Strict Square) */
input[type="checkbox"], .cl-checkboxInput {
  background-color: transparent !important;
  border: 1.5px solid #0213B0 !important;
  border-radius: 0.25rem !important;
  appearance: none !important;
  width: 20px !important;
  height: 20px !important;
  position: relative;
  cursor: pointer;
  margin: 0 !important;
}
input[type="checkbox"]:checked, .cl-checkboxInput:checked {
  background-color: #0213B0 !important;
}
input[type="checkbox"]:checked::after, .cl-checkboxInput:checked::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 12px;
  border: solid #FFFFF1;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* 7. DIVIDERS & SEPARATORS */
hr, .cl-dividerLine {
  background-color: #0213B0 !important;
  height: 1.5px !important;
  border: none !important;
}

/* 8. NO HOVER ANIMATIONS GLOBALLY */
*, *:hover {
  box-shadow: none !important;
  transition: none !important;
  transform: none !important;
}
`;

fs.writeFileSync('app/globals.css', css + fixCSS);
