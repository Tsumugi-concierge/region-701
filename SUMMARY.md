Multilingual Upgrade (6 languages)

What I changed

- Added shared language engine: assets/i18n.js
  - Persists selected language in localStorage
  - Initializes from browser language (en/ja/zh/ko/fr/es), fallback to English
  - Applies per‑page translations from existing dictionaries (UI_STRINGS, S, STRINGS)
  - Updates [data-i18n] texts and .lang-btn active state across pages

- Updated language switchers on every page
  - Added data-lang attributes to all buttons
  - Standardized onclick to call global setLang('xx', this)
  - Placed a switcher at the top on all pages (kept existing cute design)

- Unified page scripts to use shared i18n
  - index.html: now uses window.onLangChange hook to update chatbot placeholders and UI
  - All subpages: removed/neutralized local setLang implementations so they no longer override the shared one
  - Included <script src="assets/i18n.js"> or "../assets/i18n.js" on all pages

- Kept URLs, assets, images, and layout intact. Did not rename files or move paths.

Access codes review

- No door lock codes, keybox combinations, or similar sensitive access codes were found in any page content.
- how-to-open/ contains guidance only; it states codes will be sent after registration, as required.

Notes

- Existing per‑page translation dictionaries were preserved. The shared i18n applies them and remembers the chosen language between pages.
- If you add new strings, place a data-i18n attribute on the element and add the key to the page’s dictionary; the shared script will handle the rest.
