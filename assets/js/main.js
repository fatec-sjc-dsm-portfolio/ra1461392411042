// Interações do portfólio: tema, menu, revelações, pontos do hero, faixas,
// abas de stack, linha do tempo dos projetos e pequenos detalhes de interface.
(function () {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const cssVar = (name) => getComputedStyle(root).getPropertyValue(name).trim();
  const themeListeners = [];

  // ---- Tema (escuro por padrão) ----
  const themeBtn = $('#theme-toggle');
  function labelTheme() {
    const light = root.dataset.theme === 'light';
    themeBtn.textContent = light ? themeBtn.dataset.dark : themeBtn.dataset.light;
  }
  themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    labelTheme();
    themeListeners.forEach((fn) => fn());
  });
  labelTheme();

  // ---- Menu mobile ----
  const nav = $('#main-nav');
  const menuBtn = $('#menu-toggle');
  const closeMenu = () => { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); };
  menuBtn.addEventListener('click', () => menuBtn.setAttribute('aria-expanded', String(nav.classList.toggle('open'))));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });

  // ---- Seção ativa + pílula deslizante no menu ----
  const navLinks = $$('a[href^="#"]', nav);
  const pill = $('.nav-pill', nav);
  function movePill(a) {
    if (!pill || !a) return;
    pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    pill.style.opacity = 1;
  }
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => {
        const on = a.getAttribute('href') === '#' + entry.target.id;
        a.classList.toggle('active', on);
        if (on) { a.setAttribute('aria-current', 'true'); movePill(a); } else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => { const s = $(a.getAttribute('href')); if (s) sectionObserver.observe(s); });
  addEventListener('resize', () => movePill($('a.active', nav)));

  // ---- Troca de idioma: mantém o projeto ou a seção que está na tela ----
  // (não usa location.hash, que fica "preso" no último link clicado mesmo depois de rolar)
  $$('.lang-btn').forEach((a) => a.addEventListener('click', () => {
    const active = $('a.active', nav);
    const project = $('.tl-item.active');
    const inProjects = active && active.getAttribute('href') === '#projetos-api';
    const atTop = scrollY < innerHeight * 0.5;
    const hash = atTop ? '' : (inProjects && project ? project.getAttribute('href') : (active ? active.getAttribute('href') : ''));
    a.href = a.getAttribute('href').split('#')[0] + hash;
  }));

  // ---- Títulos que entram por máscara, palavra por palavra ----
  $$('.split').forEach((el) => {
    if (!$('.mask', el)) {
      const parts = [];
      Array.from(el.childNodes).forEach((node) => {
        if (node.nodeType === 3) node.textContent.split(/(\s+)/).forEach((t) => parts.push(t));
        else parts.push(node);
      });
      el.textContent = '';
      parts.forEach((p) => {
        if (typeof p === 'string') {
          if (!p) return;
          if (/^\s+$/.test(p)) { el.appendChild(document.createTextNode(' ')); return; }
        }
        const outer = document.createElement('span');
        const inner = document.createElement('span');
        outer.className = 'mask w';
        if (typeof p === 'string') inner.textContent = p; else inner.appendChild(p);
        outer.appendChild(inner);
        el.appendChild(outer);
      });
    }
    $$('.mask', el).forEach((m, i) => m.style.setProperty('--i', i));
  });

  // ---- Revelação ao rolar ----
  $$('.rv').forEach((el) => {
    const sibs = Array.from(el.parentElement.children).filter((c) => c.classList.contains('rv'));
    el.style.setProperty('--d', sibs.indexOf(el) % 6);
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  $$('.rv, .split:not(.hero-name)').forEach((el) => {
    if (reduce) { el.classList.add('in', 'on'); return; }
    revealObserver.observe(el);
  });
  // os medidores usam a classe "on"
  const meterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('on');
      meterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  $$('.meter').forEach((m) => { if (reduce) m.classList.add('on'); else meterObserver.observe(m); });

  // Entrada do hero
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $$('.hero .split, .hero-photo').forEach((el) => el.classList.add('in'));
  }));

  // ---- Barra de leitura + velocidade de rolagem (usada pelas faixas) ----
  const progress = $('.progress');
  let lastY = scrollY;
  let scrollVel = 0;
  let scrollDir = 1;

  // ---- Faixas de tecnologias ----
  // Cada faixa repete o conjunto original até cobrir a tela; o deslocamento volta
  // ao início a cada "largura de um conjunto", o que deixa o loop sem emenda.
  const tapes = $$('.tape-track').map((track, i) => {
    const set = Array.from(track.children);
    const measure = () => set.reduce((w, el) => w + el.getBoundingClientRect().width, 0);
    const width = measure();
    const copies = Math.ceil((Math.max(innerWidth, 1600) * 1.3) / Math.max(width, 1)) + 1;
    for (let c = 0; c < copies; c++) set.forEach((el) => track.appendChild(el.cloneNode(true)));
    return { track, x: 0, width, measure, dir: i % 2 ? 1 : -1 };
  });
  let tapesVisible = true;
  const tapesEl = $('.tapes');
  if (tapesEl) new IntersectionObserver((e) => { tapesVisible = e[0].isIntersecting; }).observe(tapesEl);
  addEventListener('resize', () => tapes.forEach((t) => { t.width = t.measure(); }));

  // ---- Pontos interativos no fundo do hero ----
  const dots = (function () {
    const canvas = $('.hero-dots');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const GAP = 26;
    const RANGE = 170;
    let w = 0, h = 0, pts = [], mx = -9999, my = -9999, base = '', accent = '';
    function colors() { base = 'rgb(' + cssVar('--dot').split(' ').join(',') + ')'; accent = cssVar('--accent'); }
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) pts.push({ x, y, k: 0 });
      draw();
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      let busy = false;
      ctx.globalAlpha = 0.16; ctx.fillStyle = base;
      for (const p of pts) {
        const dx = p.x - mx, dy = p.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        const target = d < RANGE ? 1 - d / RANGE : 0;
        p.k += (target - p.k) * 0.14;
        if (Math.abs(target - p.k) > 0.004) busy = true;
        if (p.k < 0.03) ctx.fillRect(p.x - 0.9, p.y - 0.9, 1.8, 1.8);
      }
      ctx.fillStyle = accent;
      for (const p of pts) {
        if (p.k < 0.03) continue;
        const dx = p.x - mx, dy = p.y - my;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const push = p.k * p.k * 12;
        ctx.globalAlpha = 0.25 + p.k * 0.75;
        ctx.beginPath();
        ctx.arc(p.x + (dx / d) * push, p.y + (dy / d) * push, 1 + p.k * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      return busy;
    }
    colors(); resize();
    addEventListener('resize', resize);
    themeListeners.push(() => { colors(); draw(); });
    let visible = true;
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(canvas);
    if (fine && !reduce) {
      addEventListener('pointermove', (e) => {
        const r = canvas.getBoundingClientRect();
        mx = e.clientX - r.left; my = e.clientY - r.top;
        dots.dirty = true;
      }, { passive: true });
      document.addEventListener('pointerleave', () => { mx = my = -9999; dots.dirty = true; });
    }
    return { dirty: false, step() { if (visible && this.dirty) this.dirty = draw(); } };
  })();

  // ---- Laço de animação único (barra de leitura, faixas e pontos) ----
  let prev = performance.now();
  function tick(now) {
    const dt = Math.min(now - prev, 50);
    prev = now;
    const y = scrollY;
    const dy = y - lastY;
    lastY = y;
    if (dy) scrollDir = dy > 0 ? 1 : -1;
    scrollVel += (Math.abs(dy) - scrollVel) * 0.1;
    if (progress) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    }
    if (!reduce && tapesVisible) {
      const speed = (0.035 + scrollVel * 0.01) * dt;
      tapes.forEach((t) => {
        t.x += speed * t.dir * scrollDir;
        if (t.x <= -t.width) t.x += t.width;
        if (t.x > 0) t.x -= t.width;
        t.track.style.transform = 'translate3d(' + t.x + 'px,0,0)';
      });
    }
    if (dots) dots.step();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ---- Abas da stack ----
  const tabs = $$('[role="tab"]');
  function selectTab(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      const was = t.getAttribute('aria-selected') === 'true';
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panel.hidden = !on;
      if (!on || was) return;
      $$('.meter', panel).forEach((m) => { m.classList.remove('on'); });
      requestAnimationFrame(() => requestAnimationFrame(() => $$('.meter', panel).forEach((m) => m.classList.add('on'))));
      $$('.skill', panel).forEach((el, i) => {
        if (reduce) return;
        el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
          { duration: 500, delay: i * 40, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
      });
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) selectTab(tabs[(i + d + tabs.length) % tabs.length], true);
    });
  });

  // ---- Linha do tempo dos projetos ----
  const tl = $('.tl');
  if (tl) {
    const items = $$('.tl-item', tl);
    const projects = items.map((a) => document.getElementById(a.getAttribute('href').slice(1)));
    function setActive(index) {
      items.forEach((a, i) => {
        a.classList.toggle('active', i === index);
        a.classList.toggle('past', i < index);
        if (i === index) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      // a linha âmbar vai até o ponto do semestre ativo
      const dot = items[index];
      const p = index < 0 ? 0 : (dot.offsetLeft + 6) / tl.clientWidth;
      tl.style.setProperty('--p', Math.min(p, 1).toFixed(3));
      // no celular a linha rola na horizontal: mantém o semestre ativo à vista
      if (index >= 0 && tl.scrollWidth > tl.clientWidth) tl.scrollTo({ left: dot.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
    }
    const projectObserver = new IntersectionObserver(() => {
      // ativo = o último projeto cujo topo já passou da metade de cima da tela
      let index = -1;
      projects.forEach((el, i) => { if (el.getBoundingClientRect().top < innerHeight * 0.45) index = i; });
      setActive(index);
    }, { rootMargin: '-45% 0px -54% 0px' });
    projects.forEach((el) => projectObserver.observe(el));
    // fica compacta quando gruda no topo
    const sentinel = document.createElement('div');
    tl.before(sentinel);
    new IntersectionObserver((e) => tl.classList.toggle('stuck', !e[0].isIntersecting && e[0].boundingClientRect.top < 0),
      { rootMargin: '-90px 0px 0px 0px' }).observe(sentinel);
  }

  // ---- Brilho que segue o cursor e botões magnéticos ----
  if (fine && !reduce) {
    document.addEventListener('pointermove', (e) => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      const r = cell.getBoundingClientRect();
      cell.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      cell.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
    $$('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  // ---- Copiar e-mail ----
  $$('.copy-btn').forEach((btn) => btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const label = btn.textContent;
      btn.textContent = btn.dataset.doneLabel;
      btn.setAttribute('data-done', '');
      setTimeout(() => { btn.textContent = label; btn.removeAttribute('data-done'); }, 2000);
    } catch (e) {
      location.href = 'mailto:' + btn.dataset.copy;
    }
  }));
})();
