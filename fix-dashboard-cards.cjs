const fs = require('fs');
let code = fs.readFileSync('components/dashboard-view.tsx', 'utf-8');

// 1. Fix dash-content-block padding so it aligns left
code = code.replace(
  'className="dash-content-block glass-card p-8 md:p-10 min-h-[485px] flex flex-col justify-between scroll-mt-24"',
  'className="dash-content-block min-h-[485px] flex flex-col justify-between scroll-mt-24"'
);

// 2. Rewrite the problem-card map function completely to implement the new layout
const oldMapStart = '<div className="dashboard-strategy-list">';
const oldMapEnd = '          </div>\n        )}\n      </div>';

const newMap = `<div className="dashboard-strategy-list flex flex-col gap-6">
            {strategies.map((strategy, idx) => (
              <div className="problem-card flex flex-col p-6 md:p-8 relative" key={strategy._id}>
                <div className="font-mono text-xs text-indigo-soft mb-2">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                
                <h3 className="font-sans text-base font-bold text-ink mb-10">
                  {strategy.title}
                </h3>

                <div className="flex flex-col gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                  <span>[{strategy.usageType === "one_off" ? "ONE-OFF PROJECT" : "MONTHLY WORKFLOW"}]</span>
                  <span>Created: {new Date(strategy.createdAt).toLocaleDateString()}</span>
                  <span>
                    {strategy.usageType === "one_off"
                      ? strategy.budgetAmount === undefined && strategy.budget === undefined
                        ? "Budget not set"
                        : \`Budget: \${strategy.budgetAmount !== undefined && strategy.budgetCurrency ? formatCurrency(strategy.budgetAmount, strategy.budgetCurrency) : formatCurrency(strategy.budget ?? 0, "USD")}\`
                      : "Recurring Workload"}
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end mt-8">
                  <Link
                    className="btn-primary text-[11px] uppercase tracking-[0.08em] font-bold px-6 py-3 flex items-center justify-center gap-2"
                    href={\`/strategy/\${strategy._id}/\${strategy.status === "complete" ? "results" : "workflow"}\`}
                    title="Open strategy"
                  >
                    <span>View Plan</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    className="text-[#0213B0] flex items-center justify-center w-12 h-12 flex-none"
                    style={{ borderRadius: "0.25rem", background: "transparent" }}
                    onClick={() => duplicate(strategy._id)}
                    title="Duplicate strategy"
                  >
                    <Copy className="w-5 h-5" />
                  </button>

                  <button
                    className="text-[#0213B0] flex items-center justify-center w-12 h-12 flex-none"
                    style={{ borderRadius: "0.25rem", background: "transparent" }}
                    onClick={() => remove(strategy._id)}
                    title="Delete strategy"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>`;

const startIndex = code.indexOf(oldMapStart);
const endIndex = code.indexOf(oldMapEnd) + oldMapEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newMap + code.substring(endIndex);
  fs.writeFileSync('components/dashboard-view.tsx', code);
  console.log("Successfully replaced strategy list.");
} else {
  console.log("Could not find the map block to replace.");
}
