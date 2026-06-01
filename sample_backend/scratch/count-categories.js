import fs from 'fs';

const fileContent = fs.readFileSync('prisma/seed.ts', 'utf8');

const categories = [
  { name: 'SCIENCE', pattern: /^\s*\/\/\s*SCIENCE\s*$/i },
  { name: 'HISTORY', pattern: /^\s*\/\/\s*HISTORY\s*$/i },
  { name: 'GEOGRAPHY', pattern: /^\s*\/\/\s*GEOGRAPHY\s*$/i },
  { name: 'MYTHOLOGY', pattern: /^\s*\/\/\s*MYTHOLOGY\s*$/i },
  { name: 'ART', pattern: /^\s*\/\/\s*ART\s*$/i },
  { name: 'ANIMALS', pattern: /^\s*\/\/\s*ANIMALS\s*$/i }
];

const lines = fileContent.split('\n');
let currentCategory = null;
const counts = {};

for (const cat of categories) {
  counts[cat.name] = 0;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if we hit a category header
  for (const cat of categories) {
    if (cat.pattern.test(line)) {
      currentCategory = cat.name;
      break;
    }
  }
  
  // If we are in a category and see a question pattern, check for correctIndex
  if (currentCategory && line.includes('correctIndex:')) {
    counts[currentCategory]++;
  }
}

console.log('Counts:', counts);
const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log('Total:', total);
