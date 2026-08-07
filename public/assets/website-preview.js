const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const sectionLinks = [...document.querySelectorAll("[data-section-link]")];
const progress = document.querySelector(".scroll-progress span");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

const sections = [...document.querySelectorAll("[data-nav-section]")];

const setActiveSection = (id) => {
  sectionLinks.forEach((link) => {
    if (link.dataset.sectionLink === id) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

if (sections.length && "IntersectionObserver" in window) {
  const visibleSections = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visibleSections.set(entry.target, entry.intersectionRatio);
      } else {
        visibleSections.delete(entry.target);
      }
    });
    const active = [...visibleSections.entries()].sort((a, b) => b[1] - a[1])[0];
    if (active) setActiveSection(active[0].dataset.navSection);
  }, {
    rootMargin: "-18% 0px -58% 0px",
    threshold: [0, .15, .35, .6]
  });
  sections.forEach((section) => observer.observe(section));
}

const updateProgress = () => {
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
};

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });

const requestType = new URLSearchParams(window.location.search).get("request_type_code");
const requestCopy = {
  PROPERTY_PARTNER: {
    eyebrow: "Partner with EcoViva",
    title: "Let’s explore how we can support your clients.<em>A dependable renovation route.</em>",
    intro: "Introduce your business and the clients or properties you support. Choose a convenient appointment or send the information first for a personal review.",
    formLabel: "EcoViva property partner enquiry",
    guide: `<div class="request-guide-intro"><span>Property partners</span><strong>A dependable renovation partner protects the client relationship.</strong></div><ol class="request-reasons"><li><b>01</b><div><strong>Your business</strong><p>Tell us about your role, market and the owners you support.</p></div></li><li><b>02</b><div><strong>Your clients</strong><p>Explain where renovation guidance could strengthen your service.</p></div></li><li><b>03</b><div><strong>The collaboration</strong><p>Share how you would prefer introductions and project follow-up to work.</p></div></li></ol><div class="request-next"><small>Choose the next step</small><p>Book a suitable time directly or submit the enquiry first. We personally review it and respond within two working days, without obligation.</p></div>`
  },
  SPECIALIST_CONTRACTOR: {
    eyebrow: "Join our specialist network",
    title: "Good work starts with clear expectations.<em>Tell us about your team.</em>",
    intro: "Introduce your company, specialisation and experience so we can assess where your team may fit within the EcoViva network.",
    formLabel: "EcoViva contractor application",
    guide: `<div class="request-guide-intro"><span>Specialist contractors</span><strong>Quality execution begins with a clear scope and professional coordination.</strong></div><ol class="request-reasons"><li><b>01</b><div><strong>Your specialisation</strong><p>Tell us which works your team performs and where you operate.</p></div></li><li><b>02</b><div><strong>Your experience</strong><p>Share relevant projects, certifications and examples of completed work.</p></div></li><li><b>03</b><div><strong>Your availability</strong><p>Help us understand your capacity and preferred type of project.</p></div></li></ol><div class="request-next"><small>Personal review · Without obligation</small><p>We personally review contractor applications and respond within two working days.</p></div>`
  }
};

if (requestType && requestCopy[requestType]) {
  const copy = requestCopy[requestType];
  const eyebrow = document.querySelector("#request-eyebrow");
  const title = document.querySelector("#request-title");
  const intro = document.querySelector("#request-intro");
  const guide = document.querySelector("#request-guide");
  const formLabel = document.querySelector("#request-form-label");
  if (eyebrow) eyebrow.textContent = copy.eyebrow;
  if (title) title.innerHTML = copy.title;
  if (intro) intro.textContent = copy.intro;
  if (guide) guide.innerHTML = copy.guide;
  if (formLabel) formLabel.textContent = copy.formLabel;
}

// Force the EcoViva image mark favicon and bypass stale browser favicon caches.
document.querySelectorAll('link[rel~="icon"], link[rel="shortcut icon"]').forEach((link) => link.remove());
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/png";
favicon.sizes = "32x32";
favicon.href = "/favicon/favicon.png?v=20260807-ecoviva-mark";
document.head.appendChild(favicon);
const shortcutIcon = document.createElement("link");
shortcutIcon.rel = "shortcut icon";
shortcutIcon.href = "/favicon/favicon.png?v=20260807-ecoviva-mark";
document.head.appendChild(shortcutIcon);

// Final visual corrections for the English website preview.
const finalVisualFixes = document.createElement("style");
finalVisualFixes.textContent = `
  .site-header {
    background: #11111f !important;
    backdrop-filter: none !important;
  }

  .brand img,
  .footer-brand img {
    filter: none !important;
  }

  .hero {
    min-height: 720px !important;
  }

  .hero-inner {
    min-height: 638px !important;
  }

  .hero-copy {
    padding: 46px 0 !important;
  }

  .promise-card {
    margin-bottom: 44px !important;
  }

  .hero-copy h1 {
    line-height: 1.01;
  }

  .hero-copy h1 em {
    line-height: 1.12;
  }

  .request-heading {
    grid-template-columns: minmax(0, 1.05fr) minmax(340px, .95fr) !important;
    gap: 1.25rem 7vw !important;
    align-items: end !important;
  }

  .request-heading h2 {
    max-width: 700px;
    font-size: clamp(2.75rem, 4.15vw, 4.55rem) !important;
    line-height: .98 !important;
    text-wrap: balance;
  }

  .request-heading h2 em {
    margin-top: .2em !important;
    line-height: 1.03 !important;
  }

  .request-heading > p:last-child {
    align-self: end;
    margin-bottom: .45rem !important;
  }

  .about-photo {
    min-height: 0 !important;
    aspect-ratio: 4 / 5;
  }

  .about-photo img {
    height: 100% !important;
    min-height: 0 !important;
    object-fit: cover;
    object-position: 50% 58% !important;
  }

  @media (min-width: 651px) {
    .studio-story-grid {
      grid-auto-rows: clamp(360px, 32vw, 500px);
      align-items: stretch;
    }

    .studio-story-grid .studio-shot,
    .studio-story-grid .studio-shot-wide {
      height: 100%;
      min-height: 0;
      aspect-ratio: auto;
    }

    .studio-story-grid .studio-shot:nth-child(2) img {
      object-position: 50% 50%;
    }
  }

  @media (max-width: 980px) {
    .hero {
      min-height: auto !important;
    }

    .hero-inner {
      min-height: 0 !important;
    }

    .hero-copy {
      padding: 60px 0 20px !important;
    }

    .promise-card {
      margin-bottom: 40px !important;
    }

    .request-heading {
      grid-template-columns: 1fr !important;
      gap: 1.25rem !important;
    }

    .request-heading .eyebrow {
      grid-column: auto !important;
    }

    .request-heading h2 {
      max-width: 760px;
      font-size: clamp(2.7rem, 8vw, 4.6rem) !important;
    }

    .request-heading > p:last-child {
      max-width: 680px;
      margin-bottom: 0 !important;
    }
  }
`;
document.head.appendChild(finalVisualFixes);

const recolorLogoGreen = (img) => {
  const apply = () => {
    if (!img.naturalWidth || !img.naturalHeight || img.dataset.ecovivaGreenAdjusted === "1") return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const target = { r: 118, g: 164, b: 88 };

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a > 8 && g > r * 1.12 && g > b * 1.08 && g > 70) {
          const brightness = Math.max(r, g, b) / 255;
          const scale = 0.82 + brightness * 0.18;
          data[i] = Math.round(target.r * scale);
          data[i + 1] = Math.round(target.g * scale);
          data[i + 2] = Math.round(target.b * scale);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      img.dataset.ecovivaGreenAdjusted = "1";
      img.src = canvas.toDataURL("image/png");
    } catch (_) {
      // Keep the original logo if canvas processing is unavailable.
    }
  };

  if (img.complete) apply();
  else img.addEventListener("load", apply, { once: true });
};

document.querySelectorAll('.brand img, .footer-brand img').forEach(recolorLogoGreen);
