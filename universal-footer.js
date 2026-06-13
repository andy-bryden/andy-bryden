/**
 * universal-footer.js
 * ─────────────────────────────────────────────────────────────────────────────
 * BRIEFING — read this before modifying or deploying to a new page
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * WHAT IT IS:
 *   A self-contained footer injector for all Andy Bryden GitHub Pages
 *   sites. Appends a consistent branded footer to every page it is loaded on.
 *   Also loads the correct opinions modal script for the current repo.
 *
 *   Layout, design and fonts are identical on every page across every repo.
 *   Only colours change — driven entirely by CSS custom properties on the
 *   host page's :root.
 *
 * WHERE IT LIVES:
 *   Hosted at: https://andy-bryden.github.io/andy-bryden/universal-footer.js
 *   Repo:      github.com/andy-bryden/andy-bryden
 *
 * HOW TO ADD IT TO A PAGE — two steps only:
 *
 *   1. Add the script before </body>:
 *        <script src="https://andy-bryden.github.io/andy-bryden/universal-footer.js"></script>
 *
 *   2. If the repo has its own colour token file, declare it BEFORE the script
 *      tag so universal-footer.js loads the correct opinions modal:
 *        <script>window.OPINIONS_MODAL_SRC = 'opinions-modal-yourrepo.js';</script>
 *      If omitted, defaults to the canonical opinions-modal.js on the main site.
 *
 * WHAT IT INJECTS:
 *   A <div class="universal-footer"> appended to document.body, containing:
 *     - "Andy Bryden · All works CC0 unless noted"
 *     - "Return to the Archives" link (main site)
 *     - GitHub link
 *     - Opinions? trigger (opens the opinions modal)
 *     - ↑ Top link
 *
 * COLOUR THEMING:
 *   Reads these CSS custom properties from the host page's :root.
 *   There are NO fallback colours — all colour must be declared on the host page.
 *
 *     --ink    → main text colour
 *     --paper  → footer background
 *     --rust   → hover / accent colour
 *     --rule   → default link colour and border
 *
 *   Declare these in the host page's :root (typically in its own <style> block):
 *     :root {
 *       --ink:   #your-ink;
 *       --paper: #your-background;
 *       --rust:  #your-accent;
 *       --rule:  #your-border;
 *     }
 *
 * FONTS:
 *   Always loads and uses regardless of the host page:
 *     - Cormorant Garamond (display / logotype)
 *     - Libre Baskerville  (body text)
 *     - Inconsolata        (labels / nav links)
 *
 * OPINIONS MODAL:
 *   Dynamically loads the opinions modal after injecting the footer.
 *   The footer Opinions? trigger (id="opinions-trigger-footer") is created
 *   by this script — do not add it manually to the page HTML.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── CONFIG ── */
  const MAIN_SITE = 'https://andy-bryden.github.io/andy-bryden/';
  const GITHUB_URL = 'https://github.com/andy-bryden/';
  const MODAL_SRC = window.OPINIONS_MODAL_SRC || (MAIN_SITE + 'opinions-modal.js');

  /* ── FONTS — load if not already present ── */
  function ensureFonts() {
    const id = 'universal-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inconsolata:wght@300;400;500&display=swap';
    document.head.appendChild(link);
  }

  /* ── INJECT CSS ── */
  function injectStyles() {
    if (document.getElementById('universal-footer-styles')) return;
    const style = document.createElement('style');
    style.id = 'universal-footer-styles';
    style.textContent = `
      .universal-footer {
        padding: 1.5rem 4vw;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        font-family: 'Inconsolata', monospace;
        font-size: 0.72rem;
        letter-spacing: 0.08em;
        color: var(--rule);
        border-top: 1px solid var(--rule);
        background-color: var(--paper);
      }

      .universal-footer-copy {
        font-family: 'Inconsolata', monospace;
        color: var(--rule);
      }

      .universal-footer-links {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        flex-wrap: wrap;
      }

      .universal-footer-links a,
      .universal-footer-links button {
        font-family: 'Inconsolata', monospace;
        font-size: 0.72rem;
        letter-spacing: 0.08em;
        color: var(--rule);
        text-decoration: none;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        transition: color 0.2s;
      }

      .universal-footer-links a:hover,
      .universal-footer-links button:hover {
        color: var(--rust);
      }
    `;
    document.head.appendChild(style);
  }

  /* ── INJECT FOOTER HTML ── */
  function injectFooter() {
    const footer = document.createElement('div');
    footer.className = 'universal-footer';
    footer.innerHTML = `
      <span class="universal-footer-copy">All works CC0 unless noted</span>
      <div class="universal-footer-links">
        <a href="${MAIN_SITE}" target="_blank">Andy Bryden</a>
        <a href="${GITHUB_URL}" target="_blank">GitHub</a>
        <button id="opinions-trigger-footer">Opinions?</button>
        <a href="#top">↑ Top</a>
      </div>
    `;
    document.body.appendChild(footer);
  }

  /* ── LOAD OPINIONS MODAL ── */
  function loadModal() {
    const script = document.createElement('script');
    script.src = MODAL_SRC;
    document.body.appendChild(script);
  }

  /* ── INIT ── */
  function init() {
    ensureFonts();
    injectStyles();
    injectFooter();
    loadModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
