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
    { title: 'Agentic automation platform', role: 'Associate Director', year: '2022 — Now', company: 'Automation Anywhere', blurb: 'Owned vision, roadmap & delivery for two enterprise SaaS products across 0-to-1 & scale >>> connector development, event-based workflows, OAuth flows and ensured parity with private cloud and datacenter deployments', metric: '0→1→10', metricLabel: 'two enterprise SaaS products', filter: 'ai' },
    { title: 'API-first headless platform', role: 'Associate Director', year: '2022 — Now', company: 'Automation Anywhere', blurb: 'Defined headless platform capabilities so customers, partners & developers can build agentic workflow solutions across enterprise systems.', metric: 'API-first', metricLabel: 'Salesforce, SAP, Oracle & ServiceNow', filter: 'ai' },
    { title: 'Platform leadership & GTM', role: 'Associate Director', year: '2022 — Now', company: 'Automation Anywhere', blurb: 'Led senior PMs and cross-functional engineering teams; drove executive demos, analyst briefings, advisory councils, developer evangelism & sales enablement.', metric: '3 PMs · 5 teams', metricLabel: 'senior PMs & engineering teams', filter: 'ai' },
    { title: 'Citrix developer platform', role: 'Senior Manager, Products', year: '2021 — 2022', company: 'Citrix', blurb: 'Owned developer platform strategy across API Gateway, portal experience, discoverability & onboarding; led DX for NetScaler & Desktop-as-a-Service.', metric: '↑ adoption', metricLabel: 'developer & marketplace adoption', filter: 'platform' },
    { title: 'Global tax & legal compliance', role: 'Senior Product Manager', year: '2010 — 2021', company: 'Dell', blurb: 'Converted evolving regulation into auditable, scalable platform workflows: India GST, Jakarta TIN, Mexico SAT, Peru & Brazil.', metric: '5 countries', metricLabel: 'India, Indonesia, Mexico, Peru & Brazil', filter: 'platform' },
    { title: 'PartnerDirect self-service', role: 'Senior Product Manager', year: '2010 — 2021', company: 'Dell', blurb: 'Cut channel-partner self-service time through workflow simplification & improved digital self-service on partnerdirect.dell.com.', metric: '−50%', metricLabel: 'partner self-service time', filter: 'platform' },
    { title: 'Third-party SKU fulfilment', role: 'Senior Product Manager', year: '2010 — 2021', company: 'Dell', blurb: 'Owned sales-to-fulfilment platform capabilities for third-party vendor SKUs, enabling Day 1 employee productivity. SOC 2, HIPAA & GDPR in scope.', metric: '2×', metricLabel: 'B2C customer satisfaction', filter: 'platform' },
    { title: 'DevOps & release efficiency', role: 'Senior Product Manager', year: '2010 — 2021', company: 'Dell', blurb: 'Led DevOps & release improvements that cut deployment time and raised availability for business-critical systems.', metric: '9→2 hrs', metricLabel: 'deployment time', filter: 'platform' },
    { title: 'Enterprise commerce & CPQ', role: 'Senior Product Manager', year: '2010 — 2021', company: 'Dell', blurb: 'Led product management across sales, commerce, CPQ, fulfilment, payments, finance & partner-facing digital experiences.', metric: 'Global', metricLabel: 'sales, commerce & payment platforms', filter: 'platform' },
    { title: 'Twenty Hampers', role: 'Co-founder', year: '2016 — 2019', company: 'Founder', blurb: 'Co-founded a handmade chocolate gifting service in Bengaluru; partnered with Dunzo, Swiggy & Zomato.', metric: '+10% YoY', metricLabel: '2016–2019 growth', filter: 'founder' }
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
  let votes = {};
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
    try { highScore = parseInt(localStorage.getItem('pm-choco-highscore') || '0', 10) || 0; } catch (e) {}
    try { votes = JSON.parse(localStorage.getItem('pm-blog-votes')) || {}; } catch (e) { votes = {}; }

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
    { id: 'mock-automation360', title: 'Automation 360 · Automation Anywhere Cloud Service and Integrations portfolio', subtitle: 'Agentic automation platform — Automation Anywhere', url: 'automationanywhere.com', image: 'mockups/mock-automation360.jpg' },
    { id: 'mock-citrix', title: 'Citrix developer platform', subtitle: 'API gateway & developer portal — Citrix', url: 'developer-docs.citrix.com', image: 'mockups/mock-citrix.jpg' },
    { id: 'mock-dell', title: 'Dell Partner Portal', subtitle: 'Channel self-service & fulfillment — Dell', url: 'delltechnologies.com/partner', image: 'mockups/mock-dell.jpg' },
    { id: 'mock-chocolate', title: 'Twenty Hampers', subtitle: 'Co-founded gifting venture — Bengaluru', url: 'twentyhampers.com', image: 'mockups/mock-chocolate.jpg' }
  ];

  function renderMockups() {
    const grid = document.getElementById('mockups-grid');
    grid.innerHTML = '';

    MOCKUP_SLOTS.forEach(slot => {
      const el = document.createElement('div');
      el.className = 'mockup-slot';
      el.innerHTML = `
        <div class="mockup-card">
          <div class="browser-chrome">
            <span class="traffic-dot traffic-red"></span>
            <span class="traffic-dot traffic-yellow"></span>
            <span class="traffic-dot traffic-green"></span>
            <span class="url-pill">${esc(slot.url)}</span>
          </div>
          <div class="mockup-viewport"><img src="${esc(slot.image)}" alt="${esc(slot.title)}"></div>
        </div>
        <div class="mockup-info">
          <h3>${esc(slot.title)}</h3>
          <span>${esc(slot.subtitle)}</span>
        </div>`;
      grid.appendChild(el);
    });
  }

  // ── Blog ───────────────────────────────────────────────────
  // Posts come from SEED_POSTS; add or edit them in the code. A visitor's
  // upvote is remembered in their own browser only.
  function renderBlog() {
    const grid = document.getElementById('blog-grid');
    grid.innerHTML = '';

    SEED_POSTS.forEach(post => {
      const voted = !!votes[post.id];
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
          <button class="btn-upvote${voted ? ' upvoted' : ''}" data-post-id="${post.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${voted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            <span>${(post.upvotes || 0) + (voted ? 1 : 0)}</span>
          </button>
        </div>`;
      grid.appendChild(card);
    });

    grid.querySelectorAll('.btn-upvote').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.postId;
        if (votes[id]) delete votes[id]; else votes[id] = true;
        try { localStorage.setItem('pm-blog-votes', JSON.stringify(votes)); } catch (e) {}
        renderBlog();
      });
    });
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
