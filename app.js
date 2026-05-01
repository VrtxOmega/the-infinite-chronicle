/* SCROLL v2 — The Infinite Chronicle Engine (Premium) */
(function(){
  const chronicle = document.getElementById('chronicle');
  const scrollBar = document.getElementById('scroll-bar');
  const scrollGlow = document.getElementById('scroll-glow');
  const eraIndicator = document.getElementById('era-indicator');
  const eraLabel = document.getElementById('era-label');
  const eraIcon = document.getElementById('era-icon');
  const eraYear = document.getElementById('era-year');
  const domainLegend = document.getElementById('domain-legend');
  const minimap = document.getElementById('timeline-minimap');
  const minimapThumb = document.querySelector('.minimap-thumb');
  const kbHints = document.getElementById('kb-hints');
  const cosmosCanvas = document.getElementById('cosmos');
  const cosmosCtx = cosmosCanvas.getContext('2d');
  const particleCanvas = document.getElementById('particles');
  const particleCtx = particleCanvas.getContext('2d');
  const eraTransition = document.getElementById('era-transition');
  const eraTransText = eraTransition.querySelector('.era-transition-text');

  /* ===== SOUNDSCAPE MANAGER ===== */
  let audioCtx, masterGain, eraOsc1, eraOsc2, lfo;
  let isAudioMuted = true;
  const audioBtn = document.getElementById('btn-audio');

  function initAudio() {
    if(audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if(!AudioContext) return;
    audioCtx = new AudioContext();

    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioCtx.destination);

    eraOsc1 = audioCtx.createOscillator();
    eraOsc2 = audioCtx.createOscillator();
    eraOsc1.type = 'sine';
    eraOsc2.type = 'triangle';
    
    lfo = audioCtx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 5;
    lfo.connect(lfoGain);
    lfoGain.connect(eraOsc1.frequency);
    lfoGain.connect(eraOsc2.frequency);

    eraOsc1.frequency.value = 110;
    eraOsc2.frequency.value = 112;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    eraOsc1.connect(filter);
    eraOsc2.connect(filter);
    filter.connect(masterGain);

    eraOsc1.start();
    eraOsc2.start();
    lfo.start();
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if(!audioCtx) initAudio();
      if(audioCtx.state === 'suspended') audioCtx.resume();
      isAudioMuted = !isAudioMuted;
      const targetGain = isAudioMuted ? 0 : 0.2;
      masterGain.gain.setTargetAtTime(targetGain, audioCtx.currentTime, 0.5);
      audioBtn.innerHTML = isAudioMuted ? '<i class="fas fa-volume-mute"></i> Soundscape Muted' : '<i class="fas fa-volume-up"></i> Soundscape Active';
      audioBtn.classList.toggle('active', !isAudioMuted);
    });
  }

  function updateAudioForEra(era) {
    if(!audioCtx || isAudioMuted) return;
    const eraFreqs = {
      cosmic: 65.41, primordial: 73.42, ancient: 82.41,
      classical: 98.00, medieval: 110.00, renaissance: 130.81,
      enlightenment: 146.83, industrial: 164.81, modern: 196.00, digital: 220.00
    };
    const freq = eraFreqs[era] || 110;
    eraOsc1.frequency.setTargetAtTime(freq, audioCtx.currentTime, 1);
    eraOsc2.frequency.setTargetAtTime(freq * 1.01, audioCtx.currentTime, 1);
  }

  const DOMAIN_LABELS = {history:'History',space:'Space',science:'Science',art:'Art & Culture',weird:'Edge Case'};
  const DOMAIN_EMOJI = {history:'🌍',space:'🪐',science:'🧬',art:'🎨',weird:'⚡'};
  const ERA_LABELS = {cosmic:'The Cosmic Dawn',primordial:'The Primordial Earth',ancient:'The Ancient World',classical:'The Classical Age',medieval:'The Medieval World',renaissance:'The Renaissance',enlightenment:'The Enlightenment',industrial:'The Industrial Age',modern:'The Modern Era',digital:'The Digital Frontier'};
  const ERA_ICONS = {cosmic:'✦',primordial:'🌋',ancient:'🏛',classical:'⚔',medieval:'🏰',renaissance:'🎨',enlightenment:'💡',industrial:'⚙',modern:'⚛',digital:'◈'};
  const ERA_COLORS = {cosmic:'79,195,247',primordial:'102,187,106',ancient:'232,168,124',classical:'224,192,104',medieval:'201,168,76',renaissance:'221,160,221',enlightenment:'245,230,184',industrial:'160,160,160',modern:'38,198,218',digital:'79,195,247'};

  let rendered = 0;
  const BATCH = 5;
  let currentEra = '';
  let currentDomain = 'all';
  let stars = [];
  let nebulae = [];
  let shootingStars = [];
  let floatingParticles = [];
  let W, H;

  /* ===== RESIZE ===== */
  function resize(){
    W = window.innerWidth; H = window.innerHeight;
    cosmosCanvas.width = W; cosmosCanvas.height = H;
    particleCanvas.width = W; particleCanvas.height = H;
  }

  /* ===== COSMIC CANVAS ===== */
  function initCosmos(){
    stars = [];
    const count = Math.min(350, Math.floor(W*H/4000));
    for(let i=0;i<count;i++){
      stars.push({
        x:Math.random()*W, y:Math.random()*H,
        r:Math.random()*1.8+.2,
        a:Math.random()*.6+.2,
        speed:Math.random()*.002+.0005,
        phase:Math.random()*Math.PI*2,
        hue:220+Math.random()*40
      });
    }
    nebulae = [];
    for(let i=0;i<6;i++){
      nebulae.push({
        x:Math.random()*W, y:Math.random()*H,
        r:180+Math.random()*280,
        hue:240+Math.random()*80,
        sat:40+Math.random()*30,
        drift:(Math.random()-.5)*.15,
        driftX:(Math.random()-.5)*.08,
        phase:Math.random()*Math.PI*2
      });
    }
  }

  /* ===== FLOATING PARTICLES ===== */
  function initParticles(){
    floatingParticles = [];
    for(let i=0;i<80;i++){
      floatingParticles.push({
        x:Math.random()*W, y:Math.random()*H*5,
        r:Math.random()*2+.5,
        speed:Math.random()*.3+.1,
        drift:(Math.random()-.5)*.5,
        a:Math.random()*.15+.02,
        hue:40+Math.random()*20
      });
    }
  }

  /* ===== SHOOTING STARS ===== */
  function spawnShootingStar(){
    if(shootingStars.length>3) return;
    shootingStars.push({
      x:Math.random()*W, y:Math.random()*H*.4,
      vx:3+Math.random()*4, vy:1+Math.random()*2,
      life:1, decay:.008+Math.random()*.01,
      len:40+Math.random()*80
    });
  }

  let tick = 0;
  function drawCosmos(){
    tick++;
    cosmosCtx.clearRect(0,0,W,H);

    // Nebulae
    for(const n of nebulae){
      const breathe = .7+.3*Math.sin(tick*.003+n.phase);
      const g = cosmosCtx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*breathe);
      g.addColorStop(0,`hsla(${n.hue},${n.sat}%,25%,.055)`);
      g.addColorStop(.4,`hsla(${n.hue+15},${n.sat-10}%,18%,.03)`);
      g.addColorStop(1,'transparent');
      cosmosCtx.fillStyle = g;
      cosmosCtx.fillRect(n.x-n.r,n.y-n.r,n.r*2,n.r*2);
      n.y += n.drift; n.x += n.driftX;
      if(n.y<-n.r) n.y=H+n.r;
      if(n.y>H+n.r) n.y=-n.r;
      if(n.x<-n.r) n.x=W+n.r;
      if(n.x>W+n.r) n.x=-n.r;
    }

    // Stars with color
    for(const s of stars){
      const twinkle = .3+.7*Math.sin(tick*s.speed*50+s.phase);
      cosmosCtx.beginPath();
      cosmosCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
      cosmosCtx.fillStyle = `hsla(${s.hue},20%,90%,${s.a*twinkle})`;
      cosmosCtx.fill();
      // Subtle cross on bright stars
      if(s.r>1.2 && twinkle>.7){
        cosmosCtx.strokeStyle = `hsla(${s.hue},30%,85%,${(twinkle-.7)*.3})`;
        cosmosCtx.lineWidth = .5;
        cosmosCtx.beginPath();
        cosmosCtx.moveTo(s.x-s.r*3,s.y);cosmosCtx.lineTo(s.x+s.r*3,s.y);
        cosmosCtx.moveTo(s.x,s.y-s.r*3);cosmosCtx.lineTo(s.x,s.y+s.r*3);
        cosmosCtx.stroke();
      }
    }

    // Shooting stars
    if(Math.random()<.003) spawnShootingStar();
    for(let i=shootingStars.length-1;i>=0;i--){
      const ss = shootingStars[i];
      cosmosCtx.beginPath();
      const g = cosmosCtx.createLinearGradient(ss.x,ss.y,ss.x-ss.vx*ss.len*.15,ss.y-ss.vy*ss.len*.15);
      g.addColorStop(0,`rgba(255,255,255,${ss.life*.6})`);
      g.addColorStop(1,'transparent');
      cosmosCtx.strokeStyle = g;
      cosmosCtx.lineWidth = 1.5;
      cosmosCtx.moveTo(ss.x,ss.y);
      cosmosCtx.lineTo(ss.x-ss.vx*ss.len*.15,ss.y-ss.vy*ss.len*.15);
      cosmosCtx.stroke();
      ss.x+=ss.vx; ss.y+=ss.vy; ss.life-=ss.decay;
      if(ss.life<=0) shootingStars.splice(i,1);
    }

    requestAnimationFrame(drawCosmos);
  }

  /* ===== PARTICLE LAYER (scroll-reactive) ===== */
  let scrollY = 0;
  function drawParticles(){
    particleCtx.clearRect(0,0,W,H);
    const scrollOffset = scrollY * .15;
    for(const p of floatingParticles){
      const py = ((p.y - scrollOffset) % (H*2)) ;
      const adjustedY = py < 0 ? py + H*2 : py;
      if(adjustedY > H+20 || adjustedY < -20) continue;
      particleCtx.beginPath();
      particleCtx.arc(p.x + Math.sin(tick*.01+p.drift)*30, adjustedY, p.r, 0, Math.PI*2);
      particleCtx.fillStyle = `hsla(${p.hue},50%,70%,${p.a})`;
      particleCtx.fill();
    }
    requestAnimationFrame(drawParticles);
  }

  /* ===== FORMAT YEAR ===== */
  function fmtYear(y){
    if(y<=-1e9) return (Math.abs(y)/1e9).toFixed(1)+' billion years ago';
    if(y<=-1e6) return (Math.abs(y)/1e6).toFixed(0)+' million years ago';
    if(y<=-1e4) return Math.abs(y).toLocaleString()+' years ago';
    if(y<0) return Math.abs(y)+' BCE';
    return y+' CE';
  }

  function fmtYearShort(y){
    if(y<=-1e9) return (Math.abs(y)/1e9).toFixed(1)+'B';
    if(y<=-1e6) return (Math.abs(y)/1e6).toFixed(0)+'M';
    if(y<=-1e4) return (Math.abs(y)/1e3).toFixed(0)+'K';
    if(y<0) return Math.abs(y)+' BCE';
    return y+'';
  }

  const DOMAIN_IMAGES = {
    space: 'assets/img_space_1777628517848.png',
    history: 'assets/img_history_1777628532063.png',
    science: 'assets/img_science_1777628546990.png',
    art: 'assets/img_art_1777628559672.png',
    weird: 'assets/img_weird_1777628571793.png'
  };

  /* ===== RENDER ENTRY ===== */
  function renderEntry(d, idx){
    const el = document.createElement('article');
    el.className = `chronicle-entry era-${d.era}`;
    el.id = `entry-${idx}`;
    el.setAttribute('data-domain', d.domain);
    el.setAttribute('data-era', d.era);
    el.setAttribute('data-year', d.year);

    const imageUrl = d.image || DOMAIN_IMAGES[d.domain];

    el.innerHTML = `
      <div class="entry-card has-image">
        <div class="entry-image-container">
          <div class="entry-image" style="background-image: url('${imageUrl}')"></div>
          <div class="entry-image-overlay"></div>
        </div>
        <div class="entry-content">
          <div class="era-decoration"></div>
          <span class="entry-number">${String(idx+1).padStart(2,'0')} / ${CHRONICLE_DATA.length}</span>
          <div class="entry-year-wrap">
            <div class="entry-year">${fmtYear(d.year)}</div>
            <div class="entry-year-line"></div>
          </div>
          <div class="entry-domain" data-domain="${d.domain}">${DOMAIN_EMOJI[d.domain]} ${DOMAIN_LABELS[d.domain]}</div>
          <h2 class="entry-title">${d.title}</h2>
          <p class="entry-body">${d.body}</p>
          <blockquote class="entry-connection">${d.connection}</blockquote>
        </div>
      </div>
    `;

    chronicle.appendChild(el);
    observer.observe(el);
  }

  /* ===== LOAD BATCH ===== */
  function loadBatch(){
    const end = Math.min(rendered+BATCH, CHRONICLE_DATA.length);
    for(let i=rendered;i<end;i++) renderEntry(CHRONICLE_DATA[i], i);
    rendered = end;
    if(rendered >= CHRONICLE_DATA.length){
      document.getElementById('load-sentinel').style.display='none';
    }
  }

  /* ===== ERA TRANSITION ===== */
  function triggerEraTransition(eraName){
    eraTransText.textContent = ERA_LABELS[eraName]||eraName;
    const col = ERA_COLORS[eraName]||'201,168,76';
    eraTransition.style.background = `radial-gradient(ellipse at center, rgba(${col},.08) 0%, transparent 70%)`;
    eraTransition.classList.remove('flash');
    void eraTransition.offsetWidth;
    eraTransition.classList.add('flash');
  }

  /* ===== INTERSECTION OBSERVER ===== */
  const observer = new IntersectionObserver((entries)=>{
    for(const e of entries){
      if(e.isIntersecting){
        e.target.classList.add('visible');
        const era = e.target.getAttribute('data-era');
        if(era && era!==currentEra){
          currentEra = era;
          eraLabel.textContent = ERA_LABELS[currentEra]||currentEra;
          eraIcon.textContent = ERA_ICONS[currentEra]||'✦';
          const yr = e.target.getAttribute('data-year');
          if(yr) eraYear.textContent = fmtYearShort(Number(yr));
          triggerEraTransition(currentEra);
          updateAudioForEra(currentEra);
        }
      }
    }
  },{threshold:.2, rootMargin:'0px 0px -8% 0px'});

  /* ===== SENTINEL OBSERVER ===== */
  const sentinel = document.getElementById('load-sentinel');
  const sentinelObs = new IntersectionObserver((entries)=>{
    if(entries[0].isIntersecting && rendered < CHRONICLE_DATA.length) loadBatch();
  },{rootMargin:'600px'});
  sentinelObs.observe(sentinel);

  /* ===== SCROLL HANDLER ===== */
  let ticking = false;
  window.addEventListener('scroll',()=>{
    scrollY = window.scrollY;
    if(!ticking){
      requestAnimationFrame(()=>{
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h>0 ? (scrollY/h)*100 : 0;
        scrollBar.style.width = pct+'%';
        scrollGlow.style.opacity = pct > 1 ? '1' : '0';

        // Show/hide UI
        const show = scrollY > window.innerHeight*.4;
        eraIndicator.classList.toggle('visible',show);
        domainLegend.classList.toggle('visible',show);
        minimap.classList.toggle('visible',show);
        kbHints.classList.toggle('visible',show);

        // Minimap thumb
        if(minimapThumb){
          const thumbPct = Math.min(pct, 100);
          minimapThumb.style.top = `calc(${thumbPct}% - 12px)`;
        }

        // Parallax title
        const titleScreen = document.getElementById('title-screen');
        if(scrollY < window.innerHeight){
          const p = scrollY/window.innerHeight;
          titleScreen.style.opacity = 1 - p*1.5;
          titleScreen.style.transform = `translateY(${scrollY*.3}px)`;
        }

        ticking = false;
        saveProgress();
      });
      ticking = true;
    }
  });

  /* ===== PERSISTENCE ===== */
  const resumeToast = document.getElementById('resume-toast');
  const btnResume = document.getElementById('btn-resume');
  const btnDismissResume = document.getElementById('btn-dismiss-resume');
  let saveTimeout;

  function saveProgress() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      localStorage.setItem('infinite_chronicle_pos', window.scrollY);
    }, 500);
  }

  function checkPersistence() {
    const savedPos = localStorage.getItem('infinite_chronicle_pos');
    if(savedPos && parseInt(savedPos) > window.innerHeight) {
      if(resumeToast) resumeToast.classList.add('visible');
      
      if(btnResume) {
        btnResume.addEventListener('click', () => {
          // Keep scrolling until we reach the target or run out of content
          const targetY = parseInt(savedPos);
          const scrollInt = setInterval(() => {
            if(document.documentElement.scrollHeight > targetY + window.innerHeight || rendered >= CHRONICLE_DATA.length) {
              clearInterval(scrollInt);
              window.scrollTo({top: targetY, behavior: 'smooth'});
            } else {
              loadBatch(); // Force load more content
            }
          }, 50);
          resumeToast.classList.remove('visible');
        });
      }
      
      if(btnDismissResume) {
        btnDismissResume.addEventListener('click', () => {
          resumeToast.classList.remove('visible');
          localStorage.removeItem('infinite_chronicle_pos');
        });
      }
    }
  }

  /* ===== SEARCH MODAL ===== */
  const btnSearch = document.getElementById('btn-search');
  const searchModal = document.getElementById('search-modal');
  const closeSearch = document.getElementById('btn-close-search');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (btnSearch && searchModal && closeSearch) {
    btnSearch.addEventListener('click', () => {
      searchModal.classList.add('visible');
      if (searchInput) searchInput.focus();
    });

    closeSearch.addEventListener('click', () => {
      searchModal.classList.remove('visible');
      if (searchInput) searchInput.value = '';
      if (searchResults) searchResults.innerHTML = '';
    });

    if (searchInput && searchResults) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        if(!q) {
          searchResults.innerHTML = '';
          return;
        }
        const hits = CHRONICLE_DATA.map((item, idx) => ({item, idx}))
          .filter(x => x.item.title.toLowerCase().includes(q) || x.item.body.toLowerCase().includes(q) || x.item.era.toLowerCase().includes(q))
          .slice(0, 10);
        
        searchResults.innerHTML = hits.map(hit => `
          <div class="search-result-item" data-idx="${hit.idx}">
            <div class="search-result-title">${hit.item.title}</div>
            <div class="search-result-meta">${fmtYearShort(hit.item.year)} • ${DOMAIN_LABELS[hit.item.domain] || hit.item.domain}</div>
          </div>
        `).join('');
      });

      searchResults.addEventListener('click', (e) => {
        const item = e.target.closest('.search-result-item');
        if(item) {
          const idx = parseInt(item.getAttribute('data-idx'), 10);
          searchModal.classList.remove('visible');
          searchInput.value = '';
          searchResults.innerHTML = '';
          
          while(rendered <= idx && rendered < CHRONICLE_DATA.length) {
            loadBatch();
          }
          setTimeout(() => {
            const el = document.getElementById(`entry-${idx}`);
            if(el) el.scrollIntoView({behavior:'smooth', block:'center'});
          }, 100);
        }
      });
    }
  }

  /* ===== DOMAIN FILTER ===== */
  domainLegend.addEventListener('click',(e)=>{
    const btn = e.target.closest('.legend-dot');
    if(!btn) return;
    const domain = btn.getAttribute('data-domain');
    currentDomain = domain;
    domainLegend.querySelectorAll('.legend-dot').forEach(d=>d.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.chronicle-entry').forEach(entry=>{
      if(domain==='all' || entry.getAttribute('data-domain')===domain){
        entry.style.display = '';
      } else {
        entry.style.display = 'none';
      }
    });
  });

  /* ===== KEYBOARD NAV ===== */
  let focusedEntry = -1;
  document.addEventListener('keydown',(e)=>{
    const entries = [...document.querySelectorAll('.chronicle-entry:not([style*="display: none"])')];
    if(e.key==='j' || e.key==='J'){
      e.preventDefault();
      focusedEntry = Math.min(focusedEntry+1, entries.length-1);
      entries[focusedEntry]?.scrollIntoView({behavior:'smooth',block:'center'});
    }
    if(e.key==='k' || e.key==='K'){
      e.preventDefault();
      focusedEntry = Math.max(focusedEntry-1, 0);
      entries[focusedEntry]?.scrollIntoView({behavior:'smooth',block:'center'});
    }
    if(e.key==='f' || e.key==='F'){
      // Cycle domain filter
      const domains = ['all','history','space','science','art','weird'];
      const idx = domains.indexOf(currentDomain);
      const next = domains[(idx+1)%domains.length];
      const btn = domainLegend.querySelector(`[data-domain="${next}"]`);
      if(btn) btn.click();
    }
  });

  /* ===== STAT COUNTER ANIMATION ===== */
  function animateStats(){
    const statEntries = document.getElementById('stat-entries');
    if(!statEntries) return;
    const target = CHRONICLE_DATA.length;
    let current = 0;
    const step = Math.ceil(target/40);
    const iv = setInterval(()=>{
      current = Math.min(current+step, target);
      statEntries.textContent = current;
      if(current>=target) clearInterval(iv);
    }, 40);
  }

  /* ===== INIT ===== */
  window.addEventListener('resize', resize);
  resize();
  initCosmos();
  initParticles();
  drawCosmos();
  drawParticles();
  loadBatch();
  animateStats();
  checkPersistence();

  // Preload all remaining after initial paint
  setTimeout(()=>{
    while(rendered < CHRONICLE_DATA.length) loadBatch();
  }, 800);
})();
