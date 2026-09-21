const fs = require('fs');
const path = require('path');
const replacements = [
  // Hex color replacements
  {regex: /#059669/gi, replace: '#059669'},
  {regex: /#059669/gi, replace: '#059669'}, // found some variations
  {regex: /#10b981/gi, replace: '#10b981'},
  {regex: /#047857/gi, replace: '#047857'},
  {regex: /#047857/gi, replace: '#047857'},
  // Tailwind class replacements
  {regex: /emerald/g, replace: 'emerald'}
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.next', '.git', '.kilo'].includes(file)) {
        processDir(fullPath);
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx') || 
          file.endsWith('.md') || file.endsWith('.json') || file.endsWith('.html') || 
          file.endsWith('.css') || file.endsWith('.mjs')) {
        try {
          let content = fs.readFileSync(fullPath, 'utf8');
          let modified = false;
          for (const rep of replacements) {
            if (content.match(rep.regex)) {
              content = content.replace(rep.regex, rep.replace);
              modified = true;
            }
          }
          if (modified) {
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log('Updated: ' + fullPath);
          }
        } catch(e) {
          console.error('Failed to read/write ' + fullPath + ':', e);
        }
      }
    }
  }
}

processDir('.');
console.log('Done');
