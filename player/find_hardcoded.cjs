const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

const files = ['src/App.jsx', 'src/components/MusicUpload.jsx'];
let hardcodedList = [];
let translations = { es: {}, en: {}, de: {}, ru: {}, ja: {}, uk: {}, zh: {} };

files.forEach(file => {
  const code = fs.readFileSync(file, 'utf-8');
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });

  traverse(ast, {
    JSXText(path) {
      const text = path.node.value.trim();
      // Filter out pure symbols, punctuation, icon names, or short generic text that shouldn't be translated
      const ignored = ['•', 'A', 'Antigravity', 'Brand Music', 'Curator Pro', 'Admin Node', 'Master Control', 'ESPAÑOL', 'ENGLISH', 'DEUTSCH', 'РУССКИЙ', '日本語', 'УКРАЇНСЬКА', '中文', 'GitHub', 'produktes-code'];
      const iconNames = ['expand_more', 'verified_user', 'graphic_eq', 'cloud', 'more_vert', 'shuffle', 'skip_previous', 'skip_next', 'repeat', 'waves', 'auto_awesome', 'sync', 'magic_button', 'mic', 'play_arrow', 'record_voice_over', 'delete', 'download', 'save', 'gpp_bad', 'dashboard', 'map', 'campaign', 'calendar_today', 'settings', 'lock', 'lock_open', 'notifications'];
      
      if (text && /[a-zA-Z]/.test(text) && !ignored.includes(text) && !iconNames.includes(text)) {
        if (!text.startsWith('{') && !text.startsWith('02:') && !text.includes('85%') && !text.includes('2026-06')) {
           hardcodedList.push({ file, line: path.node.loc.start.line, text });
        }
      }
    },
    JSXAttribute(path) {
      if (path.node.name.name === 'placeholder' && path.node.value && path.node.value.type === 'StringLiteral') {
         hardcodedList.push({ file, line: path.node.loc.start.line, text: path.node.value.value, type: 'placeholder' });
      }
    }
  });
});

console.log(JSON.stringify(hardcodedList, null, 2));
