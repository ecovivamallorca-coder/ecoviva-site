import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { copy, langs, pdfByLang, privacyByLang } from "./technical-library-content.mjs";
import { eticsCopy, eticsPdfByLang, eticsSlugByLang } from "./technical-library-etics-content.mjs";
import {
  stoneCopy,
  stonePdfByLang,
  stoneSelections,
  stoneSlugByLang,
} from "./technical-library-natural-stone-content.mjs";
import {
  thermowoodAgeingImages,
  thermowoodComponentImages,
  thermowoodCopy,
  thermowoodDesignImages,
  thermowoodDownloadPdfByLang,
  thermowoodPrintPdfByLang,
  thermowoodSlugByLang,
} from "./technical-library-thermowood-content.mjs";
import {
  universalComponentImages,
  universalCopy,
  universalDownloadPdfByLang,
  universalMaterialImages,
  universalPrintPdfByLang,
  universalSlugByLang,
} from "./technical-library-universal-facade-content.mjs";
import {
  flatRoofComponentImages,
  flatRoofCopy,
  flatRoofDownloadPdfByLang,
  flatRoofOptionImages,
  flatRoofPrintPdfByLang,
  flatRoofSlugByLang,
} from "./technical-library-flat-roof-content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://www.ecoviva-mallorca.com";
const assetRoot = "/assets/technical-library";
const eticsAssetRoot = `${assetRoot}/etics`;
const stoneAssetRoot = `${assetRoot}/natural-stone`;
const thermowoodAssetRoot = `${assetRoot}/thermowood`;
const universalAssetRoot = `${assetRoot}/universal-ventilated-facade`;
const flatRoofAssetRoot = `${assetRoot}/universal-insulated-flat-roof`;
const thermowoodGeometry = JSON.parse(
  readFileSync(join(root, "scripts", "thermowood-geometry.json"), "utf8"),
);
const universalGeometry = JSON.parse(
  readFileSync(join(root, "scripts", "universal-facade-geometry.json"), "utf8"),
);
const flatRoofGeometry = JSON.parse(
  readFileSync(join(root, "scripts", "flat-roof-geometry.json"), "utf8"),
);
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

const thermowoodAlternateLinks = () =>
  langs
    .map(
      (lang) =>
        `    <link rel="alternate" hreflang="${lang}" href="${origin}/technical-library/${lang}/${thermowoodSlugByLang[lang]}/">`,
    )
    .concat(
      `    <link rel="alternate" hreflang="x-default" href="${origin}/technical-library/en/${thermowoodSlugByLang.en}/">`,
    )
    .join("\n");

const universalAlternateLinks = () =>
  langs
    .map(
      (lang) =>
        `    <link rel="alternate" hreflang="${lang}" href="${origin}/technical-library/${lang}/${universalSlugByLang[lang]}/">`,
    )
    .concat(
      `    <link rel="alternate" hreflang="x-default" href="${origin}/technical-library/en/${universalSlugByLang.en}/">`,
    )
    .join("\n");

const flatRoofAlternateLinks = () =>
  langs
    .map(
      (lang) =>
        `    <link rel="alternate" hreflang="${lang}" href="${origin}/technical-library/${lang}/${flatRoofSlugByLang[lang]}/">`,
    )
    .concat(
      `    <link rel="alternate" hreflang="x-default" href="${origin}/technical-library/en/${flatRoofSlugByLang.en}/">`,
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
  extraStylesheet = "",
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
    <link rel="stylesheet" href="/assets/technical-roof.css">${extraStylesheet ? `\n    <link rel="stylesheet" href="${extraStylesheet}">` : ""}
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

        <nav class="tl-actions" aria-label="${escapeHtml(c.actionsLabel)}">
          <a class="tl-button tl-button--primary" href="/downloads/${pdfByLang[lang]}" download="${pdfByLang[lang]}">${escapeHtml(c.download)}</a>
          <a class="tl-button tl-button--secondary" href="/technical-library/${lang}/">${escapeHtml(c.backLibrary)}</a>
          <a class="tl-button tl-button--secondary" href="${origin}/">${escapeHtml(c.backHome)}</a>
        </nav>
      </div>
    </main>
    ${footer(lang)}
  </body>
</html>
`;
};

const eticsHeroGeometry = {
  viewBox: "7 31 103 68.667",
  callouts: [
    [1, 36.3, 16, 39, 20, 44],
    [2, 44, 16.5, 46, 38, 51],
    [3, 51.7, 17, 54, 50.5, 57],
    [4, 59.4, 17.5, 62, 56, 68.5],
    [5, 67.1, 18, 68.7, 60, 70.8],
    [6, 74.8, 18.5, 75.8, 66.5, 77.2],
    [7, 82.5, 19, 82.5, 70.5, 82.8],
    [8, 90.2, 19.5, 90, 92, 87.5],
  ],
};

const eticsHeroDiagram = (lang) => {
  const c = eticsCopy[lang];
  return `<figure class="hero-diagram etics-hero-diagram" data-coordinate-system="image-relative-svg">
              <svg viewBox="${eticsHeroGeometry.viewBox}" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="etics-hero-title-${lang}">
                <title id="etics-hero-title-${lang}">${escapeHtml(c.heroAlt)}</title>
                <rect x="7" y="31" width="103" height="68.667" fill="#f4f6f3" stroke="#d9ded8" stroke-width=".45"/>
                <image href="${eticsAssetRoot}/crepi-hero.png" x="7" y="31" width="103" height="68.667" preserveAspectRatio="xMidYMid meet"/>
                <g stroke-linecap="round" stroke-linejoin="round">
${eticsHeroGeometry.callouts
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

        <section class="panel" id="etics-components">
          ${sectionTitle(c.componentsTitle)}
          <p>${escapeHtml(c.componentsIntro)}</p>
          <ol class="component-grid">
${c.components
  .map(
    ([label, image], index) => `            <li>
              <div class="component-image component-image-${index + 1}">
                <img src="${eticsAssetRoot}/${image}?v=20260726-final-visual" width="1200" height="900" alt="${escapeHtml(label)}">
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

        <nav class="tl-actions" aria-label="${escapeHtml(copy[lang].actionsLabel)}">
          <a class="tl-button tl-button--primary" href="/downloads/${eticsPdfByLang[lang]}" download="${eticsPdfByLang[lang]}">${escapeHtml(c.download)}</a>
          <a class="tl-button tl-button--secondary" href="/technical-library/${lang}/">${escapeHtml(copy[lang].backLibrary)}</a>
          <a class="tl-button tl-button--secondary" href="${origin}/">${escapeHtml(copy[lang].backHome)}</a>
        </nav>
      </div>
    </main>
    ${footer(lang)}
  </body>
</html>
`;
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
    ogImage: `${origin}${stoneAssetRoot}/natural-stone-hero-v1-2.png`,
    ogWidth: 1860,
    ogHeight: 1100,
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
          <figure class="hero-diagram stone-hero-diagram">
            <img src="${stoneAssetRoot}/natural-stone-hero-v1-2.png" width="1860" height="1100" alt="${escapeHtml(c.heroAlt)}">
          </figure>
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
          <div class="stone-selection-grid" aria-label="${escapeHtml(c.stripAlt)}">
${stoneSelections
  .map(
    ([name, image]) => `            <figure>
              <img src="${stoneAssetRoot}/${image}" width="1024" height="768" alt="${escapeHtml(name)} natural stone veneer texture">
              <figcaption>${escapeHtml(name)}</figcaption>
            </figure>`,
  )
  .join("\n")}
          </div>
          <p>${escapeHtml(c.stripNote)}</p>
        </section>

        <nav class="tl-actions" aria-label="${escapeHtml(copy[lang].actionsLabel)}">
          <a class="tl-button tl-button--primary" href="/downloads/${stonePdfByLang[lang]}" download="${stonePdfByLang[lang]}">${escapeHtml(c.download)}</a>
          <a class="tl-button tl-button--secondary" href="/technical-library/${lang}/">${escapeHtml(copy[lang].backLibrary)}</a>
          <a class="tl-button tl-button--secondary" href="${origin}/">${escapeHtml(copy[lang].backHome)}</a>
        </nav>
      </div>
    </main>
    ${footer(lang)}
  </body>
</html>
`;
};

const airflowArrowSvg = (centerX, tipY) => {
  const scale = thermowoodGeometry.hero.airflowArrows.overlayScale;
  const { headOpacity, middleOpacity, tailOpacity } =
    thermowoodGeometry.hero.airflowArrows;
  const p = (value) => Number(value.toFixed(3));
  return `                <g fill="#3e6b20">
                  <path opacity="${headOpacity}" d="M${centerX} ${tipY} L${p(centerX - 1.8 * scale)} ${p(tipY + 2 * scale)} L${p(centerX - 0.62 * scale)} ${p(tipY + 2 * scale)} L${p(centerX - 0.62 * scale)} ${p(tipY + 3.2 * scale)} L${p(centerX + 0.62 * scale)} ${p(tipY + 3.2 * scale)} L${p(centerX + 0.62 * scale)} ${p(tipY + 2 * scale)} L${p(centerX + 1.8 * scale)} ${p(tipY + 2 * scale)} Z"/>
                  <rect opacity="${middleOpacity}" x="${p(centerX - 0.52 * scale)}" y="${p(tipY + 3.15 * scale)}" width="${p(1.04 * scale)}" height="${p(1.35 * scale)}"/>
                  <rect opacity="${tailOpacity}" x="${p(centerX - 0.4 * scale)}" y="${p(tipY + 4.45 * scale)}" width="${p(0.8 * scale)}" height="${p(1.15 * scale)}"/>
                </g>`;
};

const thermowoodHeroDiagram = (lang, c) => {
  const calloutMarkup = thermowoodGeometry.hero.callouts
    .map(({ number, circle, path, endpoint }) => {
      const points = path.map(([x, y]) => `${x},${y}`).join(" ");
      return `                <g>
                  <polyline points="${points}" fill="none" stroke="#244c1b" stroke-width="${thermowoodGeometry.hero.lineWidth}" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="${endpoint[0]}" cy="${endpoint[1]}" r="${thermowoodGeometry.hero.endpointRadius}" fill="#fff" stroke="#244c1b" stroke-width=".3"/>
                  <circle cx="${circle[0]}" cy="${circle[1]}" r="${thermowoodGeometry.hero.circleRadius}" fill="#3e6b20"/>
                  <text x="${circle[0]}" y="${(circle[1] + 0.78).toFixed(2)}" text-anchor="middle" class="hero-number">${number}</text>
                </g>`;
    })
    .join("\n");
  const arrows = [
    [54.5, 85],
    [63.3, 83.8],
    [71.8, 82.8],
    [82.7, 80.8],
  ]
    .map(([x, y]) => airflowArrowSvg(x, y))
    .join("\n");
  const endpoints = thermowoodGeometry.hero.callouts
    .map(({ endpoint }) => endpoint.join(","))
    .join(";");
  const calloutSummary = c.layers
    .map(([title], index) => `${index + 1}. ${title}`)
    .join("; ");

  return `<figure
            class="hero-diagram thermowood-hero-diagram"
            data-coordinate-system="image-relative-svg"
            data-callout-count="5"
            data-leader-line-count="5"
            data-lower-airflow-arrows="4"
            data-upper-airflow-arrows="0"
            data-callout-endpoints="${endpoints}"
          >
            <svg viewBox="7 35 105 60" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="thermowood-hero-title-${lang}">
              <title id="thermowood-hero-title-${lang}">${escapeHtml(c.heroAlt)}</title>
              <defs>
                <clipPath id="thermowood-hero-clip-${lang}">
                  <rect x="7" y="35" width="105" height="60" rx="1.5"/>
                </clipPath>
              </defs>
              <g clip-path="url(#thermowood-hero-clip-${lang})">
                <rect x="7" y="35" width="105" height="60" fill="#fff"/>
                <svg x="24.725" y="35.075" width="69.55" height="59.85" viewBox="0 0 1190 1024" preserveAspectRatio="none" overflow="hidden">
                  <image href="${thermowoodAssetRoot}/thermowood-overview-hero-v1.png" x="0" y="0" width="1535" height="1024" preserveAspectRatio="none"/>
                </svg>
${arrows}
${calloutMarkup}
              </g>
              <rect x="7.24" y="35.24" width="104.52" height="59.52" rx="1.5" fill="none" stroke="#3e6b20" stroke-width=".48"/>
            </svg>
            <figcaption class="sr-only">${escapeHtml(calloutSummary)}</figcaption>
          </figure>`;
};

const thermowoodPage = (lang) => {
  const c = thermowoodCopy[lang];
  const slug = thermowoodSlugByLang[lang];
  const canonical = `${origin}/technical-library/${lang}/${slug}/`;
  const destinations = Object.fromEntries(
    langs.map((item) => [item, `/technical-library/${item}/${thermowoodSlugByLang[item]}/`]),
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
        name: c.cardTitle,
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
    alternates: thermowoodAlternateLinks(),
    ogImage: `${origin}${thermowoodAssetRoot}/thermowood-overview-hero-v1.png`,
    ogWidth: 1535,
    ogHeight: 1024,
    structuredData,
  })}
  <body class="roof-page thermowood-page">
    ${header(lang, "", destinations)}
    <main id="main">
      <section class="page-heading roof-shell">
        <p class="roof-eyebrow">${escapeHtml(c.library)}</p>
        <h1>${escapeHtml(c.title)}</h1>
        <p class="technical-subtitle">${escapeHtml(c.subtitle)}</p>
        <div class="heading-rule" aria-hidden="true"></div>
      </section>

      <div class="roof-shell content-flow">
        <section class="hero-overview" aria-label="${escapeHtml(c.overviewTitle)}">
          ${thermowoodHeroDiagram(lang, c)}
          <div class="stack">
            <article class="panel overview">
              ${sectionTitle(c.overviewTitle)}
              <p>${escapeHtml(c.overview)}</p>
              <p class="technical-note"><em>${escapeHtml(c.overviewNote)}</em></p>
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
          <div class="thermowood-principle-grid">
${c.principles
  .map(
    ([title, body]) => `            <article class="thermowood-principle">
              <span aria-hidden="true">✓</span>
              <div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div>
            </article>`,
  )
  .join("\n")}
          </div>
        </section>

        <section class="panel">
          ${sectionTitle(c.componentsTitle)}
          <ul class="thermowood-component-grid" aria-label="${escapeHtml(c.componentsTitle)}" data-divider-count="5" data-numbering="none">
${c.components
  .map(
    ([title, body], index) => `            <li>
              <div class="thermowood-component-image">
                <img src="${thermowoodAssetRoot}/${thermowoodComponentImages[index]}" alt="${escapeHtml(title)}">
              </div>
              <h3>${escapeHtml(title)}</h3>
              <p>${escapeHtml(body)}</p>
            </li>`,
  )
  .join("\n")}
          </ul>
        </section>

        <section class="panel">
          ${sectionTitle(c.designOptionsTitle)}
          <div class="thermowood-design-grid" data-numbering="none">
${c.designOptions
  .map(
    ([title, body], index) => `            <figure>
              <img src="${thermowoodAssetRoot}/${thermowoodDesignImages[index]}" alt="">
              <figcaption><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></figcaption>
            </figure>`,
  )
  .join("\n")}
          </div>
        </section>

        <section class="panel thermowood-lower-grid">
          <div>
            ${sectionTitle(c.benefitsTitle)}
            <ul class="thermowood-bullet-list">
${c.benefits.map((item) => `              <li>${escapeHtml(item)}</li>`).join("\n")}
            </ul>
          </div>
          <div>
            ${sectionTitle(c.applicationsTitle)}
            <ul class="thermowood-bullet-list">
${c.applications.map((item) => `              <li>${escapeHtml(item)}</li>`).join("\n")}
            </ul>
          </div>
          <div>
            ${sectionTitle(c.ageingTitle)}
            <div class="thermowood-ageing-grid">
${c.ageingStages
  .map(
    (label, index) => `              <figure>
                <img src="${thermowoodAssetRoot}/${thermowoodAgeingImages[index]}" alt="">
                <figcaption>${escapeHtml(label)}</figcaption>
              </figure>`,
  )
  .join("\n")}
            </div>
            <p>${escapeHtml(c.ageingNote)}</p>
          </div>
        </section>

        <aside class="panel compliance">
          ${sectionTitle(c.requirementsTitle)}
          <p>${escapeHtml(c.requirements)}</p>
        </aside>

        <nav class="tl-actions" aria-label="${escapeHtml(copy[lang].actionsLabel)}">
          <a class="tl-button tl-button--primary" href="/downloads/${thermowoodDownloadPdfByLang[lang]}" download="${thermowoodDownloadPdfByLang[lang]}">${escapeHtml(c.download)}</a>
          <a class="tl-button tl-button--secondary" href="/downloads/${thermowoodPrintPdfByLang[lang]}" target="_blank" rel="noopener">${escapeHtml(c.print)}</a>
          <a class="tl-button tl-button--secondary" href="/technical-library/${lang}/">${escapeHtml(c.backLibrary)}</a>
          <a class="tl-button tl-button--secondary" href="${origin}/">${escapeHtml(c.backHome)}</a>
        </nav>
      </div>
    </main>
    ${footer(lang)}
  </body>
</html>
`;
};

const universalHeroDiagram = (lang, c) => {
  const calloutMarkup = universalGeometry.hero.callouts
    .map(({ number, circle, path, endpoint }) => {
      const points = path.map(([x, y]) => `${x},${y}`).join(" ");
      return `                <g class="universal-callout">
                  <polyline points="${points}" fill="none" stroke="#0b0d0b" stroke-width=".82" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="${points}" fill="none" stroke="#fff" stroke-width=".38" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="${endpoint[0]}" cy="${endpoint[1]}" r=".72" fill="#fff" stroke="#0b0d0b" stroke-width=".34"/>
                  <circle cx="${circle[0]}" cy="${circle[1]}" r="2.15" fill="#3e6b20"/>
                  <text x="${circle[0]}" y="${(circle[1] + 0.78).toFixed(2)}" text-anchor="middle" class="hero-number">${number}</text>
                </g>`;
    })
    .join("\n");
  const endpoints = universalGeometry.hero.callouts
    .map(({ endpoint }) => endpoint.join(","))
    .join(";");
  const calloutSummary = c.layers
    .map(([title], index) => `${index + 1}. ${title}`)
    .join("; ");
  const image = universalGeometry.hero.image;

  return `<figure
            class="hero-diagram universal-hero-diagram"
            data-coordinate-system="image-relative-svg"
            data-callout-count="5"
            data-leader-line-count="5"
            data-callout-endpoints="${endpoints}"
          >
            <svg viewBox="7 35 105 52" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="universal-hero-title-${lang}">
              <title id="universal-hero-title-${lang}">${escapeHtml(c.heroAlt)}</title>
              <defs>
                <clipPath id="universal-hero-clip-${lang}">
                  <rect x="7" y="35" width="105" height="52" rx="1.5"/>
                </clipPath>
              </defs>
              <g clip-path="url(#universal-hero-clip-${lang})">
                <rect x="7" y="35" width="105" height="52" fill="#fff"/>
                <svg x="${image.x}" y="${image.y}" width="${image.width}" height="${image.height}" viewBox="0 0 ${image.cropWidth} ${image.cropHeight}" preserveAspectRatio="none" overflow="hidden">
                  <image href="${universalAssetRoot}/universal-facade-hero.png" x="0" y="0" width="1535" height="1024" preserveAspectRatio="none"/>
                </svg>
${calloutMarkup}
              </g>
              <rect x="7.24" y="35.24" width="104.52" height="51.52" rx="1.5" fill="none" stroke="#3e6b20" stroke-width=".48"/>
            </svg>
            <figcaption class="sr-only">${escapeHtml(calloutSummary)}</figcaption>
          </figure>`;
};

const universalPage = (lang) => {
  const c = universalCopy[lang];
  const slug = universalSlugByLang[lang];
  const canonical = `${origin}/technical-library/${lang}/${slug}/`;
  const destinations = Object.fromEntries(
    langs.map((item) => [item, `/technical-library/${item}/${universalSlugByLang[item]}/`]),
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
        name: c.cardTitle,
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
    alt: c.cleanHeroAlt,
    alternates: universalAlternateLinks(),
    ogImage: `${origin}${universalAssetRoot}/universal-facade-hero.png`,
    ogWidth: 1535,
    ogHeight: 1024,
    structuredData,
  })}
  <body class="roof-page thermowood-page universal-facade-page">
    ${header(lang, "", destinations)}
    <main id="main">
      <section class="page-heading roof-shell">
        <p class="roof-eyebrow">${escapeHtml(c.library)}</p>
        <h1>${escapeHtml(c.title)}</h1>
        <p class="technical-subtitle">${escapeHtml(c.subtitle)}</p>
        <div class="heading-rule" aria-hidden="true"></div>
      </section>

      <div class="roof-shell content-flow">
        <section class="hero-overview" aria-label="${escapeHtml(c.overviewTitle)}">
          ${universalHeroDiagram(lang, c)}
          <div class="stack">
            <article class="panel overview">
              ${sectionTitle(c.overviewTitle)}
              <p>${escapeHtml(c.overview)}</p>
              <p class="technical-note"><em>${escapeHtml(c.overviewNote)}</em></p>
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
          <div class="thermowood-principle-grid">
${c.principles
  .map(
    ([title, body]) => `            <article class="thermowood-principle">
              <span aria-hidden="true">✓</span>
              <div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div>
            </article>`,
  )
  .join("\n")}
          </div>
        </section>

        <section class="panel">
          ${sectionTitle(c.componentsTitle)}
          <p class="universal-section-intro">${escapeHtml(c.componentsIntro)}</p>
          <ol class="component-grid universal-component-grid">
${c.components
  .map(
    ([title, body], index) => `            <li>
              <div class="component-image">
                <img src="${universalAssetRoot}/${universalComponentImages[index]}" alt="${escapeHtml(title)}">
              </div>
              <span><b>${index + 1}.</b> ${escapeHtml(title)}</span>
              <small>${escapeHtml(body)}</small>
            </li>`,
  )
  .join("\n")}
          </ol>
        </section>

        <section class="panel">
          ${sectionTitle(c.materialsTitle)}
          <p class="universal-section-intro">${escapeHtml(c.materialsIntro)}</p>
          <div class="universal-material-grid">
${c.materials
  .map(
    ([title, body], index) => `            <article class="universal-material-card">
              <img src="${universalAssetRoot}/${universalMaterialImages[index]}" width="1400" height="706" alt="${escapeHtml(title)}">
              <div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div>
            </article>`,
  )
  .join("\n")}
          </div>
        </section>

        <section class="panel thermowood-lower-grid">
          <div>
            ${sectionTitle(c.benefitsTitle)}
            <ul class="thermowood-bullet-list">
${c.benefits.map((item) => `              <li>${escapeHtml(item)}</li>`).join("\n")}
            </ul>
          </div>
          <div>
            ${sectionTitle(c.applicationsTitle)}
            <ul class="thermowood-bullet-list">
${c.applications.map((item) => `              <li>${escapeHtml(item)}</li>`).join("\n")}
            </ul>
          </div>
          <div>
            ${sectionTitle(c.appearanceTitle)}
            <p>${escapeHtml(c.appearance)}</p>
          </div>
        </section>

        <aside class="panel compliance">
          ${sectionTitle(c.requirementsTitle)}
          <p>${escapeHtml(c.requirements)}</p>
        </aside>

        <nav class="tl-actions" aria-label="${escapeHtml(copy[lang].actionsLabel)}">
          <a class="tl-button tl-button--primary" href="/downloads/${universalDownloadPdfByLang[lang]}" download="${universalDownloadPdfByLang[lang]}">${escapeHtml(c.download)}</a>
          <a class="tl-button tl-button--secondary" href="/downloads/${universalPrintPdfByLang[lang]}" target="_blank" rel="noopener">${escapeHtml(c.print)}</a>
          <a class="tl-button tl-button--secondary" href="/technical-library/${lang}/">${escapeHtml(c.backLibrary)}</a>
          <a class="tl-button tl-button--secondary" href="${origin}/">${escapeHtml(c.backHome)}</a>
        </nav>
      </div>
    </main>
    ${footer(lang)}
  </body>
</html>
`;
};

const flatRoofHeroDiagram = (lang, c) => {
  const calloutMarkup = flatRoofGeometry.hero.callouts
    .map(({ number, circle, path, endpoint }) => {
      const points = path.map(([x, y]) => `${x},${y}`).join(" ");
      return `                <g class="flat-roof-callout">
                  <polyline points="${points}" fill="none" stroke="#0b0d0b" stroke-width=".82" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="${points}" fill="none" stroke="#fff" stroke-width=".38" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="${endpoint[0]}" cy="${endpoint[1]}" r=".68" fill="#fff" stroke="#0b0d0b" stroke-width=".34"/>
                  <circle cx="${circle[0]}" cy="${circle[1]}" r="2.15" fill="#3e6b20"/>
                  <text x="${circle[0]}" y="${(circle[1] + 0.78).toFixed(2)}" text-anchor="middle" class="hero-number">${number}</text>
                </g>`;
    })
    .join("\n");
  const endpoints = flatRoofGeometry.hero.callouts
    .map(({ endpoint }) => endpoint.join(","))
    .join(";");
  const image = flatRoofGeometry.hero.image;
  const heroLabels = [c.layers[4][0], c.layers[3][0], c.layers[2][0], c.layers[1][0], c.layers[0][0]];

  return `<figure
            class="hero-diagram thermowood-hero-diagram flat-roof-hero-diagram"
            data-coordinate-system="image-relative-svg"
            data-callout-count="5"
            data-leader-line-count="5"
            data-callout-endpoints="${endpoints}"
          >
            <svg viewBox="7 35 105 60" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="flat-roof-hero-title-${lang}">
              <title id="flat-roof-hero-title-${lang}">${escapeHtml(c.heroAlt)}</title>
              <defs><clipPath id="flat-roof-hero-clip-${lang}"><rect x="7" y="35" width="105" height="60" rx="1.5"/></clipPath></defs>
              <g clip-path="url(#flat-roof-hero-clip-${lang})">
                <rect x="7" y="35" width="105" height="60" fill="#fff"/>
                <svg x="${image.x}" y="${image.y}" width="${image.width}" height="${image.height}" viewBox="0 0 ${image.cropWidth} ${image.cropHeight}" preserveAspectRatio="xMidYMid meet" overflow="hidden">
                  <image href="${flatRoofAssetRoot}/flat-roof-hero.png" x="0" y="0" width="${image.cropWidth}" height="${image.cropHeight}" preserveAspectRatio="xMidYMid meet"/>
                </svg>
${calloutMarkup}
              </g>
              <rect x="7.24" y="35.24" width="104.52" height="59.52" rx="1.5" fill="none" stroke="#3e6b20" stroke-width=".48"/>
            </svg>
            <figcaption class="sr-only">${escapeHtml(heroLabels.map((title, index) => `${index + 1}. ${title}`).join("; "))}</figcaption>
          </figure>`;
};

const flatRoofPage = (lang) => {
  const c = flatRoofCopy[lang];
  const slug = flatRoofSlugByLang[lang];
  const canonical = `${origin}/technical-library/${lang}/${slug}/`;
  const destinations = Object.fromEntries(
    langs.map((item) => [item, `/technical-library/${item}/${flatRoofSlugByLang[item]}/`]),
  );
  const structuredData = `    <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: c.cardTitle,
    description: c.metaDescription,
    inLanguage: lang,
    url: canonical,
    publisher: { "@type": "Organization", name: "EcoViva Mallorca S.L." },
  }).replaceAll("<", "\\u003c")}</script>`;
  return `${documentHead({
    lang,
    title: c.metaTitle,
    description: c.metaDescription,
    canonical,
    suffix: `${slug}/`,
    type: "article",
    alt: c.cleanHeroAlt,
    alternates: flatRoofAlternateLinks(),
    ogImage: `${origin}${flatRoofAssetRoot}/flat-roof-hero.png`,
    ogWidth: 1536,
    ogHeight: 1024,
    structuredData,
    extraStylesheet: "/assets/technical-flat-roof.css",
  })}
  <body class="roof-page thermowood-page flat-roof-page">
    ${header(lang, "", destinations)}
    <main id="main">
      <section class="page-heading roof-shell">
        <p class="roof-eyebrow">${escapeHtml(c.library)}</p>
        <h1>${escapeHtml(c.title)}</h1>
        <p class="technical-subtitle">${escapeHtml(c.subtitle)}</p>
        <div class="heading-rule" aria-hidden="true"></div>
      </section>
      <div class="roof-shell content-flow">
        <section class="hero-overview" aria-label="${escapeHtml(c.overviewTitle)}">
          ${flatRoofHeroDiagram(lang, c)}
          <div class="stack">
            <article class="panel overview">${sectionTitle(c.overviewTitle)}<p>${escapeHtml(c.overview)}</p><p class="technical-note"><em>${escapeHtml(c.overviewNote)}</em></p></article>
            <article class="panel">${sectionTitle(c.whyTitle)}<ul class="why-list">${c.why.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
          </div>
        </section>
        <section class="panel">${sectionTitle(c.layersTitle)}
          <ol class="layer-grid">${c.layers.map(([title, body], index) => `<li><span class="number">${index + 1}</span><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div></li>`).join("")}</ol>
        </section>
        <section class="panel">${sectionTitle(c.principlesTitle)}
          <div class="thermowood-principle-grid">${c.principles.map(([title, body]) => `<article class="thermowood-principle"><span aria-hidden="true">✓</span><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div></article>`).join("")}</div>
        </section>
        <section class="panel" id="components">${sectionTitle(c.componentsTitle)}
          <p class="flat-roof-section-intro">${escapeHtml(c.componentsIntro)}</p>
          <ul class="flat-roof-component-grid" aria-label="${escapeHtml(c.componentsTitle)}">${c.components.map(([title, body], index) => `<li><div class="flat-roof-component-image"><img src="${flatRoofAssetRoot}/${flatRoofComponentImages[index]}" alt="${escapeHtml(title)}"></div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></li>`).join("")}</ul>
        </section>
        <section class="panel" id="waterproofing-options">${sectionTitle(c.optionsTitle)}
          <p class="flat-roof-section-intro">${escapeHtml(c.optionsIntro)}</p>
          <div class="flat-roof-options-grid">${c.options.map(([title, body, tag], index) => `<figure class="flat-roof-option-card"><img src="${flatRoofAssetRoot}/${flatRoofOptionImages[index]}" alt="${escapeHtml(title)}"><figcaption><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span>${tag ? `<span class="reference-tag">${escapeHtml(tag)}</span>` : ""}</figcaption></figure>`).join("")}</div>
        </section>
        <section class="panel thermowood-lower-grid">
          <div>${sectionTitle(c.benefitsTitle)}<ul class="thermowood-bullet-list">${c.benefits.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
          <div>${sectionTitle(c.applicationsTitle)}<ul class="thermowood-bullet-list">${c.applications.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
          <div>${sectionTitle(c.serviceLifeTitle)}<p>${escapeHtml(c.serviceLife)}</p></div>
        </section>
        <aside class="panel compliance">${sectionTitle(c.requirementsTitle)}<ul class="flat-roof-requirements">${c.requirements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></aside>
        <nav class="tl-actions" aria-label="${escapeHtml(copy[lang].actionsLabel)}">
          <a class="tl-button tl-button--primary" href="/downloads/${flatRoofDownloadPdfByLang[lang]}" download="${flatRoofDownloadPdfByLang[lang]}">${escapeHtml(c.download)}</a>
          <a class="tl-button tl-button--secondary" href="/downloads/${flatRoofPrintPdfByLang[lang]}" target="_blank" rel="noopener">${escapeHtml(c.print)}</a>
          <a class="tl-button tl-button--secondary" href="/technical-library/${lang}/">${escapeHtml(c.backLibrary)}</a>
          <a class="tl-button tl-button--secondary" href="${origin}/">${escapeHtml(c.backHome)}</a>
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
        <a class="library-card library-card--natural-stone" href="/technical-library/${lang}/${stoneSlugByLang[lang]}/">
          <img src="${stoneAssetRoot}/natural-stone-overview-hero-v1-2.png" width="1535" height="1024" alt="${escapeHtml(stoneCopy[lang].heroAlt)}">
          <span>
            <strong>${escapeHtml(stoneCopy[lang].title)}</strong>
            <small>${escapeHtml(c.openSheet)} <span aria-hidden="true">→</span></small>
          </span>
        </a>
        <a class="library-card library-card--thermowood" href="/technical-library/${lang}/${thermowoodSlugByLang[lang]}/">
          <img src="${thermowoodAssetRoot}/thermowood-overview-hero-v1.png" width="1535" height="1024" alt="${escapeHtml(thermowoodCopy[lang].cleanHeroAlt)}">
          <span>
            <strong>${escapeHtml(thermowoodCopy[lang].cardTitle)}</strong>
            <small>${escapeHtml(c.openSheet)} <span aria-hidden="true">→</span></small>
          </span>
        </a>
        <a class="library-card library-card--universal-facade" href="/technical-library/${lang}/${universalSlugByLang[lang]}/">
          <img src="${universalAssetRoot}/universal-facade-hero.png" width="1535" height="1024" alt="${escapeHtml(universalCopy[lang].cleanHeroAlt)}">
          <span>
            <strong>${escapeHtml(universalCopy[lang].cardTitle)}</strong>
            <small>${escapeHtml(c.openSheet)} <span aria-hidden="true">→</span></small>
          </span>
        </a>
        <a class="library-card library-card--universal-facade library-card--flat-roof" href="/technical-library/${lang}/${flatRoofSlugByLang[lang]}/">
          <img src="${flatRoofAssetRoot}/flat-roof-hero.png" width="1536" height="1024" alt="${escapeHtml(flatRoofCopy[lang].cleanHeroAlt)}">
          <span>
            <strong>${escapeHtml(flatRoofCopy[lang].cardTitle)}</strong>
            <small>${escapeHtml(c.openSheet)} <span aria-hidden="true">→</span></small>
          </span>
        </a>
      </section>
      <nav class="tl-actions tl-actions--landing" aria-label="${escapeHtml(c.actionsLabel)}">
        <a class="tl-button tl-button--secondary" href="${origin}/">${escapeHtml(c.backHome)}</a>
        <a class="tl-button tl-button--secondary" href="/technical-library/start/">${escapeHtml(
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
  const thermowoodPath = join(
    root,
    "public",
    "technical-library",
    lang,
    thermowoodSlugByLang[lang],
    "index.html",
  );
  const universalPath = join(
    root,
    "public",
    "technical-library",
    lang,
    universalSlugByLang[lang],
    "index.html",
  );
  const flatRoofPath = join(
    root,
    "public",
    "technical-library",
    lang,
    flatRoofSlugByLang[lang],
    "index.html",
  );
  await mkdir(dirname(landingPath), { recursive: true });
  await mkdir(dirname(roofPath), { recursive: true });
  await mkdir(dirname(eticsPath), { recursive: true });
  await mkdir(dirname(stonePath), { recursive: true });
  await mkdir(dirname(thermowoodPath), { recursive: true });
  await mkdir(dirname(universalPath), { recursive: true });
  await mkdir(dirname(flatRoofPath), { recursive: true });
  await writeFile(landingPath, landingPage(lang), "utf8");
  await writeFile(roofPath, roofPage(lang), "utf8");
  await writeFile(eticsPath, eticsPage(lang), "utf8");
  await writeFile(stonePath, stonePage(lang), "utf8");
  await writeFile(thermowoodPath, thermowoodPage(lang), "utf8");
  await writeFile(universalPath, universalPage(lang), "utf8");
  await writeFile(flatRoofPath, flatRoofPage(lang), "utf8");
}

console.log(
  `Generated ${langs.length} Technical Library landing pages and ${langs.length} pages for each of roof, ETICS, Natural Stone, ThermoWood, Universal Ventilated Façade and Universal Insulated Flat Roof.`,
);
