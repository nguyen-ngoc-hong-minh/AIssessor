const fs = require('fs');
let code = fs.readFileSync('components/dashboard-view.tsx', 'utf-8');

// Remove the inline border-bottom from title and just make mb large
code = code.replace(
  '<h3 className="font-sans text-xl font-medium text-ink truncate mb-6 pb-2" style={{ borderBottom: \'1.5px solid #0213B0\' }}>',
  '<h3 className="font-sans text-2xl font-medium text-ink truncate mb-8">'
);

// Fix duplicate button
code = code.replace(
  '<button\n                    className="btn-secondary text-xs p-2.5"\n                    onClick={() => duplicate(strategy._id)}\n                    title="Duplicate strategy"\n                  >\n                    <Copy className="w-3.5 h-3.5" />\n                  </button>',
  '<button\n                    className="text-[#0213B0] flex items-center justify-center w-12 h-12 flex-none"\n                    style={{ borderRadius: "0.25rem", background: "transparent" }}\n                    onClick={() => duplicate(strategy._id)}\n                    title="Duplicate strategy"\n                  >\n                    <Copy className="w-5 h-5" />\n                  </button>'
);

// Fix trash button
code = code.replace(
  '<button\n                    className="btn-secondary text-xs p-2.5 hover:text-red-400 hover:border-red-400/40"\n                    onClick={() => remove(strategy._id)}\n                    title="Delete strategy"\n                  >\n                    <Trash2 className="w-3.5 h-3.5" />\n                  </button>',
  '<button\n                    className="text-[#0213B0] flex items-center justify-center w-12 h-12 flex-none"\n                    style={{ borderRadius: "0.25rem", background: "transparent" }}\n                    onClick={() => remove(strategy._id)}\n                    title="Delete strategy"\n                  >\n                    <Trash2 className="w-5 h-5" />\n                  </button>'
);

fs.writeFileSync('components/dashboard-view.tsx', code);
