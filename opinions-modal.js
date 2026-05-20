/**
 * opinions-modal.js
 * ─────────────────────────────────────────────────────────────────────────────
 * BRIEFING — read this before modifying or deploying to a new page
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * WHAT IT IS:
 *   A self-contained, draggable floating contact form modal for all
 *   Andy Bryden GitHub Pages sites. Injects its own HTML, CSS and
 *   fonts — requires no external dependencies.
 *
 *   Layout, design and fonts are identical on every page across every repo.
 *   Only colours change — driven entirely by CSS custom properties on the
 *   host page's :root.
 *
 * WHERE IT LIVES:
 *   Hosted at: https://andy-bryden.github.io/andy-bryden/opinions-modal.js
 *   Repo:      github.com/andy-bryden/andy-bryden
 *
 * HOW TO ADD IT TO A PAGE:
 *   This file is loaded automatically by universal-footer.js — you do not
 *   need to include it directly. universal-footer.js always loads it last.
 *
 *   If the repo has its own colour scheme, declare a repo-specific modal file
 *   BEFORE universal-footer.js (and universal-header.js if used):
 *     <script>window.OPINIONS_MODAL_SRC = 'opinions-modal-yourrepo.js';</script>
 *     <script src=".../universal-header.js"></script>  ← optional
 *     <script src=".../universal-footer.js"></script>  ← always
 *
 * REPO-SPECIFIC COLOUR FILES (e.g. opinions-modal-yourrepo.js):
 *   The only job of a repo-specific file is to:
 *     1. Inject a <style> block setting :root colour tokens for that repo
 *     2. Load this canonical opinions-modal.js from the main site
 *
 *   Template:
 *     (function () {
 *       'use strict';
 *       const style = document.createElement('style');
 *       style.textContent = `
 *         :root {
 *           --ink:   #your-main-text;
 *           --paper: #your-background;
 *           --aged:  #your-input-background;
 *           --rust:  #your-accent;
 *           --gold:  #your-label-colour;
 *           --faded: #your-secondary-text;
 *           --rule:  #your-border;
 *         }
 *       `;
 *       document.head.appendChild(style);
 *       const script = document.createElement('script');
 *       script.src = 'https://andy-bryden.github.io/andy-bryden/opinions-modal.js';
 *       document.body.appendChild(script);
 *     })();
 *
 *   Nothing else belongs in a repo-specific file. All layout, structure,
 *   behaviour and fonts are owned by this canonical file.
 *
 * COLOUR THEMING:
 *   Reads these CSS custom properties from the host page's :root.
 *   There are NO fallback colours — all colour must be declared on the host page.
 *
 *     --ink    → main text
 *     --paper  → modal background
 *     --aged   → input / handle background
 *     --rust   → accent / buttons / hover
 *     --gold   → field labels
 *     --faded  → secondary text / close button
 *     --rule   → borders and dividers
 *
 * FONTS:
 *   Always loads and uses regardless of the host page:
 *     - Cormorant Garamond (thank-you message)
 *     - Libre Baskerville  (body / inputs)
 *     - Inconsolata        (labels / buttons)
 *
 * BEHAVIOUR:
 *   - Triggered by elements with id="opinions-trigger" (header) or
 *     id="opinions-trigger-footer" (footer) — both created by the
 *     universal-header.js and universal-footer.js scripts respectively
 *   - Opens near the clicked trigger (centred near top on mobile)
 *   - Fixed to viewport — page scrolls freely behind it
 *   - Draggable via grip handle (mouse and touch)
 *   - Closes only via ✕ button — no click-outside, no scroll lock, no dimming
 *   - "I'd like a reply" checkbox makes email field required when ticked
 *   - On successful submit, form is replaced with thank-you message
 *   - Formspree endpoint handles delivery — no backend required
 *
 * FORMSPREE ENDPOINT:
 *   Defaults to the main site endpoint. To override for a specific repo,
 *   declare before loading universal-footer.js:
 *     <script>window.OPINIONS_ENDPOINT = 'https://formspree.io/f/YOUR_ID';</script>
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── CONFIG ── */
  const ENDPOINT = window.OPINIONS_ENDPOINT || 'https://formspree.io/f/xkoqyzdr';

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
    if (document.getElementById('opinions-modal-styles')) return;
    const style = document.createElement('style');
    style.id = 'opinions-modal-styles';
    style.textContent = `
      .opinions-modal {
        position: fixed;
        z-index: 9999;
        background-color: var(--paper);
        border: 1px solid var(--rule);
        box-shadow: 4px 8px 32px rgba(26,20,16,0.25);
        border-radius: 4px;
        width: 360px;
        min-width: 260px;
        max-width: 90vw;
        display: none;
        flex-direction: column;
        overflow: hidden;
        font-family: 'Libre Baskerville', Georgia, serif;
      }
      .opinions-modal.open { display: flex; }

      @media (max-width: 640px) {
        .opinions-modal { width: 92vw !important; }
      }

      .modal-handle {
        background-color: var(--aged);
        border-bottom: 1px solid var(--rule);
        padding: 0.55rem 0.9rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: grab;
        user-select: none;
        gap: 0.75rem;
      }
      .modal-handle:active { cursor: grabbing; }

      .modal-grip {
        display: flex;
        gap: 3px;
        align-items: center;
        flex-shrink: 0;
      }
      .modal-grip span {
        display: block;
        width: 16px;
        height: 2px;
        background: var(--rule);
        border-radius: 2px;
        position: relative;
      }
      .modal-grip span::before,
      .modal-grip span::after {
        content: '';
        position: absolute;
        left: 0; right: 0;
        height: 2px;
        background: var(--rule);
        border-radius: 2px;
      }
      .modal-grip span::before { top: -4px; }
      .modal-grip span::after  { top:  4px; }

      .modal-close {
        background: none;
        border: none;
        font-size: 1rem;
        color: var(--faded);
        cursor: pointer;
        padding: 0 0.2rem;
        line-height: 1;
        transition: color 0.2s;
        flex-shrink: 0;
      }
      .modal-close:hover { color: var(--rust); }

      .modal-body {
        padding: 1.4rem 1.6rem 1.6rem;
        overflow-y: auto;
        flex: 1;
      }

      .modal-intro {
        font-size: 0.82rem;
        color: var(--faded);
        line-height: 1.7;
        margin-bottom: 1.4rem;
      }
      @media (max-width: 640px) {
        .modal-intro { font-size: 0.75rem; }
      }

      .modal-form label {
        display: block;
        font-family: 'Inconsolata', monospace;
        font-size: 0.66rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 0.3rem;
        margin-top: 0.9rem;
      }
      .modal-form label:first-child { margin-top: 0; }

      .modal-form input,
      .modal-form textarea {
        width: 100%;
        background: var(--aged);
        border: 1px solid var(--rule);
        border-radius: 3px;
        padding: 0.5rem 0.7rem;
        font-family: 'Libre Baskerville', Georgia, serif;
        font-size: 0.84rem;
        color: var(--ink);
        outline: none;
        transition: border-color 0.2s;
        box-sizing: border-box;
      }
      .modal-form input:focus,
      .modal-form textarea:focus {
        border-color: var(--gold);
      }
      .modal-form textarea {
        resize: vertical;
        min-height: 90px;
        line-height: 1.6;
      }
      @media (max-width: 640px) {
        .modal-form input,
        .modal-form textarea { font-size: 0.78rem; padding: 0.4rem 0.6rem; }
        .modal-form textarea  { min-height: 80px; }
      }

      .message-label-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: 0.3rem;
      }
      .message-label-row label:first-child {
        margin-top: 0;
        margin-bottom: 0;
      }

      .reply-check-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Inconsolata', monospace;
        font-size: 0.62rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--faded);
        cursor: pointer;
        margin-top: 0;
      }
      .reply-check-label input[type="checkbox"] {
        width: auto;
        margin: 0;
        accent-color: var(--rust);
        cursor: pointer;
      }

      .modal-form .field-secondary {
        margin-top: 1rem;
        padding-top: 0.8rem;
        border-top: 1px solid var(--aged);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .modal-form .field-secondary input {
        font-size: 0.8rem;
        padding: 0.4rem 0.6rem;
        background: var(--paper);
      }

      .modal-submit {
        margin-top: 1.2rem;
        width: 100%;
        background: none;
        border: 1px solid var(--rust);
        color: var(--rust);
        font-family: 'Inconsolata', monospace;
        font-size: 0.72rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        padding: 0.65rem 1rem;
        cursor: pointer;
        border-radius: 3px;
        transition: background 0.2s, color 0.2s;
      }
      .modal-submit:hover {
        background: var(--rust);
        color: var(--paper);
      }
      @media (max-width: 640px) {
        .modal-submit { font-size: 0.66rem; padding: 0.55rem; }
      }

      .modal-thankyou {
        display: none;
        text-align: center;
        padding: 2rem 0 1rem;
      }
      .modal-thankyou p {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.3rem;
        font-weight: 300;
        color: var(--ink);
        margin-bottom: 0.6rem;
      }
      .modal-thankyou small {
        font-family: 'Inconsolata', monospace;
        font-size: 0.68rem;
        letter-spacing: 0.12em;
        color: var(--faded);
        text-transform: uppercase;
      }
    `;
    document.head.appendChild(style);
  }

  /* ── INJECT HTML ── */
  function injectHTML() {
    if (document.getElementById('opinions-modal')) return;
    const div = document.createElement('div');
    div.innerHTML = `
      <div class="opinions-modal" id="opinions-modal" role="dialog" aria-modal="true" aria-label="Share your opinions">
        <div class="modal-handle" id="modal-handle">
          <div class="modal-grip"><span></span></div>
          <button class="modal-close" id="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-intro">Everyone has an opinion. What's yours? Feel free to ask a question, share a suggestion or give some constructive criticism. I wouldn't say no to a good debate, even!</p>
          <form class="modal-form" id="opinions-form" action="${ENDPOINT}" method="POST">
            <div class="message-label-row">
              <label>Message</label>
              <label class="reply-check-label">
                <input type="checkbox" id="reply-checkbox" name="_reply_requested"> <small>I'd like a reply</small>
              </label>
            </div>
            <textarea name="message" placeholder="Say what's on your mind…" required></textarea>
            <div class="field-secondary">
              <input type="text" name="name" placeholder="Name (optional)" autocomplete="name">
              <div id="email-field">
                <input type="email" name="email" id="email-input" placeholder="Email (optional)" autocomplete="email">
              </div>
            </div>
            <button type="submit" class="modal-submit">Hit Me With It!</button>
          </form>
          <div class="modal-thankyou" id="modal-thankyou">
            <p>Thank you — message received.</p>
            <small>I'll be in touch if you left an email.</small>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(div.firstElementChild);
  }

  /* ── INIT LOGIC ── */
  function init() {
    ensureFonts();
    injectStyles();
    injectHTML();

    const modal = document.getElementById('opinions-modal');
    const closeBtn = document.getElementById('modal-close');
    const handle = document.getElementById('modal-handle');
    const form = document.getElementById('opinions-form');
    const thankyou = document.getElementById('modal-thankyou');
    const replyCheckbox = document.getElementById('reply-checkbox');
    const emailInput = document.getElementById('email-input');
    const triggerNav = document.getElementById('opinions-trigger');
    const triggerFooter = document.getElementById('opinions-trigger-footer');

    /* ── OPEN / CLOSE ── */
    function openModal(nearX, nearY) {
      form.style.display = '';
      thankyou.style.display = 'none';
      form.reset();
      emailInput.required = false;
      emailInput.placeholder = 'Email (optional)';

      modal.style.display = 'flex';
      modal.classList.add('open');

      const mw = modal.offsetWidth || 360;
      const mh = modal.offsetHeight || 300;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let left, top;

      if (vw <= 640) {
        left = (vw - mw) / 2;
        top = vh * 0.12;
      } else {
        left = nearX + 12;
        top = nearY + 12;
        if (left + mw > vw - 16) left = nearX - mw - 12;
        if (top + mh > vh - 16) top = nearY - mh - 12;
        left = Math.max(8, left);
        top = Math.max(8, top);
      }
      modal.style.left = left + 'px';
      modal.style.top = top + 'px';
      modal.style.right = 'auto';
      modal.style.bottom = 'auto';
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.style.display = 'none';
    }

    closeBtn.addEventListener('click', closeModal);

    if (triggerNav) {
      triggerNav.addEventListener('click', () => {
        const r = triggerNav.getBoundingClientRect();
        openModal(r.left, r.bottom);
      });
    }
    if (triggerFooter) {
      triggerFooter.addEventListener('click', () => {
        const r = triggerFooter.getBoundingClientRect();
        openModal(r.left, r.top);
      });
    }

    /* ── DRAG ── */
    let dragging = false, dragOffX = 0, dragOffY = 0;

    handle.addEventListener('mousedown', (e) => {
      dragging = true;
      const rect = modal.getBoundingClientRect();
      dragOffX = e.clientX - rect.left;
      dragOffY = e.clientY - rect.top;
      modal.style.right = 'auto';
      modal.style.bottom = 'auto';
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      let l = e.clientX - dragOffX;
      let t = e.clientY - dragOffY;
      l = Math.max(0, Math.min(l, window.innerWidth - modal.offsetWidth));
      t = Math.max(0, Math.min(t, window.innerHeight - modal.offsetHeight));
      modal.style.left = l + 'px';
      modal.style.top = t + 'px';
    });
    document.addEventListener('mouseup', () => { dragging = false; });

    handle.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      dragging = true;
      const rect = modal.getBoundingClientRect();
      dragOffX = t.clientX - rect.left;
      dragOffY = t.clientY - rect.top;
      modal.style.right = 'auto';
      modal.style.bottom = 'auto';
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const t = e.touches[0];
      let l = t.clientX - dragOffX;
      let tv = t.clientY - dragOffY;
      l = Math.max(0, Math.min(l, window.innerWidth - modal.offsetWidth));
      tv = Math.max(0, Math.min(tv, window.innerHeight - modal.offsetHeight));
      modal.style.left = l + 'px';
      modal.style.top = tv + 'px';
    }, { passive: true });
    document.addEventListener('touchend', () => { dragging = false; });

    /* ── REPLY CHECKBOX ── */
    replyCheckbox.addEventListener('change', () => {
      const checked = replyCheckbox.checked;
      emailInput.required = checked;
      emailInput.placeholder = checked ? 'Email (required)' : 'Email (optional)';
      if (!checked) emailInput.value = '';
    });

    /* ── FORM SUBMIT ── */
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.style.display = 'none';
          thankyou.style.display = 'block';
        } else {
          alert('Something went wrong — please try again.');
        }
      } catch {
        alert('Could not send — please check your connection.');
      }
    });
  }

  /* ── WAIT FOR DOM ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
