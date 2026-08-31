(() => {
  const PALETTE = [
    { soft: '#FFE2D4', strong: '#FF5A3C' },
    { soft: '#FCEFC0', strong: '#E8990C' },
    { soft: '#D2EEDC', strong: '#1FA968' },
    { soft: '#DCE0FB', strong: '#4B58E0' },
    { soft: '#EEDDF6', strong: '#8A4BD0' },
    { soft: '#D5EEF2', strong: '#0E94B8' }
  ];

  const PROJECTS = [
    { title: 'Agentic automation platform', role: 'Associate Director', year: '2022 — Now', company: 'Automation Anywhere', blurb: 'Owned vision, roadmap & delivery for two enterprise SaaS products across 0-to-1 & scale >>> MCP architecture, AI Agent Studio, multi-agent systems & connector development.', metric: '0→1→10', metricLabel: 'two enterprise SaaS products', filter: 'ai' },
    { title: 'API-first headless platform', role: 'Associate Director', year: '2022 — Now', company: 'Automation Anywhere', blurb: 'Defined headless platform capabilities so customers, partners & developers can build agentic workflow solutions across enterprise systems.', metric: 'API-first', metricLabel: 'Salesforce, SAP, Oracle & ServiceNow', filter: 'ai' },
    { title: 'Platform leadership & GTM', role: 'Associate Director', year: '2022 — Now', company: 'Automation Anywhere', blurb: 'Led senior PMs and cross-functional engineering teams; drove executive demos, analyst briefings, advisory councils, developer evangelism & sales enablement.', metric: '3 PMs · 5 teams', metricLabel: 'senior PMs & engineering teams', filter: 'ai' },
    { title: 'Citrix developer platform', role: 'Senior Manager, Products', year: '2021 — 2022', company: 'Citrix', blurb: 'Owned developer platform strategy across API Gateway, portal experience, discoverability & onboarding; led DX for NetScaler & Desktop-as-a-Service.', metric: '↑ adoption', metricLabel: 'developer & marketplace adoption', filter: 'platform' },
    { title: 'Global tax & legal compliance', role: 'Senior Product Manager', year: '2010 — 2021', company: 'Dell', blurb: 'Converted evolving regulation into auditable, scalable platform workflows: India GST, Jakarta TIN, Mexico SAT, Peru & Brazil.', metric: '5 countries', metricLabel: 'India, Indonesia, Mexico, Peru & Brazil', filter: 'platform' },
    { title: 'PartnerDirect self-service', role: 'Senior Product Manager', year: '2010 — 2021', company: 'Dell', blurb: 'Cut channel-partner self-service time through workflow simplification & improved digital self-service on partnerdirect.dell.com.', metric: '−50%', metricLabel: 'partner self-service time', filter: 'platform' },
    { title: 'Third-party SKU fulfilment', role: 'Senior Product Manager', year: '2010 — 2021', company: 'Dell', blurb: 'Owned sales-to-fulfilment platform capabilities for third-party vendor SKUs, enabling Day 1 employee productivity. SOC 2, HIPAA & GDPR in scope.', metric: '2×', metricLabel: 'B2C customer satisfaction', filter: 'platform' },
    { title: 'DevOps & release efficiency', role: 'Senior Product Manager', year: '2010 — 2021', company: 'Dell', blurb: 'Led DevOps & release improvements that cut deployment time and raised availability for business-critical systems.', metric: '9→2 hrs', metricLabel: 'deployment time', filter: 'platform' },
    { title: 'Enterprise commerce & CPQ', role: 'Senior Product Manager', year: '2010 — 2021', company: 'Dell', blurb: 'Led product management across sales, commerce, CPQ, fulfilment, payments, finance & partner-facing digital experiences.', metric: 'Global', metricLabel: 'sales, commerce & payment platforms', filter: 'platform' },
    { title: 'The Twenty Handmade Chocolates', role: 'Co-founder', year: '2016 — 2019', company: 'Founder', blurb: 'Co-founded a handmade chocolate gifting service in Bengaluru; partnered with Dunzo, Swiggy & Zomato.', metric: '+10% YoY', metricLabel: '2016–2019 growth', filter: 'founder' }
  ];

  const SEED_POSTS = [
    { id: 1, title: 'Designing MCP architecture for enterprise agents', date: 'Jun 2026', tag: 'AI', summary: 'How we structured the Model Context Protocol layer so multi-agent systems stay composable and secure at enterprise scale.', url: '', upvotes: 0 },
    { id: 2, title: 'From 0 to 1 to 10: scaling two SaaS products', date: 'Apr 2026', tag: 'Product', summary: 'Lessons on momentum, prioritization, and the metrics that actually matter when you take a product from concept to scale.', url: '', upvotes: 0 },
    { id: 3, title: 'What developer evangelism taught me about GTM', date: 'Feb 2026', tag: 'GTM', summary: 'Battlecards, demos, and DeployFest 2026: why the best go-to-market is built with developers, not at them.', url: '', upvotes: 0 }
  ];

  const TWITTER_HANDLE = 'vineetpujari';

  // ── State ──────────────────────────────────────────────────
  let filter = 'all';
  let tileStyle = 'pastel';
  let composerOpen = false;
  let posts = [];
  let media = {};
  let gameActive = false;
  let gameOver = false;
  let score = 0;
  let timeLeft = 30;
  let activeCell = -1;
  let highScore = 0;
  let tickTimer = null;
  let spawnTimer = null;

  // ── Init ───────────────────────────────────────────────────
  function init() {
    try { media = JSON.parse(localStorage.getItem('pm-mockups-media')) || {}; } catch (e) { media = {}; }
    try { highScore = parseInt(localStorage.getItem('pm-choco-highscore') || '0', 10) || 0; } catch (e) {}
    try {
      const raw = localStorage.getItem('pm-blog-posts');
      posts = raw ? (JSON.parse(raw) || []) : SEED_POSTS.slice();
    } catch (e) { posts = SEED_POSTS.slice(); }

    renderWork();
    renderMockups();
    renderBlog();
    renderGame();

    document.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        filter = btn.dataset.filter;
        renderWork();
      });
    });

    document.getElementById('btn-new-post').addEventListener('click', toggleComposer);
    document.getElementById('btn-publish').addEventListener('click', addPost);
    document.getElementById('btn-cancel-post').addEventListener('click', toggleComposer);
    document.getElementById('btn-start-game').addEventListener('click', startGame);
  }

  // ── Work grid ──────────────────────────────────────────────
  function renderWork() {
    document.querySelectorAll('.filter-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    const bold = tileStyle === 'bold';
    const filtered = PROJECTS.filter(p => filter === 'all' || p.filter === filter);
    const counter = document.getElementById('work-counter');
    counter.textContent = String(filtered.length).padStart(2, '0') + ' / ' + String(PROJECTS.length).padStart(2, '0');

    const grid = document.getElementById('work-grid');
    grid.innerHTML = '';

    filtered.forEach((p, i) => {
      const c = PALETTE[i % PALETTE.length];
      const bg = bold ? c.strong : c.soft;
      const fg = bold ? '#FFFFFF' : 'var(--ink)';
      const sub = bold ? 'rgba(255,255,255,.8)' : 'var(--muted)';
      const accent = bold ? '#FFFFFF' : c.strong;
      const borderHover = bold ? 'rgba(255,255,255,.55)' : c.strong;

      const tile = document.createElement('div');
      tile.className = 'work-tile';
      tile.style.background = bg;
      tile.style.animationDelay = (i * 0.05) + 's';
      tile.dataset.hoverBorder = borderHover;

      tile.innerHTML = `
        <div class="tile-top">
          <span class="tile-company" style="color:${fg}"><span class="tile-dot" style="background:${accent}"></span>${esc(p.company)}</span>
          <span class="tile-year" style="color:${sub}">${esc(p.year)}</span>
        </div>
        <div class="tile-body">
          <h3 class="tile-title" style="color:${fg}">${esc(p.title)}</h3>
          <span class="tile-role" style="color:${sub}">${esc(p.role)}</span>
          <p class="tile-blurb" style="color:${sub}">${esc(p.blurb)}</p>
        </div>
        <div class="tile-bottom">
          <div>
            <div class="tile-metric" style="color:${accent}">${esc(p.metric)}</div>
            <div class="tile-metric-label" style="color:${sub}">${esc(p.metricLabel)}</div>
          </div>
          <span class="tile-arrow" style="color:${accent}">→</span>
        </div>`;

      tile.addEventListener('mouseenter', () => {
        tile.style.borderColor = tile.dataset.hoverBorder;
      });
      tile.addEventListener('mouseleave', () => {
        tile.style.borderColor = 'transparent';
      });

      grid.appendChild(tile);
    });
  }

  // ── Mockups ────────────────────────────────────────────────
  const MOCKUP_SLOTS = [
    { id: 'mock-automation360', title: 'Automation 360 · AI Agent Studio', subtitle: 'Agentic automation platform — Automation Anywhere', url: 'automationanywhere.com' },
    { id: 'mock-citrix', title: 'Citrix developer platform', subtitle: 'API gateway & developer portal — Citrix', url: 'developer.citrix.com' },
    { id: 'mock-dell', title: 'Dell PartnerDirect', subtitle: 'Channel self-service & fulfillment — Dell', url: 'partnerdirect.dell.com' },
    { id: 'mock-chocolate', title: 'Handmade chocolate gifting', subtitle: 'Co-founded venture — Bengaluru', url: 'chocolate gifting' }
  ];

  function normalizeVideoUrl(raw) {
    const url = (raw || '').trim();
    if (!url) return null;
    if (/\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url)) return { type: 'file', src: url };
    let m;
    if ((m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i))) return { type: 'embed', src: 'https://www.youtube.com/embed/' + m[1] };
    if ((m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i))) return { type: 'embed', src: 'https://player.vimeo.com/video/' + m[1] };
    if ((m = url.match(/loom\.com\/(?:share|embed)\/([\w-]+)/i))) return { type: 'embed', src: 'https://www.loom.com/embed/' + m[1] };
    return { type: 'embed', src: url };
  }

  function renderMockups() {
    const grid = document.getElementById('mockups-grid');
    grid.innerHTML = '';

    MOCKUP_SLOTS.forEach(slot => {
      const entry = media[slot.id];
      const hasVideo = !!(entry && entry.url);
      const el = document.createElement('div');
      el.className = 'mockup-slot';

      let viewportContent = '';
      let inputRow = '';

      if (hasVideo) {
        const n = normalizeVideoUrl(entry.url);
        if (n.type === 'file') {
          viewportContent = `<video controls playsinline src="${esc(n.src)}" style="width:100%;height:100%;object-fit:cover;background:#000;display:block"></video>`;
        } else {
          viewportContent = `<iframe src="${esc(n.src)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy" style="width:100%;height:100%;border:0;display:block"></iframe>`;
        }
        inputRow = `<button class="btn-remove-video" data-slot="${slot.id}">Remove video</button>`;
      } else {
        viewportContent = `<div class="mockup-placeholder">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          <div>Drop a screenshot</div>
        </div>`;
        inputRow = `<input type="text" placeholder="Paste a video link" data-slot-input="${slot.id}">
          <button class="btn-embed" data-slot-embed="${slot.id}">Embed</button>`;
      }

      el.innerHTML = `
        <div class="mockup-card">
          <div class="browser-chrome">
            <span class="traffic-dot traffic-red"></span>
            <span class="traffic-dot traffic-yellow"></span>
            <span class="traffic-dot traffic-green"></span>
            <span class="url-pill">${esc(slot.url)}</span>
          </div>
          <div class="mockup-viewport">${viewportContent}</div>
        </div>
        <div class="mockup-info">
          <h3>${esc(slot.title)}</h3>
          <span>${esc(slot.subtitle)}</span>
          <div class="mockup-input-row">${inputRow}</div>
        </div>`;

      grid.appendChild(el);
    });

    grid.querySelectorAll('.btn-embed').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.slotEmbed;
        const input = grid.querySelector(`[data-slot-input="${id}"]`);
        const val = (input && input.value || '').trim();
        if (!val) return;
        media[id] = { url: val };
        persistMedia();
        renderMockups();
      });
    });

    grid.querySelectorAll('.btn-remove-video').forEach(btn => {
      btn.addEventListener('click', () => {
        delete media[btn.dataset.slot];
        persistMedia();
        renderMockups();
      });
    });

    grid.querySelectorAll('.mockup-viewport').forEach(vp => {
      if (vp.querySelector('.mockup-placeholder')) {
        const slot = vp.closest('.mockup-slot');
        const slotId = slot.querySelector('[data-slot-input]')?.dataset.slotInput;
        if (!slotId) return;
        setupDragDrop(vp, slotId);
      }
    });
  }

  function setupDragDrop(el, slotId) {
    let depth = 0;
    el.addEventListener('dragenter', e => { e.preventDefault(); depth++; el.style.outline = '2px solid var(--accent)'; });
    el.addEventListener('dragover', e => { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; });
    el.addEventListener('dragleave', () => { if (--depth <= 0) { depth = 0; el.style.outline = ''; } });
    el.addEventListener('drop', e => {
      e.preventDefault(); depth = 0; el.style.outline = '';
      const file = e.dataTransfer?.files?.[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        el.innerHTML = `<img src="${reader.result}" alt="Screenshot">`;
      };
      reader.readAsDataURL(file);
    });
  }

  function persistMedia() {
    try { localStorage.setItem('pm-mockups-media', JSON.stringify(media)); } catch (e) {}
  }

  // ── Blog ───────────────────────────────────────────────────
  function renderBlog() {
    const composer = document.getElementById('composer');
    composer.style.display = composerOpen ? 'block' : 'none';

    const emptyState = document.getElementById('blog-empty');
    const grid = document.getElementById('blog-grid');

    if (posts.length === 0) {
      emptyState.style.display = 'block';
      grid.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    grid.style.display = '';
    grid.innerHTML = '';

    posts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'blog-card';
      card.innerHTML = `
        <div class="blog-card-top">
          <span class="blog-tag">${esc(post.tag)}</span>
          <span class="blog-date">${esc(post.date)}</span>
        </div>
        <h3>${esc(post.title)}</h3>
        <p>${esc(post.summary)}</p>
        <div class="blog-card-bottom">
          ${post.url ? `<a href="${esc(post.url)}" target="_blank" rel="noopener">Read post →</a>` : '<span></span>'}
          <button class="btn-upvote${post.upvoted ? ' upvoted' : ''}" data-post-id="${post.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${post.upvoted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            <span>${post.upvotes || 0}</span>
          </button>
          <button class="btn-remove-post" data-post-id="${post.id}">Remove</button>
        </div>`;
      grid.appendChild(card);
    });

    grid.querySelectorAll('.btn-upvote').forEach(btn => {
      btn.addEventListener('click', () => {
        const post = posts.find(p => p.id === Number(btn.dataset.postId));
        if (!post) return;
        if (post.upvoted) {
          post.upvotes = Math.max(0, (post.upvotes || 0) - 1);
          post.upvoted = false;
        } else {
          post.upvotes = (post.upvotes || 0) + 1;
          post.upvoted = true;
        }
        persistPosts();
        renderBlog();
      });
    });

    grid.querySelectorAll('.btn-remove-post').forEach(btn => {
      btn.addEventListener('click', () => {
        posts = posts.filter(p => p.id !== Number(btn.dataset.postId));
        persistPosts();
        renderBlog();
      });
    });
  }

  function toggleComposer() {
    composerOpen = !composerOpen;
    renderBlog();
  }

  function addPost() {
    const title = document.getElementById('post-title').value.trim();
    if (!title) return;
    const tag = document.getElementById('post-tag').value.trim() || 'Note';
    const date = document.getElementById('post-date').value.trim() || todayStr();
    const summary = document.getElementById('post-summary').value.trim();
    const url = document.getElementById('post-url').value.trim();

    posts.unshift({ id: Date.now(), title, date, tag, summary, url });
    composerOpen = false;
    persistPosts();
    renderBlog();

    ['post-title', 'post-tag', 'post-date', 'post-summary', 'post-url'].forEach(id => {
      document.getElementById(id).value = '';
    });
  }

  function persistPosts() {
    try { localStorage.setItem('pm-blog-posts', JSON.stringify(posts)); } catch (e) {}
  }

  function todayStr() {
    try { return new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); } catch (e) { return ''; }
  }

  // ── Chocolate Dash ─────────────────────────────────────────
  function renderGame() {
    document.getElementById('game-score').textContent = score;
    document.getElementById('game-time').textContent = timeLeft + 's';
    document.getElementById('game-best').textContent = highScore;

    const introEl = document.getElementById('game-intro');
    const activeEl = document.getElementById('game-active-state');
    const overEl = document.getElementById('game-over-state');

    introEl.style.display = (!gameActive && !gameOver) ? 'block' : 'none';
    activeEl.style.display = gameActive ? 'block' : 'none';
    overEl.style.display = gameOver ? 'block' : 'none';

    if (gameOver) {
      document.getElementById('game-final-score').textContent = 'Time! You scored ' + score + '.';
      const tweetText = 'I scored ' + score + ' in Chocolate Dash on Vineet Pujari’s portfolio! @' + TWITTER_HANDLE + ' >>> I want that box of chocolates. #ChocolateDash';
      document.getElementById('tweet-link').href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText);
    }

    for (let i = 0; i < 9; i++) {
      const cell = document.getElementById('cell-' + i);
      if (gameActive && activeCell === i) {
        if (!cell.querySelector('.chocolate')) {
          cell.innerHTML = '<div class="chocolate"></div>';
        }
      } else {
        cell.innerHTML = '';
      }
    }
  }

  function startGame() {
    clearTimers();
    gameActive = true;
    gameOver = false;
    score = 0;
    timeLeft = 30;
    activeCell = Math.floor(Math.random() * 9);
    renderGame();

    tickTimer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearTimers();
        gameActive = false;
        gameOver = true;
        activeCell = -1;
        highScore = Math.max(score, highScore);
        try { localStorage.setItem('pm-choco-highscore', String(highScore)); } catch (e) {}
      }
      renderGame();
    }, 1000);

    spawnTimer = setInterval(() => {
      let n;
      do { n = Math.floor(Math.random() * 9); } while (n === activeCell);
      activeCell = n;
      renderGame();
    }, 760);
  }

  function whack(i) {
    if (!gameActive || i !== activeCell) return;
    score++;
    let n;
    do { n = Math.floor(Math.random() * 9); } while (n === activeCell);
    activeCell = n;
    renderGame();
  }

  function clearTimers() {
    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
    if (spawnTimer) { clearInterval(spawnTimer); spawnTimer = null; }
  }

  // ── Util ───────────────────────────────────────────────────
  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // ── Visitor counter ────────────────────────────────────────
  function initVisitCounter() {
    let visits = parseInt(localStorage.getItem('pm-visit-count') || '0', 10) + 1;
    localStorage.setItem('pm-visit-count', String(visits));
    const el = document.getElementById('visit-counter');
    el.textContent = visits === 1 ? '1 visit' : visits + ' visits';
    let timer = null;
    document.getElementById('hero-photo').addEventListener('click', () => {
      el.classList.add('visible');
      clearTimeout(timer);
      timer = setTimeout(() => el.classList.remove('visible'), 3000);
    });
  }

  // ── Wire up game cells ─────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    init();
    initVisitCounter();
    for (let i = 0; i < 9; i++) {
      document.getElementById('cell-' + i).addEventListener('click', () => whack(i));
    }
    document.getElementById('btn-play-again').addEventListener('click', startGame);
  });
})();
