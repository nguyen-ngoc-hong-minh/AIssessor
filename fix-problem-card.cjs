const fs = require('fs');
let code = fs.readFileSync('components/dashboard-view.tsx', 'utf-8');

const oldCard = `<div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-xs text-indigo-soft uppercase tracking-wider">
                        [{strategy.usageType === "one_off" ? "ONE-OFF PROJECT" : "MONTHLY WORKFLOW"}]
                      </span>
                      {strategy.refreshAvailable && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                          <RefreshCw className="w-3 h-3" />
                          <span>UPDATE AVAILABLE</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-sans text-lg font-medium text-ink truncate">{strategy.title}</h3>

                    <div className="flex items-center gap-3 text-xs text-ink-3 mt-1 font-body">
                      <span>Created: {new Date(strategy.createdAt).toLocaleDateString()}</span>
                      <span>&bull;</span>
                      <span>
                        {strategy.usageType === "one_off"
                          ? strategy.budgetAmount === undefined && strategy.budget === undefined
                            ? "Budget not set"
                            : \`Budget: \${strategy.budgetAmount !== undefined && strategy.budgetCurrency ? formatCurrency(strategy.budgetAmount, strategy.budgetCurrency) : formatCurrency(strategy.budget ?? 0, "USD")}\`
                          : "Recurring Workload"}
                      </span>
                    </div>
                  </div>`;

const newCard = `<div className="min-w-0 flex-1 flex flex-col">
                    <h3 className="font-sans text-xl font-medium text-ink truncate mb-6 pb-2" style={{ borderBottom: '1.5px solid #0213B0' }}>{strategy.title}</h3>

                    <div className="flex flex-col gap-3 font-mono text-sm text-ink-3">
                      <div className="flex items-center gap-3">
                        <span className="uppercase tracking-wider">
                          [{strategy.usageType === "one_off" ? "ONE-OFF PROJECT" : "MONTHLY WORKFLOW"}]
                        </span>
                        {strategy.refreshAvailable && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-500">
                            <RefreshCw className="w-3 h-3" />
                            <span>UPDATE AVAILABLE</span>
                          </span>
                        )}
                      </div>
                      <span>Created: {new Date(strategy.createdAt).toLocaleDateString()}</span>
                      <span>
                        {strategy.usageType === "one_off"
                          ? strategy.budgetAmount === undefined && strategy.budget === undefined
                            ? "Budget not set"
                            : \`Budget: \${strategy.budgetAmount !== undefined && strategy.budgetCurrency ? formatCurrency(strategy.budgetAmount, strategy.budgetCurrency) : formatCurrency(strategy.budget ?? 0, "USD")}\`
                          : "Recurring Workload"}
                      </span>
                    </div>
                  </div>`;

code = code.replace(oldCard, newCard);
fs.writeFileSync('components/dashboard-view.tsx', code);
