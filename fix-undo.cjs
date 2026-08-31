const fs = require('fs');
let code = fs.readFileSync('components/trial-experience.tsx', 'utf-8');

// Put back the How often select in monthly task list
code = code.replace(
  '<label><span>Quality needed</span><select aria-label={`Quality for ${task.task}`}',
  '<label><span>How often?</span><select aria-label={`Frequency for ${task.task}`} value={task.frequency} onChange={(event) => { const frequency = event.target.value as MonthlyTask["frequency"]; updateMonthlyTask(task.id, { frequency, monthlyUses: frequencyToMonthlyUses(frequency) }); }}>{monthlyFrequencyValues.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label><label><span>Quality needed</span><select aria-label={`Quality for ${task.task}`}'
);

fs.writeFileSync('components/trial-experience.tsx', code);
