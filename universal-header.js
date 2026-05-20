/**
 * universal-header.js
 * ─────────────────────────────────────────────────────────────────────────────
 * BRIEFING — read this before modifying or deploying to a new page
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * WHAT IT IS:
 *   A self-contained sticky header injector for all Andy Bryden GitHub
 *   Pages sites. Prepends a consistent branded header to every page it is
 *   loaded on, linking back to the main site and providing an Opinions? trigger.
 *
 *   Layout, design and fonts are identical on every page across every repo.
 *   Only colours change — driven entirely by CSS custom properties on the
 *   host page's :root.
 *
 *   NOT every page uses this script — only pages that need a top navigation
 *   bar. Pages that have their own bespoke header should not include it.
 *   The footer is handled separately by universal-footer.js.
 *
 * WHERE IT LIVES:
 *   Hosted at: https://andy-bryden.github.io/andy-bryden/universal-header.js
 *   Repo:      github.com/andy-bryden/andy-bryden
 *
 * HOW TO ADD IT TO A PAGE — one step only:
 *
 *   Add the script before </body> (after any colour token declarations):
 *     <script src="https://andy-bryden.github.io/andy-bryden/universal-header.js"></script>
 *
 *   Typically used alongside universal-footer.js:
 *     <script>window.OPINIONS_MODAL_SRC = 'opinions-modal-yourrepo.js';</script>
 *     <script src="https://andy-bryden.github.io/andy-bryden/universal-header.js"></script>
 *     <script src="https://andy-bryden.github.io/andy-bryden/universal-footer.js"></script>
 *
 * WHAT IT INJECTS:
 *   A <header class="universal-header"> prepended to document.body, containing:
 *     - "Andy Bryden" link (left) — returns to main site
 *     - "Opinions?" trigger (right) — opens the opinions modal
 *
 *   The Opinions? trigger in the header (id="opinions-trigger") is created by
 *   this script — do not add it manually to the page HTML.
 *
 * COLOUR THEMING:
 *   Reads these CSS custom properties from the host page's :root.
 *   There are NO fallback colours — all colour must be declared on the host page.
 *
 *     --ink    → header background
 *     --gold   → link colour
 *     --rule   → bottom border colour
 *
 *   Declare these in the host page's :root (typically in its own <style> block):
 *     :root {
 *       --ink:  #your-header-background;
 *       --gold: #your-link-colour;
 *       --rule: #your-border-colour;
 *     }
 *
 * FONTS:
 *   Always loads and uses regardless of the host page:
 *     - Cormorant Garamond (display / logotype)
 *     - Libre Baskerville  (body text)
 *     - Inconsolata        (labels / nav links)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  const MAIN_SITE = 'https://andy-bryden.github.io/andy-bryden/';

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
    if (document.getElementById('universal-header-styles')) return;
    const style = document.createElement('style');
    style.id = 'universal-header-styles';
    style.textContent = `
      .universal-header {
        position: sticky;
        top: 0;
        z-index: 100;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        padding: 0.5rem 2.5rem;
        background-color: var(--ink);
        border-bottom: 1px solid var(--rule);
      }

      .universal-header a {
        font-family: 'Inconsolata', monospace;
        font-size: 0.72rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--gold);
        text-decoration: none;
        opacity: 0.85;
        transition: opacity 0.2s;
      }

      .universal-header a:hover {
        opacity: 1;
      }

      .universal-header-opinions {
        grid-column: 3;
        justify-self: end;
        font-family: 'Inconsolata', monospace;
        font-size: 0.72rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--gold);
        opacity: 0.85;
        transition: opacity 0.2s;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
      }

      .universal-header-opinions:hover {
        opacity: 1;
      }

      @media (max-width: 480px) {
        .universal-header {
          padding: 0.5rem 1.25rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /* ── INJECT HEADER HTML ── */
  function injectHeader() {
    const header = document.createElement('header');
    header.className = 'universal-header';
    header.innerHTML = `
      <a href="${MAIN_SITE}">Andy Bryden</a>
      <button class="universal-header-opinions" id="opinions-trigger">Opinions?</button>
    `;
    document.body.insertBefore(header, document.body.firstChild);
  }

  /* ── INIT ── */
  function init() {
    ensureFonts();
    injectStyles();
    injectHeader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
