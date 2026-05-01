const NEW_FACTS = [
  { era: 'cosmic', year: '13.7B BCE', domain: 'space', title: 'Cosmic Microwave Background', body: 'The afterglow of the Big Bang, still detectable everywhere in the universe.', connection: 'A whisper of creation.' },
  { era: 'cosmic', year: '13.2B BCE', domain: 'space', title: 'GN-z11', body: 'One of the oldest known galaxies, observed just 400 million years after the Big Bang.', connection: 'The first lights in the dark.' },
  { era: 'cosmic', year: '12B BCE', domain: 'weird', title: 'The Great Attractor', body: 'A gravitational anomaly pulling our galaxy toward it at 600 km/s.', connection: 'An unseen force steering our fate.' },
  { era: 'cosmic', year: '4.6B BCE', domain: 'science', title: 'Formation of the Sun', body: 'A massive cloud of gas and dust collapsed under its own gravity to form our star.', connection: 'The birth of our local light.' },
  { era: 'cosmic', year: '4.5B BCE', domain: 'history', title: 'Theia Collision', body: 'A Mars-sized body collided with Earth, creating a debris ring that formed the Moon.', connection: 'Violence creating a companion.' },
  
  { era: 'primordial', year: '4.1B BCE', domain: 'science', title: 'Late Heavy Bombardment', body: 'A period when asteroids intensely battered the inner planets.', connection: 'The scars remain on the Moon.' },
  { era: 'primordial', year: '3.8B BCE', domain: 'science', title: 'First Oceans', body: 'Water vapor cooled and rained down for centuries, forming the first oceans.', connection: 'The cradle of all known life.' },
  { era: 'primordial', year: '3.5B BCE', domain: 'science', title: 'Cyanobacteria', body: 'The first organisms to perform photosynthesis, releasing oxygen into the atmosphere.', connection: 'The breath that changed the world.' },
  { era: 'primordial', year: '2.4B BCE', domain: 'weird', title: 'Great Oxidation Event', body: 'Oxygen levels surged, poisoning most early anaerobic life on Earth.', connection: 'A toxic dawn for early microbes.' },
  { era: 'primordial', year: '600M BCE', domain: 'history', title: 'Snowball Earth', body: 'The entire planet froze over, with ice reaching the equator.', connection: 'A frozen pause before the explosion of life.' },

  { era: 'ancient', year: '540M BCE', domain: 'science', title: 'Cambrian Explosion', body: 'A sudden burst of evolutionary innovation, creating the ancestors of most modern animals.', connection: 'Life finds a myriad of ways.' },
  { era: 'ancient', year: '252M BCE', domain: 'weird', title: 'The Great Dying', body: 'The Permian extinction wiped out 96% of all marine species and 70% of terrestrial vertebrates.', connection: 'The closest life came to total annihilation.' },
  { era: 'ancient', year: '66M BCE', domain: 'space', title: 'Chicxulub Impactor', body: 'A 10km asteroid struck Earth, ending the reign of the dinosaurs.', connection: 'Fire from the sky reset the biological clock.' },
  { era: 'ancient', year: '30,000 BCE', domain: 'art', title: 'Chauvet Cave Paintings', body: 'Some of the oldest known figurative cave paintings, depicting horses and rhinos.', connection: 'Humanity begins to record its vision.' },
  { era: 'ancient', year: '3,200 BCE', domain: 'history', title: 'Invention of Cuneiform', body: 'The Sumerians developed one of the earliest systems of writing.', connection: 'History begins to be recorded in clay.' },

  { era: 'classical', year: '2560 BCE', domain: 'history', title: 'Great Pyramid of Giza', body: 'Built for Pharaoh Khufu, it remained the tallest human-made structure for 3,800 years.', connection: 'Monuments to outlast time.' },
  { era: 'classical', year: '1600 BCE', domain: 'weird', title: 'Nebra Sky Disk', body: 'An ancient bronze disk depicting the sun, moon, and stars—the oldest concrete depiction of the cosmos.', connection: 'Early humans looking up in wonder.' },
  { era: 'classical', year: '1200 BCE', domain: 'history', title: 'Late Bronze Age Collapse', body: 'A mysterious societal collapse that wiped out several major civilizations in the Mediterranean.', connection: 'The first great dark age.' },
  { era: 'classical', year: '400 BCE', domain: 'science', title: 'Democritus Atoms', body: 'The Greek philosopher proposed that all matter is composed of indivisible particles.', connection: 'A philosophical guess that proved profoundly true.' },
  { era: 'classical', year: '87 BCE', domain: 'weird', title: 'Antikythera Mechanism', body: 'An ancient Greek analog computer used to predict astronomical positions.', connection: 'Lost technology of the ancient world.' },

  { era: 'medieval', year: '800 CE', domain: 'art', title: 'Book of Kells', body: 'An illuminated manuscript Gospel book, considered a masterwork of Western calligraphy.', connection: 'Preserving knowledge through artistry.' },
  { era: 'medieval', year: '1054 CE', domain: 'space', title: 'Crab Supernova', body: 'A star exploded, visible in daylight for 23 days. Recorded by Chinese and Arab astronomers.', connection: 'A new star blazes and fades.' },
  { era: 'medieval', year: '1347 CE', domain: 'history', title: 'The Black Death', body: 'A devastating global epidemic of bubonic plague that struck Europe and Asia.', connection: 'A biological reset of human society.' },
  { era: 'medieval', year: '1438 CE', domain: 'history', title: 'Inca Empire Expansion', body: 'Pachacuti began the expansion of the Inca Empire across the Andes.', connection: 'A rapid rise to imperial dominance.' },
  { era: 'medieval', year: '1440 CE', domain: 'science', title: 'Gutenberg Press', body: 'Johannes Gutenberg invented the movable-type printing press.', connection: 'The mass distribution of thought begins.' },

  { era: 'renaissance', year: '1504 CE', domain: 'art', title: 'David of Michelangelo', body: 'A masterpiece of Renaissance sculpture, symbolizing strength and youthful beauty.', connection: 'Humanity elevating itself through marble.' },
  { era: 'renaissance', year: '1543 CE', domain: 'science', title: 'Copernican Heliocentrism', body: 'Nicolaus Copernicus published the theory that the Earth revolves around the Sun.', connection: 'A profound shift in our place in the universe.' },
  { era: 'renaissance', year: '1572 CE', domain: 'space', title: "Tycho's Supernova", body: 'Tycho Brahe observed a new star, proving the heavens were not unchanging.', connection: 'Shattering the crystalline spheres.' },
  { era: 'renaissance', year: '1609 CE', domain: 'space', title: "Galileo's Telescope", body: 'Galileo pointed a telescope at the moon and discovered craters and mountains.', connection: 'A closer look at our celestial neighbor.' },
  { era: 'renaissance', year: '1665 CE', domain: 'science', title: 'Discovery of Cells', body: 'Robert Hooke observed cork under a microscope and coined the term "cell".', connection: 'The building blocks of life are revealed.' },

  { era: 'enlightenment', year: '1687 CE', domain: 'science', title: 'Principia Mathematica', body: 'Isaac Newton published his laws of motion and universal gravitation.', connection: 'The universe follows predictable rules.' },
  { era: 'enlightenment', year: '1752 CE', domain: 'weird', title: 'The Lightning Rod', body: 'Benjamin Franklin proved lightning is electricity and invented the lightning rod.', connection: 'Taming the fire from the sky.' },
  { era: 'enlightenment', year: '1781 CE', domain: 'space', title: 'Discovery of Uranus', body: 'William Herschel discovered the first new planet since antiquity.', connection: 'The solar system expands its borders.' },
  { era: 'enlightenment', year: '1789 CE', domain: 'history', title: 'French Revolution', body: 'The fall of the Bastille marked the start of a radical shift in human governance.', connection: 'The dawn of modern democratic ideals.' },
  { era: 'enlightenment', year: '1799 CE', domain: 'history', title: 'Rosetta Stone', body: 'A stone slab discovered in Egypt that allowed scholars to decipher hieroglyphs.', connection: 'A key to unlock ancient voices.' },

  { era: 'industrial', year: '1804 CE', domain: 'history', title: 'First Steam Locomotive', body: 'Richard Trevithick built the first full-scale working railway steam locomotive.', connection: 'The acceleration of human transit.' },
  { era: 'industrial', year: '1859 CE', domain: 'weird', title: 'Carrington Event', body: 'A massive solar storm caused auroras globally and set telegraph lines on fire.', connection: 'The Sun flexes its magnetic muscle.' },
  { era: 'industrial', year: '1888 CE', domain: 'art', title: 'Starry Night', body: 'Vincent van Gogh painted his iconic swirling night sky from an asylum.', connection: 'A tortured mind captures the cosmos.' },
  { era: 'industrial', year: '1895 CE', domain: 'science', title: 'Discovery of X-Rays', body: 'Wilhelm Röntgen discovered a new kind of radiation that could pass through human flesh.', connection: 'Seeing the unseen.' },
  { era: 'industrial', year: '1903 CE', domain: 'history', title: 'First Powered Flight', body: 'The Wright brothers successfully flew the first powered airplane at Kitty Hawk.', connection: 'Humanity slips the surly bonds of Earth.' },

  { era: 'modern', year: '1915 CE', domain: 'science', title: 'General Relativity', body: 'Albert Einstein published his theory describing gravity as the warping of spacetime.', connection: 'The fabric of the universe reimagined.' },
  { era: 'modern', year: '1928 CE', domain: 'science', title: 'Discovery of Penicillin', body: 'Alexander Fleming discovered the first antibiotic by accident.', connection: 'A mold that saved millions of lives.' },
  { era: 'modern', year: '1957 CE', domain: 'space', title: 'Sputnik 1', body: 'The Soviet Union launched the first artificial Earth satellite.', connection: 'The space race begins with a beep.' },
  { era: 'modern', year: '1969 CE', domain: 'space', title: 'Apollo 11', body: 'Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon.', connection: 'A giant leap for mankind.' },
  { era: 'modern', year: '1977 CE', domain: 'space', title: 'Voyager Golden Record', body: 'A phonograph record containing sounds and images of Earth was sent into deep space.', connection: 'A message in a cosmic bottle.' },

  { era: 'digital', year: '1989 CE', domain: 'history', title: 'World Wide Web', body: 'Tim Berners-Lee invented a system of interlinked hypertext documents.', connection: 'The birth of the global brain.' },
  { era: 'digital', year: '1990 CE', domain: 'space', title: 'Pale Blue Dot', body: 'Voyager 1 took a photograph of Earth from 6 billion kilometers away.', connection: 'A mote of dust suspended in a sunbeam.' },
  { era: 'digital', year: '2003 CE', domain: 'science', title: 'Human Genome Project', body: 'An international team completed the mapping of all genes in the human genome.', connection: 'Reading the source code of life.' },
  { era: 'digital', year: '2012 CE', domain: 'science', title: 'Higgs Boson', body: 'CERN scientists confirmed the existence of the particle that gives mass to matter.', connection: 'The final piece of the Standard Model.' },
  { era: 'digital', year: '2021 CE', domain: 'space', title: 'James Webb Space Telescope', body: 'The most powerful telescope ever built was launched to observe the first galaxies.', connection: 'Opening a new eye on the universe.' }
];

module.exports = NEW_FACTS;
