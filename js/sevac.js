/* ============================================================
   SEVAC.JS — Filtros y descarga de documentos SEvAC
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const tbody = document.getElementById('sevac-tbody');
    if (!tbody) return;

    const filtroAnio = document.getElementById('sevac-filtro-anio');
    const filtroTrimestre = document.getElementById('sevac-filtro-trimestre');
    const sidebarLinks = document.querySelectorAll('#sevac-categorias .sevac-sidebar__link');
    const selectMobil = document.getElementById('sevac-categoria-select');
    const counter = document.getElementById('sevac-count');
    const emptyMsg = document.getElementById('sevac-empty');
    const rows = tbody.querySelectorAll('tr');

    let categoriaActiva = 'todos';

    function aplicarFiltros() {
      const anio = filtroAnio ? filtroAnio.value : 'todos';
      const trimestre = filtroTrimestre ? filtroTrimestre.value : 'todos';
      let visibles = 0;

      rows.forEach(function (row) {
        const rAnio = row.getAttribute('data-anio');
        const rTrim = row.getAttribute('data-trimestre');
        const rCat = row.getAttribute('data-categoria');

        const matchAnio = anio === 'todos' || rAnio === anio;
        const matchTrim = trimestre === 'todos' || rTrim === trimestre || rTrim === 'todos';
        const matchCat = categoriaActiva === 'todos' || rCat === categoriaActiva || rCat === 'todos';

        const visible = matchAnio && matchTrim && matchCat;
        row.style.display = visible ? '' : 'none';
        if (visible) visibles++;
      });

      if (counter) {
        counter.textContent = visibles + ' ' + (visibles === 1 ? 'archivo' : 'archivos');
      }
      if (emptyMsg) {
        emptyMsg.hidden = visibles !== 0;
      }
    }

    if (filtroAnio) filtroAnio.addEventListener('change', aplicarFiltros);
    if (filtroTrimestre) filtroTrimestre.addEventListener('change', aplicarFiltros);

    sidebarLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        sidebarLinks.forEach(function (l) { l.classList.remove('sevac-sidebar__link--active'); });
        link.classList.add('sevac-sidebar__link--active');
        categoriaActiva = link.getAttribute('data-categoria') || 'todos';
        if (selectMobil) selectMobil.value = categoriaActiva;
        aplicarFiltros();
      });
    });

    if (selectMobil) {
      selectMobil.addEventListener('change', function () {
        categoriaActiva = selectMobil.value;
        sidebarLinks.forEach(function (l) {
          l.classList.toggle('sevac-sidebar__link--active', l.getAttribute('data-categoria') === categoriaActiva);
        });
        aplicarFiltros();
      });
    }

    /* Botones de descarga */
    document.querySelectorAll('.sevac-table__action').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.alert('Documento en proceso de publicación');
      });
    });

    aplicarFiltros();
  });

})();
