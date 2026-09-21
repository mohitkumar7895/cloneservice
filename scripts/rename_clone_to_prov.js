const fs = require('fs');
const path = require('path');
const replacements = [
  {regex: /Provisioningtech's/g, replace: "Provisioningtech's"},
  {regex: /Provisioningtech/g, replace: 'Provisioningtech'},
  {regex: /Provisioningtech/g, replace: 'Provisioningtech'},
  {regex: /provisioningtech\.com/g, replace: 'provisioningtech.com'},
  {regex: /provisioningtech/g, replace: 'provisioningtech'},
  {regex: /Provisioningtech/g, replace: 'Provisioningtech'},
  {regex: /provisioningtech/g, replace: 'provisioningtech'},
  {regex: /PROVISIONINGTECH/g, replace: 'PROVISIONINGTECH'}
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
          file.endsWith('.md') || file.endsWith('.json') || file.endsWith('.env') || 
          file.endsWith('.sql') || file.endsWith('.html') || file.endsWith('.css') || 
          file.endsWith('.mjs')) {
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
