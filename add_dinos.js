const fs = require('fs');

const dinoEntries = [
    {
        "era": "primordial",
        "year": -230000000,
        "domain": "science",
        "title": "Dawn of the Dinosaurs",
        "body": "The first true dinosaurs appear during the late Triassic period. Initially small and bipedal, these early reptiles quickly diversify into a staggering array of forms, taking advantage of ecological niches left vacant by earlier mass extinctions.",
        "connection": "A foundational moment in Earth's history, sparking a reign that would last over 160 million years."
    },
    {
        "era": "primordial",
        "year": -155000000,
        "domain": "science",
        "title": "The Stegosaurus Roams",
        "body": "Stegosaurus, the iconic plated dinosaur, flourishes in western North America during the Late Jurassic. With its distinct kite-shaped plates and spiked tail (the thagomizer), it represents one of the most recognizable herbivorous species of the era.",
        "connection": "Its strange anatomy still puzzles modern paleontologists regarding the exact function of its plates."
    },
    {
        "era": "primordial",
        "year": -150000000,
        "domain": "science",
        "title": "Diplodocus and the Giants",
        "body": "The Jurassic period sees the rise of sauropods, enormous long-necked dinosaurs. Diplodocus, reaching up to 90 feet in length, uses its whip-like tail for defense while grazing on tall conifers and ferns across vast floodplains.",
        "connection": "These titans pushed the absolute biological limits of size for land-dwelling animals."
    },
    {
        "era": "primordial",
        "year": -68000000,
        "domain": "science",
        "title": "The Apex Predator: Tyrannosaurus Rex",
        "body": "Tyrannosaurus Rex, one of the largest meat-eating dinosaurs, emerges in the late Cretaceous. Equipped with massive jaws capable of a bone-crushing bite force, it rules the North American continent as a formidable apex predator.",
        "connection": "The T-Rex remains a cultural icon, symbolizing the awe-inspiring power of prehistoric life."
    },
    {
        "era": "primordial",
        "year": -68000000,
        "domain": "science",
        "title": "Triceratops: The Horned Defender",
        "body": "Sharing the landscape with T. Rex is Triceratops, a massive ceratopsian adorned with a bony frill and three sharp horns. Often clashing with predators, its defensive armor is a striking example of evolutionary arms races.",
        "connection": "Fossil evidence of healed bite marks proves these epic prehistoric battles truly happened."
    },
    {
        "era": "primordial",
        "year": -75000000,
        "domain": "science",
        "title": "Velociraptor Hunts in the Dunes",
        "body": "Far from its cinematic exaggerations, the real Velociraptor is a turkey-sized, feathered predator stalking the arid deserts of Mongolia. Despite its size, its sickle-shaped claw makes it a lethal, agile hunter.",
        "connection": "A vital evolutionary link cementing the connection between theropod dinosaurs and modern birds."
    },
    {
        "era": "primordial",
        "year": -66000000,
        "domain": "science",
        "title": "The Chicxulub Impact",
        "body": "A colossal asteroid roughly 6 miles wide slams into the Yucatán Peninsula. The resulting megatsunamis, global wildfires, and 'impact winter' cause the Cretaceous-Paleogene extinction event, abruptly ending the age of non-avian dinosaurs.",
        "connection": "The apocalyptic end of the dinosaurs cleared the evolutionary path for the rise of mammals."
    }
];

let dataContent = fs.readFileSync('data.js', 'utf8');
const match = dataContent.match(/const CHRONICLE_DATA = (\[[\s\S]*\]);/);
if (!match) process.exit(1);

let chronicleData = eval(match[1]);
chronicleData.push(...dinoEntries);
chronicleData.sort((a, b) => a.year - b.year);

const newDataStr = `const CHRONICLE_DATA = ${JSON.stringify(chronicleData, null, 2)};\n`;
fs.writeFileSync('data.js', newDataStr);
console.log(`Added ${dinoEntries.length} dinosaur entries. Total is now ${chronicleData.length}.`);
