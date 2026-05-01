const fs = require('fs');
const https = require('https');

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        const options = new URL(url);
        options.headers = { 'User-Agent': 'Antigravity_Chronicle_Builder/1.0 (dev@example.com)' };
        https.get(options, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return resolve(httpsGet(res.headers.location));
            }
            if (res.statusCode !== 200) {
                return reject(`Status ${res.statusCode}`);
            }
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(body));
        }).on('error', reject);
    });
}

function getEra(year) {
    if (year <= -4000) return 'primordial';
    if (year <= 400) return 'ancient';
    if (year <= 1400) return 'classical'; // classical/medieval overlap, fine
    if (year <= 1600) return 'renaissance';
    if (year <= 1750) return 'enlightenment';
    if (year <= 1900) return 'industrial';
    if (year <= 1990) return 'modern';
    return 'digital';
}

function getDomain(text) {
    const t = text.toLowerCase();
    if (t.includes('space') || t.includes('galaxy') || t.includes('planet') || t.includes('orbit')) return 'space';
    if (t.includes('science') || t.includes('physics') || t.includes('chemistry') || t.includes('biology') || t.includes('species') || t.includes('animal') || t.includes('plant')) return 'science';
    if (t.includes('art') || t.includes('music') || t.includes('painting') || t.includes('album') || t.includes('film') || t.includes('movie') || t.includes('actor')) return 'art';
    if (t.includes('war') || t.includes('battle') || t.includes('empire') || t.includes('king') || t.includes('queen') || t.includes('history')) return 'history';
    return 'weird';
}

function extractYear(text) {
    // Look for (XXXX–YYYY) or (born XXXX) or just a 4 digit year
    const match = text.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/);
    if (match) {
        return parseInt(match[1]);
    }
    // look for BC / BCE
    const bcMatch = text.match(/\b([1-9][0-9]{0,3})\s*(BC|BCE)\b/);
    if (bcMatch) {
        return -parseInt(bcMatch[1]);
    }
    return null;
}

function cleanHTML(str) {
    return str.replace(/<[^>]+>/g, '').replace(/&#160;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\n/g, ' ').trim();
}

async function run() {
    let dataContent = fs.readFileSync('data.js', 'utf8');
    const match = dataContent.match(/const CHRONICLE_DATA = (\[[\s\S]*\]);/);
    if (!match) process.exit(1);
    
    let chronicleData = eval(match[1]);
    const startCount = chronicleData.length;
    let newEntries = [];

    while (newEntries.length < 100) {
        console.log(`Fetching batch... (have ${newEntries.length}/100)`);
        try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&grnlimit=50&prop=extracts&exchars=350&exintro=1&format=json`;
            const resJson = await httpsGet(url);
            const res = JSON.parse(resJson);
            
            if (res.query && res.query.pages) {
                for (let pageId in res.query.pages) {
                    const page = res.query.pages[pageId];
                    if (!page.extract) continue;
                    
                    const cleanText = cleanHTML(page.extract);
                    const year = extractYear(cleanText);
                    
                    if (year !== null) {
                        const title = page.title;
                        const body = cleanText.length > 250 ? cleanText.substring(0, 247) + '...' : cleanText;
                        const domain = getDomain(cleanText);
                        const era = getEra(year);
                        const connection = `A notable fragment of the ${era.charAt(0).toUpperCase() + era.slice(1)} Era.`;
                        
                        newEntries.push({
                            era,
                            year,
                            domain,
                            title,
                            body,
                            connection
                        });
                        
                        if (newEntries.length >= 100) break;
                    }
                }
            }
        } catch (e) {
            console.error("Error fetching", e);
        }
    }

    // Sort the new entries into the array
    chronicleData.push(...newEntries);
    chronicleData.sort((a, b) => a.year - b.year);

    const newDataStr = `const CHRONICLE_DATA = ${JSON.stringify(chronicleData, null, 2)};\n`;
    fs.writeFileSync('data.js', newDataStr);
    console.log(`Added ${newEntries.length} new entries. Total is now ${chronicleData.length}.`);
}

run();
