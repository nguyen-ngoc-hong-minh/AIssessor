const fs = require('fs');
let code = fs.readFileSync('components/trial-results.tsx', 'utf-8');

// 1. Rename "Your workflow, model by model." and remove fluff
const oldHeading = '<div className="trial-section-heading"><p>WHICH AI FOR WHAT</p><h2>Your workflow, model by model.</h2><span>Model name first. Its exact job second. Access provider stays secondary.</span></div>';
const newHeading = '<div className="trial-section-heading"><h2>Recommended AI Workflow</h2></div>';
code = code.replace(oldHeading, newHeading);

// 2. Insert dividers and remove .trial-bottom-line, .trial-save-panel, .trial-technical
// First, add divider before #ai-team (section 2)
code = code.replace(
  '<section id="ai-team" className="trial-results-section">',
  '<div className="w-full border-t-[1.5px] border-[#0213B0] my-[45px]" />\n      <section id="ai-team" className="trial-results-section">'
);

// Second, we need a divider before `{beforeFooter}` (which is section 3).
// And we need to remove `.trial-bottom-line`.
const bottomLineStart = '<section className="trial-bottom-line">';
const beforeFooterStart = '{beforeFooter}';
const bottomLineIndex = code.indexOf(bottomLineStart);
const beforeFooterIndex = code.indexOf(beforeFooterStart);
if (bottomLineIndex !== -1 && beforeFooterIndex !== -1) {
  // Remove everything from <section className="trial-bottom-line"> up to {beforeFooter}
  code = code.substring(0, bottomLineIndex) + '<div className="w-full border-t-[1.5px] border-[#0213B0] my-[45px]" />\n      ' + code.substring(beforeFooterIndex);
}

// Third, we need a divider before `.trial-optimise-tease`.
// And we need to remove `.trial-save-panel`.
const savePanelStart = '<section className="trial-save-panel">';
const optimiseTeaseStart = '<section className="trial-optimise-tease">';
const savePanelIndex = code.indexOf(savePanelStart);
const optimiseTeaseIndex = code.indexOf(optimiseTeaseStart);
if (savePanelIndex !== -1 && optimiseTeaseIndex !== -1) {
  // Remove from <section className="trial-save-panel"> up to <section className="trial-optimise-tease">
  code = code.substring(0, savePanelIndex) + '<div className="w-full border-t-[1.5px] border-[#0213B0] my-[45px]" />\n      ' + code.substring(optimiseTeaseIndex);
}

// Finally, remove `.trial-technical`
const technicalStart = '<details className="trial-technical">';
const technicalEnd = '</details>';
const technicalIndex = code.indexOf(technicalStart);
const technicalEndIndex = code.indexOf(technicalEnd, technicalIndex);
if (technicalIndex !== -1 && technicalEndIndex !== -1) {
  code = code.substring(0, technicalIndex) + code.substring(technicalEndIndex + technicalEnd.length);
}

fs.writeFileSync('components/trial-results.tsx', code);
