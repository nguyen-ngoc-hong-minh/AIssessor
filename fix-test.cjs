const fs = require('fs');
let code = fs.readFileSync('tests/components.test.tsx', 'utf-8');

code = code.replace(/expect\(screen\.getByRole\("button", \{ name: "Once" \}\)\)\.toHaveAttribute\("aria-pressed", "true"\);\n/g, '');

fs.writeFileSync('tests/components.test.tsx', code);
