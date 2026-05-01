const fs = require('fs');
const newFacts = require('./more_data.js');

let dataContent = fs.readFileSync('data.js', 'utf8');
const match = dataContent.match(/const CHRONICLE_DATA = (\[[\s\S]*\]);/);
if (!match) process.exit(1);

let chronicleData = eval(match[1]);

// Append new facts
chronicleData = chronicleData.concat(newFacts);

// Write back
const newDataStr = `const CHRONICLE_DATA = ${JSON.stringify(chronicleData, null, 2)};\n`;
fs.writeFileSync('data.js', newDataStr);
console.log(`Appended ${newFacts.length} new facts to data.js`);
