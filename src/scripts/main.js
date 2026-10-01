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
const revealEls = doc.querySelectorAll('.reveal, .sec-head, .reveal-stagger');
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
const phoneState = new WeakMap();

function formatPhone(digits) {
  let out = '+7';
  if (digits.length > 1) out += ' (' + digits.slice(1, 4);
  if (digits.length >= 4) out += ') ' + digits.slice(4, 7);
  if (digits.length >= 7) out += '-' + digits.slice(7, 9);
  if (digits.length >= 9) out += '-' + digits.slice(9, 11);
  return out;
}

function caretAfterDigits(formatted, count) {
  let pos = formatted.length;
  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      seen++;
      if (seen === count) {
        pos = i + 1;
        break;
      }
    }
  }
  return pos;
}

function maskPhone(input) {
  const caretPos = input.selectionStart ?? input.value.length;
  const hadSelection =
    typeof input.selectionEnd === 'number' && input.selectionEnd > input.selectionStart;

  const state = phoneState.get(input) || {
    prevDigits: '',
    prevCaret: caretPos,
    prevLen: 0,
  };

  // сколько цифр стоит ДО курсора в текущем (уже изменённом) значении
  const digitsBeforeCaret = (input.value.slice(0, caretPos).match(/\d/g) || []).length;
  const prevValueLen = state.prevLen;

  let digits = input.value.replace(/\D/g, '');

  if (digits.length === 0) {
    if (input.value !== '') input.value = '';
    phoneState.set(input, { prevDigits: '', prevCaret: 0, prevLen: 0 });
    return;
  }

  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (!digits.startsWith('7')) digits = '7' + digits;
  digits = digits.slice(0, 11);

  const formatted = formatPhone(digits);

  if (formatted !== input.value) {
    const prevDigitsCount = state.prevDigits.length;
    const typedAtEnd = state.prevCaret >= prevValueLen - 1;

    // при вводе вперёд (или замене выделения) курсор ставим в конец;
    // при стирании и правке в середине — сохраняем по номеру цифры
    const moveToEnd = hadSelection || (digits.length > prevDigitsCount && typedAtEnd);

    input.value = formatted;
    const pos = moveToEnd ? formatted.length : caretAfterDigits(formatted, digitsBeforeCaret);
    input.setSelectionRange(pos, pos);
  }

  phoneState.set(input, { prevDigits: digits, prevCaret: caretPos, prevLen: input.value.length });
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

/* ---------- lightbox (просмотр фото) ---------- */
const lightbox = doc.getElementById('lightbox');
const lbImg = doc.getElementById('lightbox-img');
const lbCaption = doc.getElementById('lightbox-caption');
const lbCounter = doc.getElementById('lightbox-counter');
const lbDots = doc.getElementById('lightbox-dots');
const lbPrev = doc.querySelector('[data-lightbox-prev]');
const lbNext = doc.querySelector('[data-lightbox-next]');

const galleries = new Map();

function resolveItem(trigger) {
  const img = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
  const item = {
    src: trigger.dataset.src || img?.getAttribute('src') || '',
    alt: trigger.dataset.alt || img?.getAttribute('alt') || '',
    caption: trigger.dataset.caption || '',
  };

  // встроенный список фото (у проекта на главной) — строго по теме
  let embedded = null;
  if (trigger.dataset.galleryImages) {
    try {
      embedded = JSON.parse(trigger.dataset.galleryImages).map((src) => ({
        ...item,
        src,
        alt: item.alt || '',
      }));
    } catch {
      embedded = null;
    }
  }
  return { item, embedded };
}

doc.querySelectorAll('[data-lightbox]').forEach((trigger) => {
  const group = trigger.dataset.gallery;
  const { item, embedded } = resolveItem(trigger);

  if (group && !embedded) {
    if (!galleries.has(group)) galleries.set(group, []);
    galleries.get(group).push(item);
  }

  trigger.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    try {
      const list = embedded || (group ? Array.from(galleries.get(group)) : null);
      openLightbox(item, list);
    } catch (err) {
      // страховка: даже при сбое данных открываем одиночное фото
      window._lbList = null;
      window._lbIndex = -1;
      renderLightbox();
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
    }
  });
});

function openLightbox(item, list) {
  if (!lightbox || !lbImg) return;

  window._lbList = list;
  window._lbIndex = list && list.length ? list.findIndex((it) => it.src === item.src) : -1;
  if (list && window._lbIndex < 0) window._lbIndex = 0;

  renderLightbox();
  if (typeof lightbox.showModal === 'function') {
    lightbox.showModal();
    body.style.overflow = 'hidden';
  }
}

function renderLightbox() {
  const list = window._lbList || [];
  const index = window._lbIndex;
  const item = list.length ? list[index] : { src: lbImg.src, alt: lbImg.alt, caption: '' };

  lbImg.src = item.src;
  lbImg.alt = item.alt || '';
  if (lbCaption) lbCaption.textContent = item.caption || '';

  if (lbCounter) {
    lbCounter.textContent = list.length ? `${index + 1} / ${list.length}` : '';
  }
  if (lbPrev) lbPrev.style.display = list.length > 1 ? '' : 'none';
  if (lbNext) lbNext.style.display = list.length > 1 ? '' : 'none';

  // предзагрузка соседних фото — листается без задержек
  if (list.length > 1) {
    [index - 1, index + 1].forEach((i) => {
      const src = list[(i + list.length) % list.length]?.src;
      if (src) {
        const pre = new Image();
        pre.src = src;
      }
    });
  }

  if (lbDots) {
    lbDots.innerHTML = '';
    if (list.length > 1) {
      list.forEach((it, i) => {
        const dot = doc.createElement('button');
        dot.type = 'button';
        dot.className = 'lightbox__dot' + (i === index ? ' is-active' : '');
        dot.setAttribute('aria-label', `Фото ${i + 1} из ${list.length}`);
        dot.addEventListener('click', () => {
          window._lbIndex = i;
          renderLightbox();
        });
        lbDots.appendChild(dot);
      });
      lbDots.style.display = '';
    } else {
      lbDots.style.display = 'none';
    }
  }
}

function stepLightbox(dir) {
  const list = window._lbList;
  if (!list || list.length < 2) return;
  window._lbIndex = (window._lbIndex + dir + list.length) % list.length;
  renderLightbox();
}

lbPrev?.addEventListener('click', () => stepLightbox(-1));
lbNext?.addEventListener('click', () => stepLightbox(1));

doc.addEventListener('keydown', (e) => {
  if (!lightbox?.open) return;
  if (e.key === 'ArrowLeft') stepLightbox(-1);
  if (e.key === 'ArrowRight') stepLightbox(1);
});

doc.querySelector('[data-lightbox-close]')?.addEventListener('click', () => {
  lightbox?.close();
});

lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.close();
});

lightbox?.addEventListener('close', () => {
  body.style.overflow = '';
  window._lbList = null;
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

/* ---------- акции: передача предложения в форму ---------- */
function openPromotionForm(service, promotion, source) {
  const form = doc.querySelector('#lead-form');
  if (!form) return;

  const serviceInput = form.querySelector('[name="service"]');
  if (service && serviceInput) serviceInput.value = service;

  const comment = form.querySelector('[name="comment"]');
  if (promotion && comment && !comment.value.trim()) {
    comment.value = `Интересует акция: ${promotion}`;
  }

  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.RSK_TRACK('promotion_form_open', { source, service, promotion });
}

doc.querySelectorAll('[data-promo-form]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    openPromotionForm(
      trigger.dataset.promoService || '',
      trigger.dataset.promoTitle || '',
      'promotion_section'
    );
  });
});

const popup = doc.getElementById('promotion-popup');
const popupTitle = doc.getElementById('promotion-popup-title');
const popupText = doc.getElementById('promotion-popup-text');
const popupCta = doc.querySelector('[data-promotion-cta]');

const popupOffers = {
  '/remont-pod-klyuch/': {
    title: 'Скидка 10 000 ₽ на ремонт под ключ',
    text: 'Оставьте заявку, и мы рассчитаем стоимость ремонта с учетом акции.',
    service: 'Ремонт под ключ',
  },
  '/natyazhnye-potolki/': {
    title: 'Скидка на натяжные потолки до 10 000 ₽',
    text: 'Узнайте размер скидки для вашего помещения после замера.',
    service: 'Натяжные потолки',
  },
  '/ustanovka-dverey/': {
    title: 'Третья дверь в подарок',
    text: 'При покупке двух межкомнатных дверей. Оставьте заявку, чтобы узнать условия.',
    service: 'Установка межкомнатных дверей',
  },
};

const defaultPopupOffer = {
  title: 'Специальные скидки до 25%',
  text: 'Для пенсионеров, людей с инвалидностью и участников СВО. Оставьте заявку, чтобы уточнить условия.',
  service: '',
};

if (popup && doc.querySelector('#lead-form')) {
  const offer = popupOffers[window.location.pathname] || defaultPopupOffer;
  if (popupTitle) popupTitle.textContent = offer.title;
  if (popupText) popupText.textContent = offer.text;

  const showPopup = () => {
    popup.hidden = false;
    window.RSK_TRACK('promotion_popup_view', { service: offer.service, promotion: offer.title });
  };

  window.setTimeout(showPopup, 40000);

  doc.querySelector('[data-promotion-close]')?.addEventListener('click', () => {
    popup.hidden = true;
    window.RSK_TRACK('promotion_popup_close', { service: offer.service, promotion: offer.title });
  });

  popupCta?.addEventListener('click', () => {
    popup.hidden = true;
    openPromotionForm(offer.service, offer.title, 'delayed_popup');
  });
}

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
    if (calcValue) calcValue.textContent = priceRaw;
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
    if (calcValue) calcValue.textContent = 'Укажите площадь';
    if (calcNote)
      calcNote.textContent = 'Например: 35, 48 или 60 м² — и мы рассчитаем нижнюю границу стоимости.';
    calcCta?.removeAttribute('data-calc-area');
    return;
  }

  const estimate = formatRubles(rate * area);
  if (calcValue)
    calcValue.textContent = `от ${estimate.toLocaleString('ru-RU')} ₽`;
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
  const consentInput = form.querySelector('input[name="consent"]');

  // Кнопка отправки недоступна, пока не подтверждено согласие с политикой.
  const syncSubmitState = () => {
    if (submitBtn && consentInput) submitBtn.disabled = !consentInput.checked;
  };
  consentInput?.addEventListener('change', syncSubmitState);
  syncSubmitState();

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
    statusBox.innerHTML = '<b>' + title + '</b>' + text;
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
      syncSubmitState();
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
