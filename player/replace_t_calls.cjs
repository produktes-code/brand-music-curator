const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const path = require('path');

const localesDir = 'src/locales';
const files = ['src/App.jsx', 'src/components/MusicUpload.jsx'];

// Load existing JSONs
const langs = ['es', 'en', 'de', 'uk', 'ru', 'zh', 'ja'];
let locales = {};
langs.forEach(l => {
  locales[l] = JSON.parse(fs.readFileSync(path.join(localesDir, `${l}.json`), 'utf-8'));
});

let counter = 1;

function slugify(text) {
  let slug = text.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().replace(/_+/g, '_').substring(0, 30);
  if (slug.endsWith('_')) slug = slug.substring(0, slug.length - 1);
  if (slug.startsWith('_')) slug = slug.substring(1);
  return slug || `auto_${counter++}`;
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
               let raw = prop.value.quasis.map(q => q.value.raw).join('{}');
               dict[prop.key.name] = raw;
             }
          }
        });

        if (Object.keys(dict).length > 0) {
           let esText = dict.es || '';
           
           // Find matching key in es.json
           let matchingKey = Object.keys(locales.es).find(k => locales.es[k] === esText);
           
           if (!matchingKey) {
             matchingKey = `auto.${slugify(dict.en || esText)}`;
             while (locales.es[matchingKey] && locales.es[matchingKey] !== esText) {
               matchingKey += '_' + counter++;
             }
             // Add to all JSONs
             langs.forEach(l => {
               locales[l][matchingKey] = dict[l] || dict.en || dict.es || '';
             });
           }

           // Replace node argument with string key
           p.node.arguments[0] = { type: 'StringLiteral', value: matchingKey };
        }
      }
    }
  });

  const output = generator(ast, { jsescOption: { minimal: true } }, code);
  fs.writeFileSync(file, output.code);
});

// Save updated JSONs
langs.forEach(l => {
  fs.writeFileSync(path.join(localesDir, `${l}.json`), JSON.stringify(locales[l], null, 2));
});

console.log("AST transformation complete!");
