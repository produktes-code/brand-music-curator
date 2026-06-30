const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

const files = ['src/App.jsx', 'src/components/MusicUpload.jsx'];
const localesDir = 'src/locales';

if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

let translations = { es: {}, en: {}, de: {}, ru: {}, ja: {}, uk: {}, zh: {} };
let counter = 1;

function slugify(text) {
  if (!text) return `key_${counter++}`;
  let slug = text.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().replace(/_+/g, '_').substring(0, 30);
  if (slug.endsWith('_')) slug = slug.substring(0, slug.length - 1);
  if (slug.startsWith('_')) slug = slug.substring(1);
  if (!slug) return `key_${counter++}`;
  return slug;
}

files.forEach(file => {
  const code = fs.readFileSync(file, 'utf-8');
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });

  traverse(ast, {
    CallExpression(p) {
      if (p.node.callee.name === 't' && p.node.arguments.length === 1 && p.node.arguments[0].type === 'ObjectExpression') {
        const obj = p.node.arguments[0];
        let dict = {};
        
        obj.properties.forEach(prop => {
          if (prop.key && prop.key.name) {
             if (prop.value.type === 'StringLiteral') {
               dict[prop.key.name] = prop.value.value;
             } else if (prop.value.type === 'TemplateLiteral') {
               // We will just extract the raw quasi for now
               // Since the prompt is about strict string translation
               let raw = prop.value.quasis.map(q => q.value.raw).join('{}');
               dict[prop.key.name] = raw;
             }
          }
        });

        if (Object.keys(dict).length > 0) {
           let baseText = dict.en || dict.es || `unnamed_${counter}`;
           let key = slugify(baseText);
           
           // Ensure uniqueness
           while (translations.en[key] && translations.en[key] !== dict.en) {
             key += '_' + counter++;
           }

           Object.keys(translations).forEach(lang => {
              translations[lang][key] = dict[lang] || dict.en || dict.es || '';
           });

           // Replace node argument with string key
           p.node.arguments[0] = { type: 'StringLiteral', value: key };
        }
      }
    }
  });

  const output = generator(ast, { jsescOption: { minimal: true } }, code);
  fs.writeFileSync(file, output.code);
});

// Save JSONs
Object.keys(translations).forEach(lang => {
  fs.writeFileSync(path.join(localesDir, `${lang}.json`), JSON.stringify(translations[lang], null, 2));
});

console.log("Migration complete!");
