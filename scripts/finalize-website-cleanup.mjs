import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pages = ["en", "es", "de"];
const navPatterns = {
  en: /<a href="#what-we-do" data-section-link="what-we-do">Renovation Solutions<\/a><a href="#how-we-work" data-section-link="how-we-work">How We Work<\/a><a href="#library" data-section-link="library">Technical Library<\/a><a href="#about" data-section-link="about">About EcoViva<\/a><a href="#professionals" data-section-link="professionals">Partners &amp; Contractors<\/a>/,
  es: /<a href="#what-we-do" data-section-link="what-we-do">Soluciones de reforma<\/a><a href="#how-we-work" data-section-link="how-we-work">Cómo trabajamos<\/a><a href="#library" data-section-link="library">Biblioteca técnica<\/a><a href="#about" data-section-link="about">Sobre EcoViva<\/a><a href="#professionals" data-section-link="professionals">Colaboradores y contratistas<\/a>/,
  de: /<a href="#what-we-do" data-section-link="what-we-do">Renovierungslösungen<\/a><a href="#how-we-work" data-section-link="how-we-work">Wie wir arbeiten<\/a><a href="#library" data-section-link="library">Technische Bibliothek<\/a><a href="#about" data-section-link="about">Über EcoViva<\/a><a href="#professionals" data-section-link="professionals">Partner & Fachbetriebe<\/a>/
};

for (const locale of pages) {
  const path = resolve(root, `public/${locale}/index.html`);
  let html = await readFile(path, "utf8");
  html = html
    .replaceAll("/assets/logos/ecoviva_mallorca_horizontal_darkgreen.svg", "/assets/logos/ecoviva-horizontal-header.png")
    .replace(/website-preview\.css\?v=[^"]+/, "website-preview.css?v=20260810-final-website-cleanup")
    .replace(/website-preview\.js\?v=[^"]+/, "website-preview.js?v=20260810-final-website-cleanup")
    .replace(navPatterns[locale], match => match.split(/<a href="#about"/)[0])
    .replace(
      /<img src="\/assets\/website-preview\/studio-system-sample\.webp" alt="[^"]+" loading="lazy">/,
      '<img src="/assets/website-preview/studio-plan-review.webp?v=20260810" alt="Renovation plans and technical system options reviewed together in the EcoViva studio" loading="lazy">'
    );
  await writeFile(path, html);
}

const jsPath = resolve(root, "public/assets/website-preview.js");
let js = await readFile(jsPath, "utf8");
js = js
  .replace(/const recolorLogoGreen=.*?document\.querySelectorAll\('\.brand img,\.footer-brand img'\)\.forEach\(recolorLogoGreen\);\n/s, "")
  .replaceAll("/assets/website-preview/before-renovation-concept.svg", "/assets/website-preview/before-renovation-concept.webp?v=20260810")
  .replaceAll("/assets/website-preview/after-renovation-concept.svg", "/assets/website-preview/after-renovation-concept.webp?v=20260810");
await writeFile(jsPath, js);
