const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

const appended = `

/* ==========================================================================
   STRICT DESIGN SYSTEM ENFORCEMENT - PASS 4 (POLISH)
   ========================================================================== */

/* 1. Tooltip Fixes */
/* No fill, no shadow, 0.25rem */
.info-tip > div {
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  border-radius: 0.25rem !important;
}
/* Remove border around the 'i' icon trigger */
.info-tip > summary, .info-tip > button, .info-tip {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
}

/* 2. Currency Select Fix */
/* The select inside budget row should be rounded 0.25rem and look like a solid blue pill (or outline if they want) */
.trial-form .trial-budget-row select {
  border-radius: 0.25rem !important;
  background-color: #0213B0 !important;
  color: #FFFFF1 !important;
  border: none !important;
  background-image: none !important; /* Remove any default dropdown arrows if they interfere, or keep them but ensure no stripes */
}

/* 3. Placeholder Color */
input::placeholder, 
textarea::placeholder,
.cl-formFieldInput::placeholder {
  color: #0213B0 !important;
  opacity: 0.5 !important;
}

/* 4. Remove Stripes/Background Images from Inputs */
input:not([type="checkbox"]):not([type="radio"]), 
textarea, 
select,
.trial-form input,
.trial-form textarea,
.trial-form select,
.cl-formFieldInput {
  background-image: none !important;
}

/* 5. Force Checkbox to be ABSOLUTELY SQUARE */
input[type="checkbox"], 
.cl-checkbox__input,
.cl-formFieldInput[type="checkbox"] {
  width: 20px !important;
  height: 20px !important;
  min-width: 20px !important;
  min-height: 20px !important;
  max-width: 20px !important;
  max-height: 20px !important;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 20px !important;
  aspect-ratio: 1 / 1 !important;
  box-sizing: border-box !important;
  border: 1.5px solid #0213B0 !important;
  border-radius: 0.25rem !important;
}
`;

fs.writeFileSync('app/globals.css', css + appended);
