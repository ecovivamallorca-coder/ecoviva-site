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
