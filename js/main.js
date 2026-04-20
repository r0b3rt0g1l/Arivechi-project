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

    function handleScroll() {
      if (window.scrollY > topbarHeight) {
        navbar.classList.add('navbar--sticky');
        if (spacer) spacer.style.display = 'block';
      } else {
        navbar.classList.remove('navbar--sticky');
        if (spacer) spacer.style.display = 'none';
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
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

        const delay = index * 80;
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

      /* Simulación de envío */
      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn.textContent;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Enviando...';

      setTimeout(function () {
        btn.disabled = false;
        btn.textContent = btnText;

        /* Mensaje de éxito */
        const success = document.getElementById('contact-success');
        if (success) {
          form.style.display = 'none';
          success.hidden = false;
        }

        form.reset();
      }, 1500);
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
    initStickyNav();
    initMobileMenu();
    initDropdown();
    initScrollReveal();
    initActivePage();
    initSmoothScroll();
    initContactForm();
  });

})();
