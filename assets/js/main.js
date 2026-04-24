/* ========================================================================
   PROTEINOMAT — shared scripts v2
   ======================================================================== */
(function () {
  'use strict';

  const body = document.body;

  // ========== LANGUAGE TOGGLE ==========
  // Simple: body always has exactly one of lang-pt or lang-en
  const savedLang = localStorage.getItem('pm_lang') || 'pt';
  setLang(savedLang);

  function setLang(lang) {
    body.classList.remove('lang-pt', 'lang-en');
    body.classList.add('lang-' + lang);
    document.querySelectorAll('[data-set-lang]').forEach(b => {
      b.classList.toggle('active', b.dataset.setLang === lang);
    });
    document.documentElement.lang = lang;
    localStorage.setItem('pm_lang', lang);
  }

  document.querySelectorAll('[data-set-lang]').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.setLang));
  });

  // ========== MOBILE MENU ==========
  const mt = document.getElementById('menuToggle');
  const mm = document.getElementById('mobileMenu');
  if (mt && mm) {
    mt.addEventListener('click', () => mm.classList.toggle('open'));
    mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mm.classList.remove('open')));
  }

  // ========== REVEAL ON SCROLL ==========
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  // ========== NAV SCROLLED STATE ==========
  const nav = document.querySelector('nav.top');
  if (nav) {
    const updateNav = () => {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  // ========== FAQ ACCORDION ==========
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => item.classList.toggle('open'));
  });

  // ========== COOKIE BANNER ==========
  const cookieBanner = document.getElementById('cookieBanner');
  if (cookieBanner) {
    const consent = localStorage.getItem('pm_cookie_consent');
    if (!consent) setTimeout(() => cookieBanner.classList.add('visible'), 900);
    document.querySelectorAll('[data-cookie-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem('pm_cookie_consent', btn.dataset.cookieAction);
        cookieBanner.classList.remove('visible');
      });
    });
  }

  // ========== FORMSPREE ==========
  document.querySelectorAll('form[data-formspree]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const endpoint = form.getAttribute('action');
      const allFeedback = form.querySelectorAll('.form-success, .form-error');
      const successEls = form.querySelectorAll('.form-success');
      const errorEls = form.querySelectorAll('.form-error');
      const submitBtn = form.querySelector('button[type="submit"]');

      // Hide all feedback messages before new submission
      allFeedback.forEach(el => el.classList.remove('show'));
      if (submitBtn) submitBtn.disabled = true;

      try {
        const resp = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        // Ensure absolutely nothing is shown before picking one
        allFeedback.forEach(el => el.classList.remove('show'));
        if (resp.ok) {
          form.reset();
          successEls.forEach(el => el.classList.add('show'));
        } else {
          errorEls.forEach(el => el.classList.add('show'));
        }
      } catch (err) {
        allFeedback.forEach(el => el.classList.remove('show'));
        errorEls.forEach(el => el.classList.add('show'));
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });

  // ========== FAQ TABS (for /faq/ page) ==========
  document.querySelectorAll('.faq-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const panel = tab.dataset.panel;
      document.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active'));
      // Activate all tabs with same panel (PT + EN variants both get .active)
      document.querySelectorAll(`.faq-tab[data-panel="${panel}"]`).forEach(t => t.classList.add('active'));
      document.querySelectorAll('.faq-panel').forEach(p => p.classList.remove('active'));
      const panelEl = document.getElementById('panel-' + panel);
      if (panelEl) panelEl.classList.add('active');
    });
  });
})();
