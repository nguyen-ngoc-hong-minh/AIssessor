const fs = require('fs');
let code = fs.readFileSync('components/dashboard-view.tsx', 'utf-8');

// 1. Replace the inner flex column to use gap-6 and remove mb-10 and mt-8
const oldDivStart = '<div className="flex-1 flex flex-col min-w-0">';
const oldDivEnd = '                </div>\n              </div>';

const newDiv = `<div className="flex-1 flex flex-col gap-6 min-w-0">
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
                      className="btn-primary text-[11px] font-bold px-6 py-3 flex items-center justify-center gap-2 mr-4"
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
              </div>`;

const startIndex = code.indexOf(oldDivStart);
const endIndex = code.indexOf(oldDivEnd) + oldDivEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + newDiv + code.substring(endIndex);
  // Repeat to replace the second match if there are multiple? No, there is only one in the map block
} else {
  console.log("Could not find div");
}

fs.writeFileSync('components/dashboard-view.tsx', code);
