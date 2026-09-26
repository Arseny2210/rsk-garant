/* РСК Гарант — клиентские скрипты (vanilla JS) */

const doc = document;

/* ---------- аналитика: заготовка ---------- */
const trackerQueue = [];
window.RSK_TRACK = (eventName, payload = {}) => {
  trackerQueue.push({ eventName, payload, ts: Date.now() });
  if (typeof window.rskOnTrack === 'function') {
    window.rskOnTrack(eventName, payload);
  }
};

/* Подключить аналитику здесь, когда появятся ID счетчиков.
   Например: Яндекс Метрика, Google Analytics.
   Функция window.rskOnTrack вызовется на каждое событие.
   Список событий: lead_form_open, lead_form_submit, lead_form_success,
   phone_click, service_card_click, portfolio_open,
   additional_service_open, max_click. */

/* ---------- header scroll state ---------- */
const header = doc.querySelector('.site-header');
const onScroll = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 8);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- mobile menu ---------- */
const menuToggle = doc.querySelector('.menu-toggle');
const mobileMenu = doc.querySelector('#mobile-menu');
const body = doc.body;

function setMenu(open) {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  if (open) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = '';
  }
}

menuToggle?.addEventListener('click', () => {
  const open = mobileMenu?.classList.contains('is-open') ? false : true;
  setMenu(open);
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

doc.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

/* ---------- reveal on scroll ---------- */
const revealEls = doc.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

/* ---------- телефонная маска ---------- */
function maskPhone(input) {
  const digits = input.value.replace(/\D/g, '');
  let out = '+7';
  if (digits.length > 1) out += ' (' + digits.slice(1, 4);
  if (digits.length >= 4) out += ') ' + digits.slice(4, 7);
  if (digits.length >= 7) out += '-' + digits.slice(7, 9);
  if (digits.length >= 9) out += '-' + digits.slice(9, 11);
  input.value = out;
}

function normalizePhone(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('8')) return '+7' + digits.slice(1);
  if (digits.startsWith('7')) return '+' + digits;
  if (digits.length === 10) return '+7' + digits;
  return value;
}

doc.querySelectorAll('input[type="tel"]').forEach((input) => {
  input.addEventListener('input', () => maskPhone(input));
  input.addEventListener('blur', () => {
    if (input.value.replace(/\D/g, '').length < 11) {
      input.value = '';
    }
  });
});

/* ---------- before/after ---------- */
doc.querySelectorAll('.before-after').forEach((ba) => {
  const buttons = ba.querySelectorAll('button');
  const img = ba.parentElement.querySelector('[data-ba-img]');
  if (!buttons.length || !img) return;
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      img.src = btn.dataset.src;
      img.alt = btn.dataset.alt || img.alt;
    });
  });
});

/* ---------- модальные окна (native <dialog>) ---------- */
let lastFocused = null;

doc.querySelectorAll('[data-modal-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const id = trigger.dataset.modalOpen;
    const dialog = doc.getElementById(id);
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') {
      lastFocused = doc.activeElement;
      dialog.showModal();
      dialog.querySelector('[data-modal-close]')?.focus();
      body.style.overflow = 'hidden';
      window.RSK_TRACK('additional_service_open', {
        service: dialog.dataset.service || id
      });
    }
  });
});

doc.querySelectorAll('.modal').forEach((dialog) => {
  const closeBtn = dialog.querySelector('[data-modal-close]');

  closeBtn?.addEventListener('click', () => {
    dialog.close();
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => {
    body.style.overflow = '';
    lastFocused?.focus();
  });

  dialog.querySelectorAll('[data-modal-cta]').forEach((cta) => {
    cta.addEventListener('click', () => {
      dialog.close();
      const form = doc.querySelector('#lead-form');
      if (form) {
        const serviceInput = form.querySelector('[name="service"]');
        if (serviceInput && dialog.dataset.service) {
          serviceInput.value = dialog.dataset.service;
        }
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          const firstField = form.querySelector('input[name="name"], input[name="phone"]');
          firstField?.focus();
        }, 500);
        window.RSK_TRACK('lead_form_open', { source: 'modal' });
      }
    });
  });
});

/* ---------- lightbox (просмотр фото) ---------- */
const lightbox = doc.getElementById('lightbox');
const lbImg = doc.getElementById('lightbox-img');
const lbCaption = doc.getElementById('lightbox-caption');
const lbBa = doc.getElementById('lightbox-ba');

function openLightbox({ src, alt, caption, before, after }) {
  if (!lightbox || !lbImg) return;
  lbImg.src = src;
  lbImg.alt = alt || '';
  if (lbCaption) lbCaption.textContent = caption || '';

  if (lbBa) {
    if (before && after) {
      lbBa.hidden = false;
      lbBa.dataset.before = before;
      lbBa.dataset.after = after;
      const btns = lbBa.querySelectorAll('button');
      btns.forEach((b) => b.classList.toggle('is-active', b.dataset.lb === 'after'));
      lbImg.src = after;
      lbImg.alt = alt || '';
    } else {
      lbBa.hidden = true;
    }
  }

  if (typeof lightbox.showModal === 'function') {
    lightbox.showModal();
    body.style.overflow = 'hidden';
  }
}

doc.querySelectorAll('[data-lightbox]').forEach((trigger) => {
  trigger.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    const img =
      trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
    openLightbox({
      src: trigger.dataset.src || img?.getAttribute('src') || '',
      alt: trigger.dataset.alt || img?.getAttribute('alt') || '',
      caption: trigger.dataset.caption || '',
      before: trigger.dataset.before,
      after: trigger.dataset.after,
    });
  });
});

doc.querySelector('[data-lightbox-close]')?.addEventListener('click', () => {
  lightbox?.close();
});

lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.close();
});

lightbox?.addEventListener('close', () => {
  body.style.overflow = '';
});

lbBa?.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.lb;
    const src = mode === 'before' ? lbBa.dataset.before : lbBa.dataset.after;
    if (!src || !lbImg) return;
    lbImg.src = src;
    lbBa.querySelectorAll('button').forEach((b) =>
      b.classList.toggle('is-active', b === btn)
    );
  });
});

doc.querySelectorAll('[data-lightbox]').forEach((t) => {
  t.setAttribute('title', 'Открыть фото');
});

/* ---------- скролл к форме ---------- */
doc.querySelectorAll('[data-open-form]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const form = doc.querySelector('#lead-form');
    if (!form) return;
    const serviceInput = form.querySelector('[name="service"]');
    if (serviceInput && trigger.dataset.openForm) {
      serviceInput.value = trigger.dataset.openForm;
    }
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.RSK_TRACK('lead_form_open', { source: 'cta', service: trigger.dataset.openForm || '' });
  });
});

/* ---------- телефонные ссылки ---------- */
doc.querySelectorAll('a[href^="tel:"]').forEach((link) => {
  link.addEventListener('click', () => {
    window.RSK_TRACK('phone_click', { href: link.getAttribute('href') });
  });
});

/* ---------- клики по карточкам услуг ---------- */
doc.querySelectorAll('[data-service-card]').forEach((card) => {
  card.addEventListener('click', () => {
    window.RSK_TRACK('service_card_click', { service: card.dataset.serviceCard });
  });
});

/* ---------- клики по мессенджерам ---------- */
doc.querySelectorAll('[data-track-messenger]').forEach((link) => {
  link.addEventListener('click', () => {
    window.RSK_TRACK('messenger_click', { channel: link.dataset.trackMessenger });
  });
});

/* ---------- просмотр портфолио ---------- */
doc.querySelectorAll('[data-portfolio]').forEach((card) => {
  card.addEventListener('click', () => {
    const title = card.querySelector('h3')?.textContent?.trim() || '';
    window.RSK_TRACK('portfolio_open', { title });
  });
});

/* ---------- калькулятор стоимости ---------- */
const calcType = doc.getElementById('calc-type');
const calcArea = doc.getElementById('calc-area');
const calcAreaField = doc.getElementById('calc-area-field');
const calcResult = doc.getElementById('calc-result');
const calcValue = doc.getElementById('calc-value');
const calcNote = doc.getElementById('calc-note');
const calcCta = doc.querySelector('[data-calc-cta]');

function formatRubles(n) {
  return Math.ceil(n / 1000) * 1000;
}

function updateCalc() {
  if (!calcType || !calcResult) return;
  const type = calcType.value;
  const option = calcType.options[calcType.selectedIndex];
  const unit = option?.dataset.unit || '';
  const priceRaw = option?.dataset.price || '';
  const rate = parseInt(priceRaw.replace(/\D/g, ''), 10) || 0;

  calcCta?.setAttribute('data-open-form', type && type !== 'other' ? type : '');

  if (!type) {
    calcResult.classList.remove('is-visible');
    setAreaEnabled(true);
    return;
  }

  calcResult.classList.add('is-visible');

  if (type === 'other') {
    if (calcValue) calcValue.textContent = 'Стоимость зависит от задачи';
    if (calcNote)
      calcNote.textContent = 'Подскажем ориентировочную стоимость после обсуждения деталей.';
    setAreaEnabled(false);
    calcCta?.removeAttribute('data-calc-area');
    return;
  }

  // Услуги с фиксированной ценой «от» (санузел, двери и т.п.) — по площади не считаем
  if (unit === 'flat') {
    setAreaEnabled(false);
    if (calcValue)
      calcValue.textContent = `Ориентировочно ${priceRaw.replace('от ', 'от ')}`;
    if (calcNote)
      calcNote.textContent =
        'Точную стоимость назовём после осмотра объекта и уточнения деталей.';
    calcCta?.removeAttribute('data-calc-area');
    window.RSK_TRACK('calculator_calc', { type });
    return;
  }

  setAreaEnabled(true);

  const area = parseInt(calcArea?.value || '0', 10);
  if (!(area >= 1)) {
    if (calcValue) calcValue.textContent = 'Укажите площадь помещения';
    if (calcNote)
      calcNote.textContent = 'Например: 35, 48 или 60 м² — и мы рассчитаем нижнюю границу стоимости.';
    calcCta?.removeAttribute('data-calc-area');
    return;
  }

  const estimate = formatRubles(rate * area);
  if (calcValue) calcValue.textContent = `Ориентировочно от ${estimate.toLocaleString('ru-RU')} ₽`;
  if (calcNote)
    calcNote.textContent = `Предварительная нижняя граница при площади ${area} м². Точную смету подготовим после осмотра объекта.`;
  calcCta?.setAttribute('data-calc-area', String(area));

  window.RSK_TRACK('calculator_calc', { type, area, estimate });
}

function setAreaEnabled(enabled) {
  if (!calcArea || !calcAreaField) return;
  calcArea.disabled = !enabled;
  calcAreaField.classList.toggle('is-dimmed', !enabled);
  if (!enabled && calcArea.value) calcArea.value = '';
}

calcType?.addEventListener('change', updateCalc);
calcArea?.addEventListener('input', updateCalc);

calcCta?.addEventListener('click', () => {
  const area = calcCta.getAttribute('data-calc-area');
  if (area) {
    const form = doc.querySelector('#lead-form');
    const comment = form?.querySelector('[name="comment"]');
    if (comment && !comment.value.trim()) {
      comment.value = `Площадь помещения: ${area} м²`;
    }
  }
  window.RSK_TRACK('calculator_cta', {
    type: calcType?.value || '',
    area: calcCta.getAttribute('data-calc-area') || '',
  });
});

/* ---------- UTM ---------- */
function getUtm() {
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
    const v = params.get(k);
    if (v) utm[k] = v;
  });
  return utm;
}
const utm = getUtm();
if (Object.keys(utm).length) {
  sessionStorage.setItem('rsk_utm', JSON.stringify(utm));
}

/* ---------- формы ---------- */
doc.querySelectorAll('.lead-form').forEach((form) => {
  const submitBtn = form.querySelector('button[type="submit"]');
  const statusBox = form.querySelector('.form-status');
  const consentWrap = form.querySelector('.consent');

  const setInvalid = (field, invalid) => {
    const wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.toggle('is-invalid', invalid);
    const msg = wrap.querySelector('.error');
    if (msg) {
      msg.textContent = field.dataset.error || 'Проверьте это поле';
      msg.id = 'error-' + (field.name || 'field');
      field.setAttribute('aria-invalid', String(invalid));
      field.setAttribute('aria-describedby', invalid ? msg.id : '');
    }
  };

  const clearInvalid = () => {
    form.querySelectorAll('.field.is-invalid').forEach((wrap) => {
      wrap.classList.remove('is-invalid');
      const f = wrap.querySelector('input, textarea, select');
      f?.removeAttribute('aria-invalid');
      f?.removeAttribute('aria-describedby');
    });
    consentWrap?.classList.remove('is-invalid');
    if (statusBox) {
      statusBox.className = 'form-status';
      statusBox.textContent = '';
    }
  };

  const validate = (payload) => {
    let ok = true;
    const name = payload.name.trim();
    const phone = payload.phone.trim();

    if (name.length < 2) {
      const f = form.querySelector('[name="name"]');
      setInvalid(f, true);
      ok = false;
    }
    if (phone.replace(/\D/g, '').length < 11) {
      const f = form.querySelector('[name="phone"]');
      setInvalid(f, true);
      ok = false;
    }
    if (!payload.consent) {
      consentWrap?.classList.add('is-invalid');
      consentWrap?.setAttribute('role', 'alert');
      ok = false;
    }
    return ok;
  };

  const showStatus = (type, title, text) => {
    if (!statusBox) return;
    statusBox.className = 'form-status form-status--' + type;
    statusBox.innerHTML = '<b>' + title + '</b><br>' + text;
    statusBox.setAttribute('role', 'status');
    statusBox.focus?.();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearInvalid();
    window.RSK_TRACK('lead_form_submit', {});

    const payload = {
      name: form.querySelector('[name="name"]')?.value || '',
      phone: normalizePhone(form.querySelector('[name="phone"]')?.value || ''),
      service: form.querySelector('[name="service"]')?.value || '',
      comment: form.querySelector('[name="comment"]')?.value || '',
      consent: !!form.querySelector('[name="consent"]')?.checked,
      website: form.querySelector('[name="website"]')?.value || '',
      page: window.location.pathname,
      utm: utm,
      submittedAt: new Date().toISOString()
    };

    if (!validate(payload)) {
      const firstInvalid = form.querySelector('.field.is-invalid input, .field.is-invalid textarea, .field.is-invalid select');
      firstInvalid?.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.status === 'ok') {
        window.RSK_TRACK('lead_form_success', {});
        form.reset();
        showStatus(
          'success',
          'Заявка отправлена',
          'Спасибо! Мы получили ваше обращение и свяжемся с вами.'
        );
        const extra = doc.querySelector('[data-form-success]');
        if (extra) extra.style.display = 'block';
      } else {
        throw new Error(data.error || 'request failed');
      }
    } catch (err) {
      window.RSK_TRACK('lead_form_error', { message: String(err.message || err) });
      showStatus(
        'error',
        'Не удалось отправить заявку',
        'Попробуйте еще раз или позвоните нам.'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.label || 'Отправить';
    }
  });

  form.querySelectorAll('input, textarea, select').forEach((field) => {
    field.addEventListener('input', () => {
      const wrap = field.closest('.field');
      if (wrap?.classList.contains('is-invalid')) setInvalid(field, false);
    });
  });

  consentWrap?.querySelector('input')?.addEventListener('change', () => {
    consentWrap.classList.remove('is-invalid');
  });

  window.RSK_TRACK('lead_form_view', {});
});