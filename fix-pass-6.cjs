const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf-8');

const fixCSS = `

/* ==========================================================================
   STRICT DESIGN SYSTEM ENFORCEMENT - PASS 6 (Custom Budget + Select Chevron)
   ========================================================================== */

/* 1. Custom Budget Box (Hình 2) */
.trial-custom-budget {
  border: none !important;
  border-bottom: 1.5px solid #0213B0 !important;
  border-radius: 0 !important;
  background-color: #F4F7F5 !important;
  background: #F4F7F5 !important;
  padding: 0 16px !important;
}
.trial-custom-budget > span {
  color: #0213B0 !important; /* Currency symbol color */
}
.trial-custom-budget input {
  background-color: transparent !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding-left: 8px !important;
}
.trial-custom-budget input:focus {
  border: none !important;
}

/* 2. Select Chevron for USD $ in Segmented Control (Hình 3) */
/* The select is solid blue, so it needs a WHITE chevron SVG */
.trial-form .trial-budget-row select {
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFF1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") !important;
  background-repeat: no-repeat !important;
  background-position: right 16px center !important; /* Not too close to the edge */
  background-size: 12px auto !important;
  padding-right: 40px !important; /* Leave space for the arrow */
}
`;

fs.writeFileSync('app/globals.css', css + fixCSS);
