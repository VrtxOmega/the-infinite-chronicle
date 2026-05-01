const fs = require('fs');
let dataContent = fs.readFileSync('data.js', 'utf8');
const match = dataContent.match(/const CHRONICLE_DATA = (\[[\s\S]*\]);/);
if (!match) process.exit(1);

let chronicleData = eval(match[1]);

// Use a Map to keep unique entries based on Title and Year
const uniqueMap = new Map();
chronicleData.forEach(entry => {
    const key = `${entry.title}|${entry.year}`;
    if (!uniqueMap.has(key)) {
        uniqueMap.set(key, entry);
    }
});

const cleanedData = Array.from(uniqueMap.values());
cleanedData.sort((a, b) => a.year - b.year);

const newDataStr = `const CHRONICLE_DATA = ${JSON.stringify(cleanedData, null, 2)};\n`;
fs.writeFileSync('data.js', newDataStr);
console.log(`Cleaned up data.js. Unique entries: ${cleanedData.length} (was ${chronicleData.length})`);
