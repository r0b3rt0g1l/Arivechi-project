/* ============================================================
   MAIN.JS — Lógica global del Portal de Arivechi
   H. Ayuntamiento de Arivechi, Sonora
   ============================================================ */

(function () {
  'use strict';

  /* === HERO PARALLAX FADE === */
  function initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const content = hero.querySelector('.hero__content');
    let ticking = false;

    function update() {
      const rect = hero.getBoundingClientRect();
      const heroHeight = hero.offsetHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / heroHeight);
      const opacity = Math.max(0, 1 - progress * 1.4);
      const translate = scrolled * 0.35;

      hero.style.opacity = opacity;
      if (content) {
        content.style.transform = 'translateY(' + translate + 'px)';
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  /* === STICKY NAVBAR === */
  function initStickyNav() {
    const navbar = document.querySelector('.navbar');
    const spacer = document.querySelector('.navbar-spacer');
    if (!navbar) return;

    const topbarHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--topbar-height'), 10) || 36;

    let ticking = false;

    function update() {
      const y = window.scrollY;

      if (y > topbarHeight) {
        navbar.classList.add('navbar--sticky');
        if (spacer) spacer.style.display = 'block';
      } else {
        navbar.classList.remove('navbar--sticky');
        if (spacer) spacer.style.display = 'none';
      }

      if (y > 60) {
        navbar.classList.add('navbar--compact');
      } else {
        navbar.classList.remove('navbar--compact');
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  /* === PARALLAX PAGE-HERO === */
  function initPageHeroParallax() {
    const pageHero = document.querySelector('.page-hero');
    if (!pageHero) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let ticking = false;

    function update() {
      const rect = pageHero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        ticking = false;
        return;
      }
      const offset = Math.max(0, -rect.top);
      pageHero.style.setProperty('--parallax-y', (offset * 0.35) + 'px');

      const content = pageHero.querySelector('.container');
      if (content) {
        content.style.transform = 'translateY(' + (offset * 0.12) + 'px)';
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  /* === MENÚ MÓVIL === */
  function initMobileMenu() {
    const hamburger = document.querySelector('.navbar__hamburger');
    const menu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.mobile-menu__close');
    const overlay = document.querySelector('.mobile-menu__overlay');

    if (!hamburger || !menu) return;

    function openMenu() {
      menu.classList.add('mobile-menu--open');
      document.body.style.overflow = 'hidden';
      hamburger.setAttribute('aria-expanded', 'true');
      if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
      menu.classList.remove('mobile-menu--open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
    }

    hamburger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('mobile-menu--open')) {
        closeMenu();
      }
    });

    /* Submenú colapsable en móvil */
    const submenuToggles = menu.querySelectorAll('.mobile-menu__submenu-toggle');
    submenuToggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        const submenu = toggle.nextElementSibling;
        if (!submenu) return;

        const isOpen = submenu.classList.contains('mobile-menu__submenu--open');
        submenu.classList.toggle('mobile-menu__submenu--open');
        toggle.classList.toggle('mobile-menu__submenu-toggle--open');
        toggle.setAttribute('aria-expanded', !isOpen);
      });
    });

    /* Cerrar menú al hacer clic en un link */
    menu.querySelectorAll('a[href]').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });
  }

  /* === DROPDOWN GOBIERNO (DESKTOP) === */
  function initDropdown() {
    const dropdown = document.querySelector('.navbar__dropdown');
    if (!dropdown) return;

    const toggle = dropdown.querySelector('.navbar__dropdown-toggle');
    if (!toggle) return;

    /* En desktop, hover se maneja por CSS. En click: */
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      dropdown.classList.toggle('navbar__dropdown--open');
    });

    /* Cerrar al hacer clic fuera */
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('navbar__dropdown--open');
      }
    });
  }

  /* === SCROLL REVEAL === */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('[data-reveal]');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const parent = el.parentElement;
        const siblings = parent ? parent.querySelectorAll('[data-reveal]') : [];
        let index = 0;

        siblings.forEach(function (sib, i) {
          if (sib === el) index = i;
        });

        const delay = index * 100;
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('revealed');
        observer.unobserve(el);
      });
    }, {
      threshold: 0.12,
      rootMargin: '-40px 0px'
    });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* === ACTIVE PAGE LINK === */
  function initActivePage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    /* Desktop nav */
    document.querySelectorAll('.navbar__link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('#')[0] || 'index.html';
      if (linkPage === page || (page === 'index.html' && linkPage === '')) {
        link.classList.add('navbar__link--active');
      }
    });

    /* Mobile nav */
    document.querySelectorAll('.mobile-menu__link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('#')[0] || 'index.html';
      if (linkPage === page || (page === 'index.html' && linkPage === '')) {
        link.classList.add('mobile-menu__link--active');
      }
    });
  }

  /* === BACK TO TOP === */
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(btn);

    let ticking = false;

    function update() {
      if (window.scrollY > 500) {
        btn.classList.add('back-to-top--visible');
      } else {
        btn.classList.remove('back-to-top--visible');
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    update();
  }

  /* === LIGHTBOX === */
  function initLightbox() {
    const triggers = document.querySelectorAll('[data-lightbox-src]');
    if (!triggers.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Imagen ampliada');
    overlay.innerHTML =
      '<div class="lightbox__content">' +
        '<button type="button" class="lightbox__close" aria-label="Cerrar imagen">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.71L12 12l6.3 6.29-1.42 1.42L10.59 13.4 4.29 19.71 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29 10.59 10.59 16.88 4.29z"/></svg>' +
        '</button>' +
        '<img class="lightbox__image" alt="">' +
        '<span class="lightbox__caption"></span>' +
      '</div>';
    document.body.appendChild(overlay);

    const img = overlay.querySelector('.lightbox__image');
    const caption = overlay.querySelector('.lightbox__caption');
    const closeBtn = overlay.querySelector('.lightbox__close');
    let lastTrigger = null;

    function open(src, captionText, triggerEl) {
      img.src = src;
      img.alt = captionText || '';
      caption.textContent = captionText || '';
      overlay.classList.add('lightbox--open');
      document.body.style.overflow = 'hidden';
      lastTrigger = triggerEl || null;
      closeBtn.focus();
    }

    function close() {
      overlay.classList.remove('lightbox--open');
      document.body.style.overflow = '';
      img.src = '';
      if (lastTrigger && typeof lastTrigger.focus === 'function') {
        lastTrigger.focus();
      }
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        const src = trigger.getAttribute('data-lightbox-src');
        const cap = trigger.getAttribute('data-lightbox-caption') || '';
        if (src) open(src, cap, trigger);
      });
    });

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('lightbox--open')) {
        close();
      }
    });
  }

  /* === SMOOTH SCROLL === */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const hash = link.getAttribute('href');
        if (hash === '#' || hash === '#!') return;

        const target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        /* Actualizar hash sin salto */
        if (history.pushState) {
          history.pushState(null, null, hash);
        }
      });
    });
  }

  /* === FORMULARIO DE CONTACTO (index.html) === */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nombre = form.querySelector('[name="nombre"]');
      const email = form.querySelector('[name="email"]');
      const asunto = form.querySelector('[name="asunto"]');
      const mensaje = form.querySelector('[name="mensaje"]');
      let valid = true;

      /* Limpiar errores previos */
      form.querySelectorAll('.form-error').forEach(function (el) {
        el.textContent = '';
      });
      form.querySelectorAll('.form-input--error, .form-textarea--error, .form-select--error').forEach(function (el) {
        el.classList.remove('form-input--error', 'form-textarea--error', 'form-select--error');
      });

      /* Validar nombre */
      if (nombre && !nombre.value.trim()) {
        showFieldError(nombre, 'Este campo es obligatorio');
        valid = false;
      }

      /* Validar email */
      if (email) {
        if (!email.value.trim()) {
          showFieldError(email, 'Este campo es obligatorio');
          valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          showFieldError(email, 'Correo electrónico inválido');
          valid = false;
        }
      }

      /* Validar asunto */
      if (asunto && !asunto.value) {
        showFieldError(asunto, 'Selecciona un asunto');
        valid = false;
      }

      /* Validar mensaje */
      if (mensaje) {
        if (!mensaje.value.trim()) {
          showFieldError(mensaje, 'Este campo es obligatorio');
          valid = false;
        } else if (mensaje.value.trim().length < 20) {
          showFieldError(mensaje, 'El mensaje debe tener al menos 20 caracteres');
          valid = false;
        }
      }

      if (!valid) return;

      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn.textContent;
      const feedback = document.getElementById('contact-feedback');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Enviando...';
      if (feedback) {
        feedback.hidden = true;
        feedback.textContent = '';
        feedback.classList.remove('contact-feedback--success', 'contact-feedback--error');
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) return response.json();
          return response.json().then(function (data) { throw data; });
        })
        .then(function () {
          const success = document.getElementById('contact-success');
          if (success) {
            form.style.display = 'none';
            success.hidden = false;
          } else if (feedback) {
            feedback.textContent = '¡Mensaje enviado correctamente!';
            feedback.classList.add('contact-feedback--success');
            feedback.hidden = false;
          }
          form.reset();
        })
        .catch(function () {
          if (feedback) {
            feedback.textContent = 'Error al enviar. Intente nuevamente.';
            feedback.classList.add('contact-feedback--error');
            feedback.hidden = false;
          }
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = btnText;
        });
    });

    /* Validación en blur */
    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('blur', function () {
        validateContactField(field);
      });
      field.addEventListener('input', function () {
        if (field.classList.contains('form-input--error') ||
            field.classList.contains('form-textarea--error') ||
            field.classList.contains('form-select--error')) {
          validateContactField(field);
        }
      });
    });
  }

  function validateContactField(field) {
    const errorEl = field.parentElement.querySelector('.form-error');
    if (!errorEl) return;

    errorEl.textContent = '';
    field.classList.remove('form-input--error', 'form-textarea--error', 'form-select--error');

    if (field.required && !field.value.trim()) {
      showFieldError(field, 'Este campo es obligatorio');
      return;
    }

    if (field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      showFieldError(field, 'Correo electrónico inválido');
      return;
    }

    if (field.tagName === 'TEXTAREA' && field.value.trim().length > 0 && field.value.trim().length < 20) {
      showFieldError(field, 'El mensaje debe tener al menos 20 caracteres');
    }
  }

  function showFieldError(field, message) {
    const errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;

    if (field.tagName === 'TEXTAREA') {
      field.classList.add('form-textarea--error');
    } else if (field.tagName === 'SELECT') {
      field.classList.add('form-select--error');
    } else {
      field.classList.add('form-input--error');
    }
  }

  /* === INICIALIZACIÓN === */
  document.addEventListener('DOMContentLoaded', function () {
    initHeroParallax();
    initPageHeroParallax();
    initStickyNav();
    initMobileMenu();
    initDropdown();
    initScrollReveal();
    initActivePage();
    initSmoothScroll();
    initBackToTop();
    initLightbox();
    initContactForm();
  });

})();
