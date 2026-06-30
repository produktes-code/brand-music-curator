import re
import json

files = [
    '/Users/jesusferrer/Desktop/brand-music-curator/player/src/App.jsx',
    '/Users/jesusferrer/Desktop/brand-music-curator/player/src/components/MusicUpload.jsx'
]

hardcoded = []

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
        
        # Look for text inside tags, like >text<
        matches = re.findall(r'>([^<]+)<', line)
        for match in matches:
            text = match.strip()
            if text and not text.startswith('{') and text != 'A':
                hardcoded.append({
                    'file': file_path.split('/')[-1],
                    'line': i + 1,
                    'text': text,
                    'type': 'inner_text'
                })
        
        # Look for placeholders
        if 'placeholder=' in line:
            match = re.search(r'placeholder="([^"]+)"', line)
            if match:
                hardcoded.append({
                    'file': file_path.split('/')[-1],
                    'line': i + 1,
                    'text': match.group(1),
                    'type': 'placeholder'
                })

print(json.dumps(hardcoded, indent=2, ensure_ascii=False))
