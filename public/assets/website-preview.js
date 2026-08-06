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

const requestExperiences = {
  PROPERTY_PARTNER: {
    eyebrow: "Partner with EcoViva",
    title: "Let’s explore how we can<br><em>support your clients.</em>",
    intro: "Tell us about your business, the clients you support and the kind of renovation partnership you have in mind.",
    response: "We personally review partnership requests and respond within two working days.",
    kicker: "A clear first introduction",
    guideTitle: "The right context helps us identify where we can add value.",
    reasons: [
      ["Your organisation", "Your role, market and location help us understand where our services may complement yours."],
      ["Your clients", "Tell us what kinds of owners and properties you typically support in Mallorca."],
      ["The opportunity", "Share whether you need technical input, renovation delivery or a dependable referral route."],
      ["The next conversation", "Choose the most useful way to discuss a first collaboration or client case."]
    ],
    next: "We review your information personally and respond within two working days. Submitting the form creates no obligation for either party.",
    formLabel: "EcoViva property partner enquiry"
  },
  SPECIALIST_CONTRACTOR: {
    eyebrow: "Join our specialist network",
    title: "Good work starts with<br><em>clear expectations.</em>",
    intro: "Introduce your company, specialisation and experience so we can assess where your team may fit within the EcoViva network.",
    response: "We personally review contractor applications and respond within two working days.",
    kicker: "Working with EcoViva",
    guideTitle: "A strong specialist network begins with a clear understanding of each team.",
    reasons: [
      ["Your specialisation", "Tell us which trades, systems and types of renovation work your team carries out."],
      ["Experience and standards", "Relevant projects, qualifications and working methods help us assess technical fit."],
      ["Coverage and availability", "Your operating area and capacity help us match the right specialists to prepared scopes."],
      ["Professional alignment", "We look for clear communication, reliable planning and consistent execution quality."]
    ],
    next: "We review each application personally and respond within two working days. Applying does not guarantee assignment to a project.",
    formLabel: "EcoViva specialist contractor application"
  }
};

const requestType = new URLSearchParams(window.location.search).get("request_type_code");
const requestExperience = requestExperiences[requestType];

if (requestExperience) {
  const setContent = (selector, value, html = false) => {
    const element = document.querySelector(selector);
    if (!element) return;
    if (html) element.innerHTML = value;
    else element.textContent = value;
  };

  setContent("[data-request-eyebrow]", requestExperience.eyebrow);
  setContent("[data-request-title]", requestExperience.title, true);
  setContent("[data-request-intro]", requestExperience.intro);
  setContent("[data-request-response]", requestExperience.response);
  setContent("[data-guide-kicker]", requestExperience.kicker);
  setContent("[data-guide-title]", requestExperience.guideTitle);
  setContent("[data-request-next]", requestExperience.next);
  setContent("[data-form-label]", requestExperience.formLabel);
  requestExperience.reasons.forEach(([title, copy], index) => {
    setContent(`[data-reason-title="${index}"]`, title);
    setContent(`[data-reason-copy="${index}"]`, copy);
  });
}
