const fs = require('fs');
let code = fs.readFileSync('components/trial-experience.tsx', 'utf-8');

// Fix the duplicated footer in monthly tasks
code = code.replace(
  '{error && <p className="trial-error trial-field-wide" role="alert">{error}</p>}<div className="trial-form-footer trial-field-wide"><button className="trial-primary-button" disabled={busy || !monthlyTasks.length}>{busy ? <><LoaderCircle className="spin" /> Building your AI stack…</> : <>Find my monthly AI stack <Sparkles /></>}</button><small>We&apos;ll compare your recurring tasks together and go straight to your recommendations.</small></div>\n              {error && <p className="trial-error trial-field-wide" role="alert">{error}</p>}<div className="trial-form-footer trial-field-wide"><button className="trial-primary-button" disabled={busy || !monthlyTasks.length}>{busy ? <><LoaderCircle className="spin" /> Building your AI stack…</> : <>Find my monthly AI stack <Sparkles /></>}</button></div>',
  '{error && <p className="trial-error trial-field-wide" role="alert">{error}</p>}<div className="trial-form-footer trial-field-wide"><button className="trial-primary-button" disabled={busy || !monthlyTasks.length}>{busy ? <><LoaderCircle className="spin" /> Building your AI stack…</> : <>Find my monthly AI stack <Sparkles /></>}</button></div>'
);

fs.writeFileSync('components/trial-experience.tsx', code);
