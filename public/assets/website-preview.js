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
        visibleSections.set(entry.target.id, entry.intersectionRatio);
      } else {
        visibleSections.delete(entry.target.id);
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
