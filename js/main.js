(function () {
  'use strict';
  var STORE = 'fonte-nova-lang';
  var META = {
    pt: {
      title: 'Restaurante Regional Fonte Nova | Cozinha duriense em Armamar',
      desc: 'Cozinha regional duriense na brasa, em Armamar, no coração do Douro. Carnes grelhadas, peixe e bacalhau à Fonte Nova. Reservas: 254 855 387.',
      ogDesc: 'Cozinha regional duriense na brasa, em Armamar, no coração do Douro. Reservas: 254 855 387.',
      locale: 'pt_PT', html: 'pt-PT'
    },
    en: {
      title: 'Restaurante Regional Fonte Nova | Douro cooking in Armamar',
      desc: 'Regional Douro cooking over charcoal, in Armamar, in the heart of the valley. Grilled meats, fish and bacalhau à Fonte Nova. Bookings: +351 254 855 387.',
      ogDesc: 'Regional Douro cooking over charcoal, in Armamar. Bookings: +351 254 855 387.',
      locale: 'en_GB', html: 'en'
    }
  };

  function read(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function write(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* sem storage: ignora */ }
  }
  function valid(l) { return l === 'pt' || l === 'en' ? l : null; }
  function fromQuery() {
    try { return valid(new URLSearchParams(window.location.search).get('lang')); }
    catch (e) { return null; }
  }
  function setMeta(id, value) {
    var el = document.getElementById(id);
    if (el) el.setAttribute('content', value);
  }

  function apply(lang) {
    var m = META[lang];
    document.documentElement.lang = m.html;
    document.title = m.title;
    setMeta('meta-desc', m.desc);
    setMeta('og-title', m.title);
    setMeta('og-desc', m.ogDesc);
    setMeta('og-locale', m.locale);

    var texts = document.querySelectorAll('[data-pt][data-en]');
    for (var i = 0; i < texts.length; i++) {
      texts[i].textContent = texts[i].getAttribute('data-' + lang);
    }
    var alts = document.querySelectorAll('[data-alt-pt]');
    for (var j = 0; j < alts.length; j++) {
      var a = alts[j], v = a.getAttribute('data-alt-' + lang);
      a.setAttribute(a.tagName === 'IMG' ? 'alt' : 'aria-label', v);
    }
    var arias = document.querySelectorAll('[data-aria-pt]');
    for (var k = 0; k < arias.length; k++) {
      arias[k].setAttribute('aria-label', arias[k].getAttribute('data-aria-' + lang));
    }
    var titles = document.querySelectorAll('[data-title-pt]');
    for (var t = 0; t < titles.length; t++) {
      titles[t].setAttribute('title', titles[t].getAttribute('data-title-' + lang));
    }
    var langs = document.querySelectorAll('[data-lang-pt]');
    for (var l = 0; l < langs.length; l++) {
      langs[l].setAttribute('lang', langs[l].getAttribute('data-lang-' + lang));
    }
    var btns = document.querySelectorAll('.lang__btn');
    for (var b = 0; b < btns.length; b++) {
      btns[b].setAttribute('aria-pressed', btns[b].getAttribute('data-lang') === lang ? 'true' : 'false');
    }
  }

  function markToday() {
    var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var day;
    try {
      day = map[new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Europe/Lisbon' }).format(new Date())];
    } catch (e) { day = new Date().getDay(); }
    var row = document.querySelector('.hours__table tr[data-day="' + day + '"]');
    if (!row) return;
    row.classList.add('is-today');
    var badge = row.querySelector('.today');
    if (badge) badge.hidden = false;
  }

  var current = fromQuery() || valid(read(STORE)) || 'pt';
  apply(current);
  markToday();

  document.querySelector('.lang').addEventListener('click', function (e) {
    var btn = e.target.closest('.lang__btn');
    if (!btn) return;
    current = btn.getAttribute('data-lang');
    write(STORE, current);
    apply(current);
  });
})();
