import fs from 'fs';
const hPath = 'd:/english/wordwise.html';
const jPath = 'd:/english/wordwise-app.js';
let h = fs.readFileSync(hPath, 'utf8');
const j = fs.readFileSync(jPath, 'utf8');
const extMarker = '<script src="wordwise-app.js"></script>';
const blockRe = /<script>\r?\n\(function \(\) \{[\s\S]*?\r?\n\}\)\(\);\r?\n\r?\n<\/script>/;
if (h.includes(extMarker)) {
  h = h.replace(extMarker, '<script>\n' + j + '\n</script>');
} else if (blockRe.test(h)) {
  h = h.replace(blockRe, '<script>\n' + j + '\n</script>');
} else {
  console.error('Could not find script block to replace');
  process.exit(1);
}
fs.writeFileSync(hPath, h.replace(/\r\n/g, '\n'));
