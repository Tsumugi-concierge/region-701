/* Minimal shared i18n for Region 701 static pages
 * - Persists language in localStorage
 * - Initializes from browser language (en/ja/zh/ko/fr/es), fallback en
 * - Applies translations from a per-page dictionary if present:
 *     window.I18N or window.S or window.STRINGS or window.UI_STRINGS
 * - Updates [data-i18n] elements' textContent
 * - Toggles .lang-btn .active state and <html lang>
 * - Notifies page hook window.onLangChange(lang) if defined
 */

(function(){
  const SUPPORTED = ['en','ja','zh','ko','fr','es'];
  const LS_KEY = 'region701.lang';

  function normalize(lang) {
    if (!lang) return 'en';
    lang = String(lang).toLowerCase();
    // map like 'en-US' -> 'en'
    const base = lang.split('-')[0];
    return SUPPORTED.includes(base) ? base : 'en';
  }

  function getInitial() {
    const saved = localStorage.getItem(LS_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    return normalize(navigator.language || navigator.userLanguage || 'en');
  }

  function getDict() {
    // Prefer I18N, then S, then STRINGS, then UI_STRINGS
    return (window.I18N || window.S || window.STRINGS || window.UI_STRINGS) || null;
  }

  function applyTranslations(lang) {
    const dict = getDict();
    const t = dict && dict[lang];
    if (!t) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && Object.prototype.hasOwnProperty.call(t, key)) {
        el.textContent = t[key];
      }
    });
  }

  function syncButtons(lang) {
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(b => {
      const code = b.getAttribute('data-lang');
      if (code) b.classList.toggle('active', code === lang);
    });
  }

  function setLang(lang, btn) {
    lang = normalize(lang);
    if (window.currentLang === lang) {
      // Still update button state if needed
      if (btn) {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      } else {
        syncButtons(lang);
      }
      return;
    }
    window.currentLang = lang;
    localStorage.setItem(LS_KEY, lang);
    document.documentElement.setAttribute('lang', lang);
    if (btn) {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    } else {
      syncButtons(lang);
    }
    // Apply page strings
    applyTranslations(lang);
    // Page hook (for custom behaviors like chatbot placeholders, etc.)
    try { typeof window.onLangChange === 'function' && window.onLangChange(lang); } catch {}
  }

  function init() {
    const initLang = getInitial();
    window.currentLang = initLang;
    // Mark buttons by data-lang if missing
    document.querySelectorAll('.lang-btn').forEach(b => {
      if (!b.getAttribute('data-lang')) {
        const m = /setLang\(['\"]([a-z]{2})['\"]/i.exec(b.getAttribute('onclick') || '');
        if (m) b.setAttribute('data-lang', m[1]);
      }
    });
    document.documentElement.setAttribute('lang', initLang);
    syncButtons(initLang);
    applyTranslations(initLang);
    try { typeof window.onLangChange === 'function' && window.onLangChange(initLang); } catch {}
  }

  // Expose globally
  window.setLang = setLang;
  window.getCurrentLang = () => window.currentLang || getInitial();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
