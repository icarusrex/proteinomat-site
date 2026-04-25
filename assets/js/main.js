/* ========================================================================
   PROTEINOMAT — shared scripts v2
   ======================================================================== */
(function () {
  'use strict';

  const body = document.body;

  // ========== LANGUAGE TOGGLE ==========
  // Body always has exactly one of lang-pt, lang-en, lang-es
  const VALID_LANGS = ['pt', 'en', 'es'];
  let savedLang = localStorage.getItem('pm_lang');
  if (!VALID_LANGS.includes(savedLang)) savedLang = 'pt';
  setLang(savedLang);

  function setLang(lang) {
    if (!VALID_LANGS.includes(lang)) lang = 'pt';
    body.classList.remove('lang-pt', 'lang-en', 'lang-es');
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
    // Hide any static feedback elements the HTML author may have left behind
    form.querySelectorAll('.form-success, .form-error').forEach(el => {
      el.style.setProperty('display', 'none', 'important');
    });

    // Create a single dynamic feedback container appended to the form
    let feedback = form.querySelector('.form-feedback-dynamic');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'form-feedback-dynamic';
      feedback.style.cssText = 'display:none; padding:18px 22px; border-radius:14px; font-size:15px; margin-top:14px; font-weight:600;';
      form.appendChild(feedback);
    }

    const showFeedback = (type) => {
      let lang = 'pt';
      if (document.body.classList.contains('lang-en')) lang = 'en';
      else if (document.body.classList.contains('lang-es')) lang = 'es';
      const messages = {
        success: {
          pt: 'Obrigado. Respondemos em 24–48h.',
          en: "Thanks. We'll reply in 24–48h.",
          es: 'Gracias. Respondemos en 24–48h.'
        },
        error: {
          pt: 'Algo correu mal. Tenta de novo daqui a uns minutos.',
          en: 'Something went wrong. Try again in a moment.',
          es: 'Algo salió mal. Inténtalo de nuevo en un momento.'
        }
      };
      const colors = {
        success: 'background: var(--green, #B8F04A); color: var(--navy, #0A1628);',
        error:   'background: rgba(255, 107, 74, 0.15); color: var(--rust, #FF6B4A); border: 1px solid rgba(255,107,74,0.3);'
      };
      feedback.textContent = messages[type][lang];
      feedback.style.cssText = 'display:block; padding:18px 22px; border-radius:14px; font-size:15px; margin-top:14px; font-weight:600;' + colors[type];
    };

    const hideFeedback = () => {
      feedback.style.cssText = 'display:none;';
    };

    const getLang = () => {
      const b = document.body.classList;
      if (b.contains('lang-en')) return 'en';
      if (b.contains('lang-es')) return 'es';
      return 'pt';
    };

    const sendingLabels = {
      pt: 'A enviar…',
      en: 'Sending…',
      es: 'Enviando…'
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const endpoint = form.getAttribute('action');
      const submitBtn = form.querySelector('button[type="submit"]');

      hideFeedback();

      // Save the original button content so we can restore it later
      let originalBtnHTML = null;
      if (submitBtn) {
        originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.classList.add('is-sending');
        submitBtn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span><span>' + sendingLabels[getLang()] + '</span>';
      }

      try {
        const resp = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (resp.ok) {
          form.reset();
          showFeedback('success');
        } else {
          showFeedback('error');
        }
      } catch (err) {
        showFeedback('error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-sending');
          if (originalBtnHTML !== null) submitBtn.innerHTML = originalBtnHTML;
        }
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
