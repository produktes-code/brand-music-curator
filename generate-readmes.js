const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, 'README.md');
const content = fs.readFileSync(readmePath, 'utf8');

const languages = {
  es: { code: 'es', name: 'Español', title: 'Brand Music Curator V1.0.0 (Español)' },
  en: { code: 'en', name: 'English', title: 'Brand Music Curator V1.0.0 (English)' },
  fr: { code: 'fr', name: 'Français', title: 'Brand Music Curator V1.0.0 (Français)' },
  de: { code: 'de', name: 'Deutsch', title: 'Brand Music Curator V1.0.0 (Deutsch)' },
  pt: { code: 'pt', name: 'Português', title: 'Brand Music Curator V1.0.0 (Português)' },
  it: { code: 'it', name: 'Italiano', title: 'Brand Music Curator V1.0.0 (Italiano)' },
  ja: { code: 'ja', name: '日本語', title: 'Brand Music Curator V1.0.0 (日本語)' },
  ru: { code: 'ru', name: 'Русский', title: 'Brand Music Curator V1.0.0 (Русский)' },
  uk: { code: 'uk', name: 'Українська', title: 'Brand Music Curator V1.0.0 (Українська)' },
  zh: { code: 'zh', name: '中文', title: 'Brand Music Curator V1.0.0 (中文)' }
};

for (const [key, lang] of Object.entries(languages)) {
  const destPath = path.join(__dirname, `README_${key}.md`);
  let newContent = content.replace(/<h1 align="center">.*?<\/h1>/, `<h1 align="center">${lang.title}</h1>`);
  
  // Also add a note at the top
  newContent = `> **Nota:** Esta es la documentación oficial en ${lang.name}.\n\n` + newContent;
  
  fs.writeFileSync(destPath, newContent, 'utf8');
  console.log(`Created README_${key}.md`);
}
