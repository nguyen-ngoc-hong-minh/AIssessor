const fs = require('fs');
let code = fs.readFileSync('components/trial-experience.tsx', 'utf-8');

// Remove redundant small texts in workflow phase
code = code.replace(
  '<span className="active">2</span><i /><span>3</span><small>Tell us → Review workflow → See your stack</small>',
  '<span className="active">2</span><i /><span>3</span>'
);

// Remove redundant span in workflow phase heading
code = code.replace(
  '<h1>Here&apos;s how we understood<br />your work.</h1><span>Check the steps below. They describe your project—not AI architecture.</span>',
  '<h1>Here&apos;s how we understood<br />your work.</h1>'
);

// Remove redundant small texts in results phase
code = code.replace(
  '<span className="active">2</span><small>Set recurring tasks → See your AI stack</small>',
  '<span className="active">2</span>'
);
code = code.replace(
  '<span className="active">3</span><small>Tell us → Review workflow → See your stack</small>',
  '<span className="active">3</span>'
);

fs.writeFileSync('components/trial-experience.tsx', code);
