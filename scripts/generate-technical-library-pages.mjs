import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { copy, langs, pdfByLang, privacyByLang } from "./technical-library-content.mjs";
import { eticsCopy, eticsPdfByLang, eticsSlugByLang } from "./technical-library-etics-content.mjs";
import {
  stoneCopy,
  stonePdfByLang,
  stoneSlugByLang,
} from "./technical-library-natural-stone-content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://www.ecoviva-mallorca.com";
const assetRoot = "/assets/technical-library";
const eticsAssetRoot = `${assetRoot}/etics`;
const stoneAssetRoot = `${assetRoot}/natural-stone`;
const roofSlug = "traditional-mallorcan-roof";
const colourSwatches = ["#D8D1C2", "#CDB995", "#D6BB7A", "#E6DDC8", "#C79B7C", "#8F6A4F"];

const landingDescriptions = {
  en: "EcoViva Mallorca technical construction guidance and downloadable technical sheets for renovation projects in Mallorca.",
  es: "Orientación técnica de EcoViva Mallorca y fichas técnicas descargables para proyectos de reforma en Mallorca.",
  de: "Technische Bauinformationen und technische Datenblätter von EcoViva Mallorca für Renovierungsprojekte auf Mallorca.",
};

const landingEyebrows = {
  en: "Construction guidance",
  es: "Orientación constructiva",
  de: "Technische Bauinformationen",
};

const languageNames = { en: "English", es: "Español", de: "Deutsch" };

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const alternateLinks = (suffix = "") =>
  langs
    .map(
      (lang) =>
        `    <link rel="alternate" hreflang="${lang}" href="${origin}/technical-library/${lang}/${suffix}">`,
    )
    .concat(
      `    <link rel="alternate" hreflang="x-default" href="${origin}/technical-library/en/${suffix}">`,
    )
    .join("\n");

const eticsAlternateLinks = () =>
  langs
    .map(
      (lang) =>
        `    <link rel="alternate" hreflang="${lang}" href="${origin}/technical-library/${lang}/${eticsSlugByLang[lang]}/">`,
    )
    .concat(
      `    <link rel="alternate" hreflang="x-default" href="${origin}/technical-library/en/${eticsSlugByLang.en}/">`,
    )
    .join("\n");

const stoneAlternateLinks = () =>
  langs
    .map(
      (lang) =>
        `    <link rel="alternate" hreflang="${lang}" href="${origin}/technical-library/${lang}/${stoneSlugByLang[lang]}/">`,
    )
    .concat(
      `    <link rel="alternate" hreflang="x-default" href="${origin}/technical-library/en/${stoneSlugByLang.en}/">`,
    )
    .join("\n");

const languageSwitch = (lang, suffix = "", destinations = null) => {
  const label = copy[lang].languageLabel;
  return `<nav class="language-switch" aria-label="${escapeHtml(label)}">
${langs
  .map(
    (item) =>
      `          <a href="${destinations ? destinations[item] : `/technical-library/${item}/${suffix}`}" hreflang="${item}" lang="${item}"${
        item === lang ? ' aria-current="page"' : ""
      }>${copy[item].code}</a>`,
  )
  .join("\n")}
        </nav>`;
};

const header = (lang, suffix = "", destinations = null) => `<a class="skip-link" href="#main">${escapeHtml(copy[lang].skip)}</a>
    <header class="roof-site-header">
      <div class="roof-header-inner">
        <a class="roof-brand" href="${origin}/" aria-label="EcoViva Mallorca">
          <img src="${assetRoot}/ecoviva-logo.svg" width="2420" height="690" alt="EcoViva Mallorca">
        </a>
        ${languageSwitch(lang, suffix, destinations)}
      </div>
    </header>`;

const footer = (lang) => `<footer class="roof-site-footer">
      <div class="roof-shell roof-footer-inner">
        <p><strong>EcoViva Mallorca S.L.</strong> · Palma de Mallorca</p>
        <div class="roof-footer-links">
          <a href="${origin}/">www.ecoviva-mallorca.com</a>
          <a href="mailto:info@ecoviva-mallorca.com">info@ecoviva-mallorca.com</a>
          <a href="${privacyByLang[lang]}">${escapeHtml(copy[lang].privacy)}</a>
        </div>
        <p class="roof-disclaimer">${escapeHtml(copy[lang].disclaimer)}</p>
      </div>
    </footer>`;

const documentHead = ({
  lang,
  title,
  description,
  canonical,
  suffix,
  type = "website",
  alt,
  alternates = alternateLinks(suffix),
  ogImage = `${origin}${assetRoot}/tejo-roof-hero.png`,
  ogWidth = 1536,
  ogHeight = 1024,
  structuredData = "",
}) => `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${canonical}">
${alternates}
    <meta property="og:type" content="${type}">
    <meta property="og:locale" content="${lang === "en" ? "en_GB" : lang === "es" ? "es_ES" : "de_DE"}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="${ogWidth}">
    <meta property="og:image:height" content="${ogHeight}">
    <meta property="og:image:alt" content="${escapeHtml(alt)}">${structuredData ? `\n${structuredData}` : ""}
    <link rel="icon" href="/favicon/favicon.png" type="image/png">
    <link rel="stylesheet" href="/assets/technical-roof.css">
  </head>`;

const heroDiagram = (lang) => {
  const callouts = [
    [1, "M103.65 36.8 L96.2 38.2 L88.2 40.3 L80.57 43.51", 80.57, 43.51, 36.8],
    [2, "M103.65 44.7 L93.5 47.2 L76.2 51.2 L60.95 55.28", 60.95, 55.28, 44.7],
    [3, "M103.65 52.5 L94.3 54.1 L85.4 56 L77.14 57.73", 77.14, 57.73, 52.5],
    [4, "M103.65 60.3 L93.8 60.1 L82.6 60 L71.75 60.18", 71.75, 60.18, 60.3],
    [5, "M103.65 67 L94.5 66.7 L83 65.5 L72.73 64.11", 72.73, 64.11, 67],
    [6, "M103.65 76.3 L95 74.8 L84.7 72.1 L74.69 69.5", 74.69, 69.5, 76.3],
    [7, "M103.65 84 L95 81.5 L83 78 L72.24 74.89", 72.24, 74.89, 84],
    [8, "M103.65 91.5 L98 88.5 L91.2 84.8 L85.49 81.76", 85.49, 81.76, 91.5],
  ];
  return `<figure class="hero-diagram">
              <svg viewBox="7 31 103 68.667" role="img" aria-labelledby="hero-title-${lang}">
                <title id="hero-title-${lang}">${escapeHtml(copy[lang].heroAlt)}</title>
                <rect x="7" y="31" width="103" height="68.667" fill="#f4f6f3" stroke="#d9ded8" stroke-width=".45"/>
                <image href="${assetRoot}/tejo-roof-hero.png" x="7" y="31" width="103" height="68.667" preserveAspectRatio="xMidYMid meet"/>
                <g stroke-linecap="round" stroke-linejoin="round">
${callouts
  .map(
    ([number, path, x, y, cy]) => `                  <g>
                    <path d="${path}" fill="none" stroke="#fff" stroke-width="1"/>
                    <path d="${path}" fill="none" stroke="#0b0d0b" stroke-width=".34"/>
                    <circle cx="${x}" cy="${y}" r=".75" fill="#fff" stroke="#0b0d0b" stroke-width=".34"/>
                    <circle cx="105.8" cy="${cy}" r="2.15" fill="#3e6b20" stroke="#fff" stroke-width=".35"/>
                    <text x="105.8" y="${(cy + 0.8).toFixed(1)}" text-anchor="middle" class="hero-number">${number}</text>
                  </g>`,
  )
  .join("\n")}
                </g>
              </svg>
            </figure>`;
};

const sectionTitle = (title) => `<h2 class="section-title">${escapeHtml(title)}</h2>`;

const iconCards = (items, className) =>
  `<div class="${className}">
${items
  .map(
    ([title, body, icon]) => `                <article class="icon-card">
                  <img src="${assetRoot}/icons/${icon}" width="64" height="64" alt="" aria-hidden="true">
                  <div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div>
                </article>`,
  )
  .join("\n")}
              </div>`;

const roofPage = (lang) => {
  const c = copy[lang];
  const suffix = `${roofSlug}/`;
  const canonical = `${origin}/technical-library/${lang}/${suffix}`;
  return `${documentHead({
    lang,
    title: c.metaTitle,
    description: c.metaDescription,
    canonical,
    suffix,
    type: "article",
    alt: c.heroAlt,
  })}
  <body class="roof-page">
    ${header(lang, suffix)}
    <main id="main">
      <section class="page-heading roof-shell">
        <p class="roof-eyebrow">${escapeHtml(c.eyebrow)}</p>
        <h1>${escapeHtml(c.title)}</h1>
        <div class="heading-rule" aria-hidden="true"></div>
      </section>

      <div class="roof-shell content-flow">
        <section class="hero-overview" aria-label="${escapeHtml(c.overviewTitle)}">
          ${heroDiagram(lang)}
          <div class="stack">
            <article class="panel overview">
              ${sectionTitle(c.overviewTitle)}
              <p>${escapeHtml(c.overview)}</p>
            </article>
            <article class="panel">
              ${sectionTitle(c.whyTitle)}
              <ul class="why-list">
${c.why.map((item) => `                <li>${escapeHtml(item)}</li>`).join("\n")}
              </ul>
            </article>
          </div>
        </section>

        <section class="panel">
          ${sectionTitle(c.layersTitle)}
          <ol class="layer-grid">
${c.layers
  .map(
    ([title, body], index) => `            <li>
              <span class="number">${index + 1}</span>
              <div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div>
            </li>`,
  )
  .join("\n")}
          </ol>
        </section>

        <section class="panel">
          ${sectionTitle(c.principlesTitle)}
          ${iconCards(c.principles, "principle-grid")}
        </section>

        <div class="lower-grid">
          <div class="stack">
            <section class="panel">
              ${sectionTitle(c.fixingTitle)}
              <p>${escapeHtml(c.fixingIntro)}</p>
              <ol class="fixing-grid">
${c.fixings
  .map(
    ([label, image]) => `                <li>
                  <img src="${assetRoot}/${image}" width="660" height="451" alt="${escapeHtml(label)}">
                  <span>${escapeHtml(label)}</span>
                </li>`,
  )
  .join("\n")}
              </ol>
            </section>
            <aside class="panel compliance">
              ${sectionTitle(c.complianceTitle)}
              <p>${escapeHtml(c.compliance)}</p>
            </aside>
          </div>

          <section class="panel">
            ${sectionTitle(c.benefitsTitle)}
            ${iconCards(c.benefits, "benefit-list")}
          </section>
        </div>

        <nav class="actions" aria-label="${escapeHtml(c.actionsLabel)}">
          <a class="button primary" href="/downloads/${pdfByLang[lang]}" download="${pdfByLang[lang]}">${escapeHtml(c.download)}</a>
          <a class="button secondary" href="/technical-library/${lang}/">${escapeHtml(c.backLibrary)}</a>
          <a class="button text-button" href="${origin}/">${escapeHtml(c.backHome)}</a>
        </nav>
      </div>
    </main>
    ${footer(lang)}
  </body>
</html>
`;
};

const eticsHeroDiagram = (lang) => {
  const callouts = [
    [1, 36.3, 16, 39, 20, 44],
    [2, 44, 16.5, 46, 38, 51],
    [3, 51.7, 17, 54, 50.5, 57],
    [4, 59.4, 17.5, 62, 56, 68.5],
    [5, 67.1, 18, 68.7, 60, 70.8],
    [6, 74.8, 18.5, 75.8, 66.5, 77.2],
    [7, 82.5, 19, 82.5, 70.5, 82.8],
    [8, 90.2, 19.5, 90, 92, 87.5],
  ];
  const c = eticsCopy[lang];
  return `<figure class="hero-diagram etics-hero-diagram">
              <svg viewBox="7 31 103 68.667" role="img" aria-labelledby="etics-hero-title-${lang}">
                <title id="etics-hero-title-${lang}">${escapeHtml(c.heroAlt)}</title>
                <rect x="7" y="31" width="103" height="68.667" fill="#f4f6f3" stroke="#d9ded8" stroke-width=".45"/>
                <image href="${eticsAssetRoot}/crepi-hero.png" x="7" y="31" width="103" height="68.667" preserveAspectRatio="xMidYMid meet"/>
                <g stroke-linecap="round" stroke-linejoin="round">
${callouts
  .map(([number, cy, elbowX, elbowY, targetX, targetY]) => {
    const path = `M13.55 ${cy} L${elbowX} ${elbowY} L${targetX} ${targetY}`;
    return `                  <g>
                    <path d="${path}" fill="none" stroke="#fff" stroke-width="1"/>
                    <path d="${path}" fill="none" stroke="#0b0d0b" stroke-width=".34"/>
                    <circle cx="${targetX}" cy="${targetY}" r=".65" fill="#fff" stroke="#0b0d0b" stroke-width=".34"/>
                    <circle cx="11.4" cy="${cy}" r="2.15" fill="#3e6b20" stroke="#fff" stroke-width=".35"/>
                    <text x="11.4" y="${(cy + 0.78).toFixed(2)}" text-anchor="middle" class="hero-number">${number}</text>
                  </g>`;
  })
  .join("\n")}
                </g>
              </svg>
            </figure>`;
};

const eticsPage = (lang) => {
  const c = eticsCopy[lang];
  const slug = eticsSlugByLang[lang];
  const canonical = `${origin}/technical-library/${lang}/${slug}/`;
  const destinations = Object.fromEntries(
    langs.map((item) => [item, `/technical-library/${item}/${eticsSlugByLang[item]}/`]),
  );
  const breadcrumbNames = {
    en: ["Technical Library", c.title],
    es: ["Biblioteca Técnica", c.title],
    de: ["Technische Bibliothek", c.title],
  };
  const structuredData = `    <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: breadcrumbNames[lang][0],
        item: `${origin}/technical-library/${lang}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: breadcrumbNames[lang][1],
        item: canonical,
      },
    ],
  }).replaceAll("<", "\\u003c")}</script>`;
  const pageTitle =
    lang === "de" ? "Wärmedämm<wbr>verbundsystem – WDVS" : escapeHtml(c.title);

  return `${documentHead({
    lang,
    title: c.metaTitle,
    description: c.metaDescription,
    canonical,
    suffix: `${slug}/`,
    type: "article",
    alt: c.heroAlt,
    alternates: eticsAlternateLinks(),
    ogImage: `${origin}${eticsAssetRoot}/crepi-hero.png`,
    ogWidth: 1535,
    ogHeight: 1024,
    structuredData,
  })}
  <body class="roof-page etics-page">
    ${header(lang, "", destinations)}
    <main id="main">
      <section class="page-heading roof-shell">
        <p class="roof-eyebrow">${escapeHtml(c.eyebrow)}</p>
        <h1>${pageTitle}</h1>
        <div class="heading-rule" aria-hidden="true"></div>
      </section>

      <div class="roof-shell content-flow">
        <section class="hero-overview" aria-label="${escapeHtml(c.overviewTitle)}">
          ${eticsHeroDiagram(lang)}
          <div class="stack">
            <article class="panel overview">
              ${sectionTitle(c.overviewTitle)}
              <p>${escapeHtml(c.overview)}</p>
            </article>
            <article class="panel">
              ${sectionTitle(c.whyTitle)}
              <ul class="why-list">
${c.why.map((item) => `                <li>${escapeHtml(item)}</li>`).join("\n")}
              </ul>
            </article>
          </div>
        </section>

        <section class="panel">
          ${sectionTitle(c.layersTitle)}
          <ol class="layer-grid">
${c.layers
  .map(
    ([title, body], index) => `            <li>
              <span class="number">${index + 1}</span>
              <div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div>
            </li>`,
  )
  .join("\n")}
          </ol>
        </section>

        <section class="panel">
          ${sectionTitle(c.principlesTitle)}
          ${iconCards(c.principles, "etics-principle-grid")}
        </section>

        <section class="panel">
          ${sectionTitle(c.componentsTitle)}
          <p>${escapeHtml(c.componentsIntro)}</p>
          <ol class="component-grid">
${c.components
  .map(
    ([label, image], index) => `            <li>
              <div class="component-image component-image-${index + 1}">
                <img src="${eticsAssetRoot}/${image}" width="${index === 3 ? 1086 : 1024}" height="${
                  index === 3 ? 1448 : 1536
                }" alt="${escapeHtml(label)}">
              </div>
              <span><b>${index + 1}.</b> ${escapeHtml(label)}</span>
            </li>`,
  )
  .join("\n")}
          </ol>
        </section>

        <div class="lower-grid">
          <aside class="panel compliance">
            ${sectionTitle(c.complianceTitle)}
            <p>${escapeHtml(c.compliance)}</p>
          </aside>
          <section class="panel">
            ${sectionTitle(c.benefitsTitle)}
            ${iconCards(c.benefits, "benefit-list")}
          </section>
        </div>

        <section class="panel colour-panel" aria-labelledby="facade-colours-${lang}">
          <h2 class="section-title" id="facade-colours-${lang}">${escapeHtml(c.coloursTitle)}</h2>
          <div class="colour-row" aria-hidden="true">
${colourSwatches.map((colour) => `            <span style="background-color:${colour}"></span>`).join("\n")}
          </div>
          <p>${escapeHtml(c.coloursDisclaimer)}</p>
        </section>

        <nav class="actions" aria-label="${escapeHtml(copy[lang].actionsLabel)}">
          <a class="button primary" href="/downloads/${eticsPdfByLang[lang]}" download="${eticsPdfByLang[lang]}">${escapeHtml(c.download)}</a>
          <a class="button secondary" href="/technical-library/${lang}/">${escapeHtml(copy[lang].backLibrary)}</a>
          <a class="button text-button" href="${origin}/">${escapeHtml(copy[lang].backHome)}</a>
        </nav>
      </div>
    </main>
    ${footer(lang)}
  </body>
</html>
`;
};

const stoneHeroDiagram = (lang) => {
  const callouts = [
    [1, 38, 17.2, 40.2, 25, 48],
    [2, 45.5, 17.7, 47.5, 36, 54],
    [3, 53, 18.2, 55, 48, 59],
    [4, 60.5, 18.7, 62, 55.2, 63],
    [5, 68, 19.2, 69.5, 59, 67],
    [6, 75.5, 19.7, 76.5, 66, 72],
    [7, 83, 20.2, 83.2, 73, 77],
    [8, 90.5, 20.7, 89.5, 90, 83],
  ];
  const c = stoneCopy[lang];
  return `<figure class="hero-diagram stone-hero-diagram">
              <svg viewBox="7 31 103 68.667" role="img" aria-labelledby="stone-hero-title-${lang}">
                <title id="stone-hero-title-${lang}">${escapeHtml(c.heroAlt)}</title>
                <rect x="7" y="31" width="103" height="68.667" fill="#f4f6f3" stroke="#d9ded8" stroke-width=".45"/>
                <image href="${stoneAssetRoot}/stone-hero.png" x="7" y="31" width="103" height="68.667" preserveAspectRatio="xMidYMid meet"/>
                <g stroke-linecap="round" stroke-linejoin="round">
${callouts
  .map(([number, cy, elbowX, elbowY, targetX, targetY]) => {
    const line = `M13.55 ${cy} L${elbowX} ${elbowY} L${targetX} ${targetY}`;
    return `                  <g>
                    <path d="${line}" fill="none" stroke="#fff" stroke-width="1"/>
                    <path d="${line}" fill="none" stroke="#0b0d0b" stroke-width=".34"/>
                    <circle cx="${targetX}" cy="${targetY}" r=".65" fill="#fff" stroke="#0b0d0b" stroke-width=".34"/>
                    <circle cx="11.4" cy="${cy}" r="2.15" fill="#3e6b20" stroke="#fff" stroke-width=".35"/>
                    <text x="11.4" y="${(cy + 0.78).toFixed(2)}" text-anchor="middle" class="hero-number">${number}</text>
                  </g>`;
  })
  .join("\n")}
                </g>
              </svg>
            </figure>`;
};

const stonePage = (lang) => {
  const c = stoneCopy[lang];
  const slug = stoneSlugByLang[lang];
  const canonical = `${origin}/technical-library/${lang}/${slug}/`;
  const destinations = Object.fromEntries(
    langs.map((item) => [item, `/technical-library/${item}/${stoneSlugByLang[item]}/`]),
  );
  const libraryNames = {
    en: "Technical Library",
    es: "Biblioteca Técnica",
    de: "Technische Bibliothek",
  };
  const structuredData = `    <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: libraryNames[lang],
        item: `${origin}/technical-library/${lang}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: c.title,
        item: canonical,
      },
    ],
  }).replaceAll("<", "\\u003c")}</script>`;
  return `${documentHead({
    lang,
    title: c.metaTitle,
    description: c.metaDescription,
    canonical,
    suffix: `${slug}/`,
    type: "article",
    alt: c.heroAlt,
    alternates: stoneAlternateLinks(),
    ogImage: `${origin}${stoneAssetRoot}/stone-hero.png`,
    ogWidth: 1535,
    ogHeight: 1024,
    structuredData,
  })}
  <body class="roof-page stone-page">
    ${header(lang, "", destinations)}
    <main id="main">
      <section class="page-heading roof-shell">
        <p class="roof-eyebrow">${escapeHtml(c.eyebrow)}</p>
        <h1>${escapeHtml(c.title)}</h1>
        <p class="technical-subtitle">${escapeHtml(c.subtitle)}</p>
        <div class="heading-rule" aria-hidden="true"></div>
      </section>

      <div class="roof-shell content-flow">
        <section class="hero-overview" aria-label="${escapeHtml(c.overviewTitle)}">
          ${stoneHeroDiagram(lang)}
          <div class="stack">
            <article class="panel overview">
              ${sectionTitle(c.overviewTitle)}
              <p>${escapeHtml(c.overview)}</p>
            </article>
            <article class="panel">
              ${sectionTitle(c.whyTitle)}
              <ul class="why-list">
${c.why.map((item) => `                <li>${escapeHtml(item)}</li>`).join("\n")}
              </ul>
            </article>
          </div>
        </section>

        <section class="panel">
          ${sectionTitle(c.layersTitle)}
          <ol class="layer-grid">
${c.layers
  .map(
    ([title, body], index) => `            <li>
              <span class="number">${index + 1}</span>
              <div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div>
            </li>`,
  )
  .join("\n")}
          </ol>
        </section>

        <section class="panel">
          ${sectionTitle(c.principlesTitle)}
          ${iconCards(c.principles, "etics-principle-grid")}
        </section>

        <section class="panel">
          ${sectionTitle(c.componentsTitle)}
          <ol class="component-grid stone-component-grid" aria-label="${escapeHtml(c.componentsAlt)}">
${c.components
  .map(
    ([label, image], index) => `            <li>
              <div class="component-image">
                <img src="${stoneAssetRoot}/${image}" alt="${escapeHtml(label)}">
              </div>
              <span><b>${index + 1}.</b> ${escapeHtml(label)}</span>
            </li>`,
  )
  .join("\n")}
          </ol>
        </section>

        <div class="lower-grid">
          <aside class="panel compliance">
            ${sectionTitle(c.complianceTitle)}
            <p>${escapeHtml(c.compliance)}</p>
          </aside>
          <section class="panel">
            ${sectionTitle(c.benefitsTitle)}
            ${iconCards(c.benefits, "benefit-list")}
          </section>
        </div>

        <section class="panel stone-selection-panel">
          ${sectionTitle(c.stripTitle)}
          <img src="${stoneAssetRoot}/stone-veneer-strip.png" width="1464" height="280" alt="${escapeHtml(c.stripAlt)}">
          <p>${escapeHtml(c.stripNote)}</p>
        </section>

        <nav class="actions" aria-label="${escapeHtml(copy[lang].actionsLabel)}">
          <a class="button primary" href="/downloads/${stonePdfByLang[lang]}" download="${stonePdfByLang[lang]}">${escapeHtml(c.download)}</a>
          <a class="button secondary" href="/technical-library/${lang}/">${escapeHtml(copy[lang].backLibrary)}</a>
          <a class="button text-button" href="${origin}/">${escapeHtml(copy[lang].backHome)}</a>
        </nav>
      </div>
    </main>
    ${footer(lang)}
  </body>
</html>
`;
};

const landingPage = (lang) => {
  const c = copy[lang];
  const canonical = `${origin}/technical-library/${lang}/`;
  return `${documentHead({
    lang,
    title: `${c.landingTitle} | EcoViva Mallorca`,
    description: landingDescriptions[lang],
    canonical,
    suffix: "",
    alt: c.heroAlt,
  })}
  <body class="roof-page library-landing-page">
    ${header(lang)}
    <main id="main" class="roof-shell library-landing">
      <p class="roof-eyebrow">${escapeHtml(landingEyebrows[lang])}</p>
      <h1>${escapeHtml(c.landingTitle)}</h1>
      <p class="landing-intro">${escapeHtml(c.landingIntro)}</p>
      <section class="library-grid" aria-label="${escapeHtml(c.landingTitle)}">
        <a class="library-card" href="/technical-library/${lang}/${roofSlug}/">
          <img src="${assetRoot}/tejo-roof-hero.png" width="1536" height="1024" alt="${escapeHtml(c.heroAlt)}">
          <span>
            <strong>${escapeHtml(c.title)}</strong>
            <small>${escapeHtml(c.openSheet)} <span aria-hidden="true">→</span></small>
          </span>
        </a>
        <a class="library-card" href="/technical-library/${lang}/${eticsSlugByLang[lang]}/">
          <img src="${eticsAssetRoot}/crepi-hero.png" width="1535" height="1024" alt="${escapeHtml(eticsCopy[lang].heroAlt)}">
          <span>
            <strong>${escapeHtml(eticsCopy[lang].title)}</strong>
            <small>${escapeHtml(c.openSheet)} <span aria-hidden="true">→</span></small>
          </span>
        </a>
        <a class="library-card" href="/technical-library/${lang}/${stoneSlugByLang[lang]}/">
          <img src="${stoneAssetRoot}/stone-hero.png" width="1535" height="1024" alt="${escapeHtml(stoneCopy[lang].heroAlt)}">
          <span>
            <strong>${escapeHtml(stoneCopy[lang].title)}</strong>
            <small>${escapeHtml(c.openSheet)} <span aria-hidden="true">→</span></small>
          </span>
        </a>
      </section>
      <nav class="landing-links" aria-label="${escapeHtml(c.actionsLabel)}">
        <a href="${origin}/">${escapeHtml(c.backHome)}</a>
        <a href="/technical-library/start/">${escapeHtml(
          lang === "en" ? "Choose another language" : lang === "es" ? "Elegir otro idioma" : "Andere Sprache wählen",
        )}</a>
      </nav>
    </main>
    ${footer(lang)}
  </body>
</html>
`;
};

for (const lang of langs) {
  const landingPath = join(root, "public", "technical-library", lang, "index.html");
  const roofPath = join(root, "public", "technical-library", lang, roofSlug, "index.html");
  const eticsPath = join(
    root,
    "public",
    "technical-library",
    lang,
    eticsSlugByLang[lang],
    "index.html",
  );
  const stonePath = join(
    root,
    "public",
    "technical-library",
    lang,
    stoneSlugByLang[lang],
    "index.html",
  );
  await mkdir(dirname(landingPath), { recursive: true });
  await mkdir(dirname(roofPath), { recursive: true });
  await mkdir(dirname(eticsPath), { recursive: true });
  await mkdir(dirname(stonePath), { recursive: true });
  await writeFile(landingPath, landingPage(lang), "utf8");
  await writeFile(roofPath, roofPage(lang), "utf8");
  await writeFile(eticsPath, eticsPage(lang), "utf8");
  await writeFile(stonePath, stonePage(lang), "utf8");
}

console.log(
  `Generated ${langs.length} Technical Library landing pages and ${langs.length} pages for each of roof, ETICS and Natural Stone.`,
);
