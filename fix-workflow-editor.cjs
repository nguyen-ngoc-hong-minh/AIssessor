const fs = require('fs');
let code = fs.readFileSync('components/workflow-editor.tsx', 'utf-8');

const eyebrowCode = `        <div className="eyebrow justify-center">
          <span className="dt" />
          Project Workflow
        </div>
        
        {/* Div 30px bên dưới eyebrow */}
        <div className="h-[30px]" />`;

code = code.replace(eyebrowCode, '');

fs.writeFileSync('components/workflow-editor.tsx', code);
