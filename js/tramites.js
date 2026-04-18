/* ============================================================
   TRAMITES.JS — Validación y envío de los formularios de trámites
   H. Ayuntamiento de Arivechi, Sonora
   ============================================================ */

(function () {
  'use strict';

  /* === REGLAS DE VALIDACIÓN POR FORMULARIO === */
  const CURP_REGEX = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const TELEFONO_REGEX = /^\d{10}$/;
  const CLAVE_CATASTRAL_REGEX = /^[0-9A-Z-]{6,25}$/;

  const FORM_CONFIGS = {
    'form-constancia': {
      successId: 'form-constancia-success',
      rules: {
        nombre:     { required: true, minLength: 3, msg: 'Ingresa tu nombre completo' },
        curp:       { required: true, pattern: CURP_REGEX, transform: 'upper', msg: 'CURP inválida (18 caracteres)' },
        telefono:   { required: true, pattern: TELEFONO_REGEX, msg: 'Teléfono de 10 dígitos' },
        email:      { required: true, pattern: EMAIL_REGEX, msg: 'Correo electrónico inválido' },
        domicilio:  { required: true, minLength: 6, msg: 'Ingresa el domicilio completo' },
        anios:      { required: true, min: 1, max: 120, msg: 'Ingresa un número válido de años' },
        proposito:  { required: true, msg: 'Selecciona un propósito' }
      }
    },
    'form-predial': {
      successId: 'form-predial-success',
      rules: {
        clave:       { required: true, pattern: CLAVE_CATASTRAL_REGEX, transform: 'upper', msg: 'Clave catastral inválida' },
        propietario: { required: true, minLength: 3, msg: 'Ingresa el nombre del propietario' },
        domicilio:   { required: true, minLength: 6, msg: 'Ingresa el domicilio del inmueble' },
        ejercicio:   { required: true, msg: 'Selecciona el ejercicio fiscal' },
        modalidad:   { required: true, msg: 'Selecciona la modalidad de pago' },
        email:       { required: true, pattern: EMAIL_REGEX, msg: 'Correo electrónico inválido' }
      }
    },
    'form-reporte': {
      successId: 'form-reporte-success',
      rules: {
        nombre:      { required: false },
        telefono:    { required: false, pattern: TELEFONO_REGEX, msg: 'Teléfono de 10 dígitos' },
        tipo:        { required: true, msg: 'Selecciona el tipo de reporte' },
        ubicacion:   { required: true, minLength: 4, msg: 'Indica la ubicación' },
        descripcion: { required: true, minLength: 30, msg: 'La descripción debe tener al menos 30 caracteres' }
      }
    }
  };

  /* === VALIDACIÓN DE UN CAMPO === */
  function validateField(field, rule) {
    const raw = field.value.trim();

    if (rule.transform === 'upper' && field.value !== field.value.toUpperCase()) {
      field.value = field.value.toUpperCase();
    }

    if (rule.required && !raw) {
      return rule.msg || 'Este campo es obligatorio';
    }

    if (!raw) return '';

    if (rule.minLength && raw.length < rule.minLength) {
      return rule.msg || `Debe tener al menos ${rule.minLength} caracteres`;
    }

    if (rule.pattern && !rule.pattern.test(raw)) {
      return rule.msg || 'Formato inválido';
    }

    if (typeof rule.min === 'number' || typeof rule.max === 'number') {
      const num = Number(raw);
      if (Number.isNaN(num) ||
          (typeof rule.min === 'number' && num < rule.min) ||
          (typeof rule.max === 'number' && num > rule.max)) {
        return rule.msg || 'Valor fuera de rango';
      }
    }

    return '';
  }

  /* === MOSTRAR / LIMPIAR ERROR === */
  function showFieldError(field, message) {
    const errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;

    field.classList.remove('form-input--error', 'form-textarea--error', 'form-select--error');
    if (!message) return;

    if (field.tagName === 'TEXTAREA') {
      field.classList.add('form-textarea--error');
    } else if (field.tagName === 'SELECT') {
      field.classList.add('form-select--error');
    } else {
      field.classList.add('form-input--error');
    }
  }

  /* === GENERAR FOLIO DE CONFIRMACIÓN === */
  function generateFolio(prefix) {
    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${year}-${rand}`;
  }

  /* === INICIALIZAR UN FORMULARIO === */
  function initTramiteForm(formId, config) {
    const form = document.getElementById(formId);
    if (!form) return;

    const successEl = document.getElementById(config.successId);

    /* Validación en blur e input */
    Object.keys(config.rules).forEach(function (fieldName) {
      const field = form.querySelector('[name="' + fieldName + '"]');
      if (!field) return;

      field.addEventListener('blur', function () {
        const msg = validateField(field, config.rules[fieldName]);
        showFieldError(field, msg);
      });

      field.addEventListener('input', function () {
        if (field.classList.contains('form-input--error') ||
            field.classList.contains('form-textarea--error') ||
            field.classList.contains('form-select--error')) {
          const msg = validateField(field, config.rules[fieldName]);
          showFieldError(field, msg);
        }
      });
    });

    /* Submit */
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;
      let firstInvalid = null;

      Object.keys(config.rules).forEach(function (fieldName) {
        const field = form.querySelector('[name="' + fieldName + '"]');
        if (!field) return;

        const msg = validateField(field, config.rules[fieldName]);
        showFieldError(field, msg);

        if (msg) {
          valid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /* Simulación de envío */
      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn.textContent;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Enviando...';

      setTimeout(function () {
        btn.disabled = false;
        btn.textContent = btnText;

        if (successEl) {
          const folioEl = successEl.querySelector('[data-folio-prefix]');
          if (folioEl) {
            folioEl.textContent = 'Folio: ' + generateFolio(folioEl.getAttribute('data-folio-prefix'));
          }
          form.style.display = 'none';
          successEl.hidden = false;
          successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        form.reset();
      }, 1500);
    });
  }

  /* === INICIALIZACIÓN === */
  document.addEventListener('DOMContentLoaded', function () {
    Object.keys(FORM_CONFIGS).forEach(function (formId) {
      initTramiteForm(formId, FORM_CONFIGS[formId]);
    });
  });

})();
