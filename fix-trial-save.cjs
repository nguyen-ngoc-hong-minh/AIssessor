const fs = require('fs');
let code = fs.readFileSync('components/trial-results.tsx', 'utf-8');

// Insert saveControl back at the end of the div
code = code.replace(
  '</section>\n\n      \n    </div>',
  '</section>\n\n      {mode === "saved" ? saveControl : savedStrategyId ? <Link className="trial-primary-button" href={`/strategy/${savedStrategyId}/results`}>View saved strategy</Link> : saveControl}\n    </div>'
);

fs.writeFileSync('components/trial-results.tsx', code);
