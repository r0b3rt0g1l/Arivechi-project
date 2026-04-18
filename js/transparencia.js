/* ============================================================
   TRANSPARENCIA.JS — Acordeones y búsqueda de transparencia
   H. Ayuntamiento de Arivechi, Sonora
   ============================================================ */

(function () {
  'use strict';

  /* === ACORDEONES === */
  function initAccordion() {
    const items = document.querySelectorAll('.acordeon__item');
    if (!items.length) return;

    items.forEach(function (item) {
      const header = item.querySelector('.acordeon__header');
      const body = item.querySelector('.acordeon__body');
      if (!header || !body) return;

      header.addEventListener('click', function () {
        const isActive = item.classList.contains('acordeon__item--active');

        /* Cerrar todos */
        items.forEach(function (other) {
          other.classList.remove('acordeon__item--active');
          const otherHeader = other.querySelector('.acordeon__header');
          const otherBody = other.querySelector('.acordeon__body');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
          if (otherBody) otherBody.style.maxHeight = null;
        });

        /* Abrir el actual si no estaba activo */
        if (!isActive) {
          item.classList.add('acordeon__item--active');
          header.setAttribute('aria-expanded', 'true');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  /* === BÚSQUEDA EN ACORDEONES === */
  function initSearch() {
    const input = document.getElementById('transparencia-search');
    const emptyMsg = document.querySelector('.transparencia-busqueda__empty');
    if (!input) return;

    let debounceTimer;

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        const query = input.value.toLowerCase().trim();
        const items = document.querySelectorAll('.acordeon__item');
        let visibleCount = 0;

        items.forEach(function (item) {
          const title = item.querySelector('.acordeon__title');
          const content = item.querySelector('.acordeon__content');
          const textToSearch = (title ? title.textContent : '') + ' ' + (content ? content.textContent : '');

          if (!query || textToSearch.toLowerCase().includes(query)) {
            item.style.display = '';
            visibleCount++;
          } else {
            item.style.display = 'none';
            /* Cerrar si estaba abierto */
            item.classList.remove('acordeon__item--active');
            const body = item.querySelector('.acordeon__body');
            const header = item.querySelector('.acordeon__header');
            if (body) body.style.maxHeight = null;
            if (header) header.setAttribute('aria-expanded', 'false');
          }
        });

        /* Mostrar mensaje si no hay resultados */
        if (emptyMsg) {
          emptyMsg.hidden = visibleCount > 0;
        }
      }, 300);
    });
  }

  /* === INICIALIZACIÓN === */
  document.addEventListener('DOMContentLoaded', function () {
    initAccordion();
    initSearch();
  });

})();
