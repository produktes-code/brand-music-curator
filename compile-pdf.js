const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const mdPath = path.join(__dirname, 'Manual_de_Usuario_Brand_Music_Curator.md');
const htmlPath = path.join(__dirname, 'Manual_de_Usuario_Brand_Music_Curator.html');
const pdfPath = path.join(__dirname, 'Manual_de_Usuario_Brand_Music_Curator.pdf');
const pdfPathAlt = path.join(__dirname, 'manual.pdf');

if (!fs.existsSync(mdPath)) {
  console.error("Error: Markdown file not found at " + mdPath);
  process.exit(1);
}

const md = fs.readFileSync(mdPath, 'utf8');

// Parse markdown to HTML (custom simple parser to guarantee zero npm dependency failures)
let lines = md.split('\n');
let htmlBody = '';
let inList = false;

for (let line of lines) {
  line = line.trim();
  if (!line) {
    if (inList) {
      htmlBody += '</ul>\n';
      inList = false;
    }
    continue;
  }

  // Handle headers
  if (line.startsWith('# ')) {
    if (inList) { htmlBody += '</ul>\n'; inList = false; }
    htmlBody += `<h1>${line.substring(2)}</h1>\n`;
  } else if (line.startsWith('## ')) {
    if (inList) { htmlBody += '</ul>\n'; inList = false; }
    htmlBody += `<h2>${line.substring(3)}</h2>\n`;
  } else if (line.startsWith('### ')) {
    if (inList) { htmlBody += '</ul>\n'; inList = false; }
    htmlBody += `<h3>${line.substring(4)}</h3>\n`;
  } else if (line.startsWith('* ') || line.startsWith('- ')) {
    if (!inList) {
      htmlBody += '<ul>\n';
      inList = true;
    }
    let content = line.substring(2);
    // bold tags inside list items
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    htmlBody += `  <li>${content}</li>\n`;
  } else if (line === '---') {
    if (inList) { htmlBody += '</ul>\n'; inList = false; }
    htmlBody += '<hr />\n';
  } else {
    if (inList) { htmlBody += '</ul>\n'; inList = false; }
    // bold tags inside normal text
    let content = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    htmlBody += `<p>${content}</p>\n`;
  }
}
if (inList) {
  htmlBody += '</ul>\n';
}

const fullHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Manual de Usuario - Brand Music Curator</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #222;
    line-height: 1.6;
    padding: 50px;
    max-width: 800px;
    margin: 0 auto;
  }
  h1 {
    font-size: 2.2rem;
    border-bottom: 4px solid #ff2a2a;
    padding-bottom: 12px;
    margin-top: 0;
    color: #111;
  }
  h2 {
    font-size: 1.5rem;
    color: #ff2a2a;
    border-bottom: 1px solid #eee;
    padding-bottom: 6px;
    margin-top: 35px;
  }
  h3 {
    font-size: 1.15rem;
    color: #444;
    margin-top: 25px;
  }
  hr {
    border: 0;
    border-top: 1px solid #ddd;
    margin: 30px 0;
  }
  ul {
    padding-left: 20px;
  }
  li {
    margin-bottom: 8px;
    font-size: 0.95rem;
  }
  p {
    margin-bottom: 15px;
    font-size: 0.95rem;
  }
  strong {
    color: #000;
  }
  @media print {
    body {
      padding: 0;
    }
  }
</style>
</head>
<body>
  ${htmlBody}
</body>
</html>
`;

fs.writeFileSync(htmlPath, fullHtml, 'utf8');
console.log("HTML temporary file written.");

// Try compiling using headless Chrome
const chromePaths = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
  '/Applications/Chromium.app/Contents/MacOS/Chromium'
];

let foundChrome = false;
for (const cp of chromePaths) {
  if (fs.existsSync(cp)) {
    const command = `"${cp}" --headless --disable-gpu --no-sandbox --print-to-pdf="${pdfPath}" "${htmlPath}"`;
    console.log(`Running: ${command}`);
    foundChrome = true;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Chrome compilation failed:", error);
        process.exit(1);
      }
      console.log("SUCCESS: PDF compiled using Chrome.");
      try {
        fs.copyFileSync(pdfPath, pdfPathAlt);
        console.log("SUCCESS: Copied manual to manual.pdf.");
      } catch (e) {
        console.error("Error copying manual.pdf:", e);
      }
      try { fs.unlinkSync(htmlPath); } catch (e) {}
      process.exit(0);
    });
    break;
  }
}

if (!foundChrome) {
  console.log("Google Chrome binary not found. Falling back to alternative PDF tools...");
  // Let's check if we can print it via Safari or cupsfilter as last resort, or keep HTML
  exec(`cupsfilter "${htmlPath}" > "${pdfPath}"`, (err) => {
    if (err) {
      console.error("Alternative cupsfilter failed: ", err);
      process.exit(1);
    }
    console.log("Fallback SUCCESS: PDF manual created via cupsfilter.");
    try {
      fs.copyFileSync(pdfPath, pdfPathAlt);
      console.log("SUCCESS: Copied manual to manual.pdf.");
    } catch (e) {
      console.error("Error copying manual.pdf:", e);
    }
    try { fs.unlinkSync(htmlPath); } catch (e) {}
    process.exit(0);
  });
}
