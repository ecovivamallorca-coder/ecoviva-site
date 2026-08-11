(() => {
  const cards = document.querySelectorAll('.library-landing-page .library-card');
  if (!cards.length) return;

  const style = document.createElement('style');
  style.textContent = `
    .library-hero-signed {
      position: relative;
      min-width: 0;
      height: 245px;
      overflow: hidden;
      background: #fff;
    }
    .library-hero-signed > img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
    .library-card--natural-stone .library-hero-signed > img {
      object-fit: contain;
      object-position: center;
    }
    .library-card--thermowood .library-hero-signed > img,
    .library-card--universal-facade .library-hero-signed > img,
    .library-card--flat-roof .library-hero-signed > img {
      padding: 12px;
      object-fit: contain;
      object-position: center;
    }
    .library-hero-signature {
      position: absolute;
      right: 11px;
      bottom: 9px;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 7px;
      max-width: calc(100% - 22px);
      padding: 5px 8px 5px 7px;
      border: 1px solid rgba(49, 85, 26, .16);
      border-radius: 5px;
      background: rgba(255, 255, 255, .86);
      box-shadow: 0 2px 9px rgba(23, 26, 22, .07);
      color: #31551a;
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      line-height: 1;
      pointer-events: none;
      backdrop-filter: blur(3px);
    }
    .library-hero-signature img {
      width: 42px !important;
      height: auto !important;
      display: block !important;
      padding: 0 !important;
      object-fit: contain !important;
    }
    .library-hero-signature span {
      display: grid;
      gap: 2px;
      white-space: nowrap;
    }
    .library-hero-signature strong {
      min-height: 0 !important;
      display: block !important;
      margin: 0;
      color: #31551a;
      font-size: 7px !important;
      font-weight: 800;
      line-height: 1.05 !important;
      letter-spacing: .075em;
      text-transform: uppercase;
    }
    .library-hero-signature small {
      color: rgba(23, 26, 22, .68) !important;
      font-size: 6.5px !important;
      font-weight: 600 !important;
      line-height: 1.05;
      letter-spacing: .01em;
    }
    @media (max-width: 760px) {
      .library-hero-signed { height: auto; aspect-ratio: 3 / 2; }
      .library-hero-signature { right: 9px; bottom: 8px; }
    }
  `;
  document.head.appendChild(style);

  cards.forEach((card) => {
    const hero = card.querySelector(':scope > img');
    if (!hero) return;

    const wrap = document.createElement('div');
    wrap.className = 'library-hero-signed';
    hero.before(wrap);
    wrap.appendChild(hero);

    const signature = document.createElement('div');
    signature.className = 'library-hero-signature';
    signature.setAttribute('aria-hidden', 'true');
    signature.innerHTML = `
      <img src="/assets/technical-library/ecoviva-logo.svg" alt="">
      <span>
        <strong>EcoViva Technical Library</strong>
        <small>© 2026 EcoViva Mallorca · All rights reserved.</small>
      </span>
    `;
    wrap.appendChild(signature);
  });
})();
