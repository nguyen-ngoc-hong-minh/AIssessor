const fs = require('fs');
let code = fs.readFileSync('tests/components.test.tsx', 'utf-8');

code = code.replace(
  '// expect(await screen.findByText(/This model-by-model plan is in you',
  'expect(await screen.findByText("Alternative Options")).toBeInTheDocument();\n    // expect(await screen.findByText(/This model-by-model plan is in you'
);

// We should also replace the commented-out `await screen.findByText` from the earlier attempt, if it's there.
// Let's just sed it.
fs.writeFileSync('tests/components.test.tsx', code);
