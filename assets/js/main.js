// Tema, menu mobile, seção ativa, progresso de leitura e animações de entrada
(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Tema (escuro por padrão) ----
  var themeBtn = document.getElementById('theme-toggle');
  themeBtn.addEventListener('click', function () {
    var next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // ---- Troca de idioma: mantém a seção atual (as âncoras são iguais nas duas versões) ----
  Array.prototype.forEach.call(document.querySelectorAll('.lang-btn'), function (a) {
    a.addEventListener('click', function () {
      var current = document.querySelector('.main-nav a.active');
      var hash = location.hash || (current ? current.getAttribute('href') : '');
      a.href = a.getAttribute('href').split('#')[0] + hash;
    });
  });

  // ---- Menu mobile ----
  var menuBtn = document.getElementById('menu-toggle');
  var nav = document.getElementById('main-nav');
  function closeMenu() {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // ---- Cabeçalho e barra de progresso ----
  var header = document.getElementById('site-header');
  var progress = document.getElementById('scroll-progress');
  var ticking = false;
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    header.classList.toggle('scrolled', window.scrollY > 24);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  var hasIO = 'IntersectionObserver' in window;

  // ---- Seção ativa ----
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  if (hasIO) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          var active = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('active', active);
          if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) {
      var s = document.querySelector(a.getAttribute('href'));
      if (s) navObserver.observe(s);
    });
  }

  // ---- Entrada em cascata ao rolar ----
  var groups = [
    '.about-grid > .panel', '.stats > li', '.section-head', '.timeline li', '.project',
    '.job', '.cards > .card', '.cv-grid > .panel', '#curriculo .container > .panel',
    '.contact-list > li'
  ];
  var targets = [];
  groups.forEach(function (sel) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el, i) {
      el.classList.add('reveal');
      if (!el.matches('.project, .section-head')) el.style.setProperty('--d', i % 6);
      targets.push(el);
    });
  });
  if (hasIO && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- Linha do tempo: preenche ao entrar na tela ----
  var timeline = document.querySelector('.timeline ol');
  if (timeline && hasIO && !reduceMotion) {
    timeline.style.setProperty('--tl', 0);
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) { timeline.style.setProperty('--tl', 1); obs.disconnect(); }
    }, { threshold: 0.4 }).observe(timeline);
  }

  // ---- Contadores dos números-resumo ----
  var counters = document.querySelectorAll('.stats [data-count]');
  if (counters.length && hasIO && !reduceMotion) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target, end = +el.dataset.count, start = performance.now();
        (function step(now) {
          var t = Math.min((now - start) / 1200, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3)));
          if (t < 1) requestAnimationFrame(step);
        })(start);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(counters, function (el) { countObserver.observe(el); });
  }

  // ---- Brilho que segue o cursor nos cards ----
  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest('.panel, .card, .job, .contact-list a');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }
})();
