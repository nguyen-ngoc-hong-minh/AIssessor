const fs = require('fs');
let code = fs.readFileSync('components/workflow-editor.tsx', 'utf-8');

// The original long string of tailwind classes
const oldClasses = 'className="w-5 h-5 rounded-full appearance-none border-2 border-indigo-500/40 checked:bg-indigo-500 checked:border-indigo-500 cursor-pointer transition-all flex-none relative after:content-[\'✓\'] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-[10px] after:font-bold after:opacity-0 checked:after:opacity-100"';
// The new simplified classes
const newClasses = 'className="cursor-pointer flex-none"';

code = code.replace(oldClasses, newClasses);

fs.writeFileSync('components/workflow-editor.tsx', code);
