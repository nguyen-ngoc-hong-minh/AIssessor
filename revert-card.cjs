const fs = require('fs');

// 1. Revert CSS
let css = fs.readFileSync('app/globals.css', 'utf-8');
css = css.replace(
  '/* DASHBOARD STRATEGY CARD OVERRIDE REMOVED - NOW USING TAILWIND UTILITIES */',
  '/* DASHBOARD STRATEGY CARD OVERRIDE */\n.problem-card {\n  background-color: #F4F7F5 !important;\n  border: none !important;\n  border-radius: 0.25rem !important;\n}'
);
fs.writeFileSync('app/globals.css', css);

// 2. Revert JSX
let code = fs.readFileSync('components/dashboard-view.tsx', 'utf-8');
const oldMapStart = '<div className="dashboard-strategy-list flex flex-col">';
const oldMapEnd = '          </div>\n        )}\n      </div>';

const restoredMap = `<div className="dashboard-strategy-list flex flex-col gap-6">
            {strategies.map((strategy, idx) => (
              <div className="problem-card flex items-start gap-6 p-6 md:p-8" key={strategy._id}>
                <div className="font-mono text-xs text-indigo-soft mt-1">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                
                <div className="flex-1 flex flex-col gap-6 min-w-0">
                  <h3 className="font-sans text-base font-bold text-ink">
                    {strategy.title}
                  </h3>

                  <div className="flex flex-col gap-3 font-mono text-[11px] text-ink-3">
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

                  <div className="flex items-center self-start">
                    <Link
                      className="btn-primary text-[11px] font-bold px-6 py-3 flex items-center justify-center gap-3 mr-3"
                      href={\`/strategy/\${strategy._id}/\${strategy.status === "complete" ? "results" : "workflow"}\`}
                      title="Open strategy"
                    >
                      <span>View plan</span>
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
              </div>
            ))}
          </div>
        )}
      </div>`;

const startIndex = code.indexOf(oldMapStart);
const endIndex = code.indexOf(oldMapEnd) + oldMapEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + restoredMap + code.substring(endIndex);
  fs.writeFileSync('components/dashboard-view.tsx', code);
  console.log("Successfully reverted strategy list.");
} else {
  console.log("Could not find the map block to replace.");
}

