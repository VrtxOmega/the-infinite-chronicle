const fs = require('fs');
const https = require('https');
const path = require('path');

// Read data.js
let dataContent = fs.readFileSync('data.js', 'utf8');
const match = dataContent.match(/const CHRONICLE_DATA = (\[[\s\S]*\]);/);
if (!match) process.exit(1);

let chronicleData = eval(match[1]);

const DOMAIN_IMAGES = {
    space: 'assets/img_space_1777628517848.png',
    history: 'assets/img_history_1777628532063.png',
    science: 'assets/img_science_1777628546990.png',
    art: 'assets/img_art_1777628559672.png',
    weird: 'assets/img_weird_1777628571793.png'
};

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

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchWikipediaImage(query) {
    try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&prop=pageimages&piprop=original&format=json&gsrlimit=1`;
        const resJson = await httpsGet(searchUrl);
        const res = JSON.parse(resJson);
        
        if (!res.query || !res.query.pages) return null;
        
        const pages = res.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pages[pageId].original && pages[pageId].original.source) {
            let source = pages[pageId].original.source;
            if (source.endsWith('.svg')) return null;
            return source;
        }
        return null;
    } catch(e) {
        return null;
    }
}

async function processData() {
    for (let i = 0; i < chronicleData.length; i++) {
        const entry = chronicleData[i];
        
        console.log(`Processing ${i+1}/${chronicleData.length}: ${entry.title}`);
        if (entry.image && entry.image.startsWith('http')) {
            console.log(`  -> Skipping, already has image: ${entry.image}`);
            continue;
        }
        
        let imgUrl = await fetchWikipediaImage(entry.title);
        
        if (imgUrl) {
            entry.image = imgUrl;
            console.log(`  -> URL: ${imgUrl}`);
        } else {
            console.log(`  -> No image found`);
            entry.image = DOMAIN_IMAGES[entry.domain] || DOMAIN_IMAGES.history;
        }
        
        await sleep(300); // polite delay
    }
    
    const newDataStr = `const CHRONICLE_DATA = ${JSON.stringify(chronicleData, null, 2)};\n`;
    fs.writeFileSync('data.js', newDataStr);
    console.log("Done updating data.js");
}

processData();
