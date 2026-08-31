const fs = require('fs');
let code = fs.readFileSync('app/globals.css', 'utf-8');

// Find the start of Pass 40
const pass40Start = '/* Pass 40: Brutalist styling for Results Page */';
const index = code.indexOf(pass40Start);

if (index !== -1) {
  code = code.substring(0, index).trim() + '\n';
  fs.writeFileSync('app/globals.css', code);
  console.log('Removed Pass 40 CSS');
} else {
  console.log('Pass 40 CSS not found');
}
