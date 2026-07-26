import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { langs } from "./technical-library-content.mjs";
import { eticsPdfByLang, eticsSlugByLang } from "./technical-library-etics-content.mjs";
import {
  stoneCopy,
  stonePdfByLang,
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

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const forbidden = ["localhost", "chatgpt.com", "openai.com", "/Users/", "file://", "vercel.app"];
const thermowoodGeometry = JSON.parse(
  await readFile(join(root, "scripts", "thermowood-geometry.json"), "utf8"),
);

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const pdfBox = (data, name) => {
  const source = data.toString("latin1");
  const match = source.match(
    new RegExp(String.raw`/${name} \[ ([0-9.]+) ([0-9.]+) ([0-9.]+) ([0-9.]+) \]`),
  );
  assert(match, `PDF ${name} is missing`);
  return match.slice(1).map(Number);
};
const pointsToMm = (points) => points * 25.4 / 72;
const approximately = (actual, expected, tolerance = 0.05) =>
  Math.abs(actual - expected) <= tolerance;

const technicalLibraryCss = await readFile(
  join(root, "public", "assets", "technical-roof.css"),
  "utf8",
);
assert(
  !/\.stone-component-grid \.component-image img\s*\{[^}]*transform:\s*none/s.test(
    technicalLibraryCss,
  ),
  "Natural Stone component scaling is globally disabled",
);
for (const [component, scale] of [
  [5, "1.12"],
  [6, "0.65"],
  [8, "0.62"],
]) {
  assert(
    technicalLibraryCss.includes(
      `.stone-component-grid li:nth-child(${component}) .component-image img {\n  transform: scale(${scale});`,
    ),
    `Natural Stone component ${component} does not use the approved V1.2 optical scale`,
  );
}
for (const requiredHeroRule of [
  ".stone-hero-diagram {\n  overflow: hidden;",
  "border-color: var(--roof-green);",
  "border-radius: var(--roof-radius);",
  ".stone-hero-diagram > img {\n  width: 100%;\n  height: auto;\n  object-fit: contain;\n  object-position: center;\n  transform: none;",
]) {
  assert(
    technicalLibraryCss.includes(requiredHeroRule),
    `Natural Stone hero containment rule missing: ${requiredHeroRule}`,
  );
}

for (const lang of langs) {
  const landingPath = join(root, "public", "technical-library", lang, "index.html");
  const landing = await readFile(landingPath, "utf8");
  assert(landing.includes(`/technical-library/${lang}/traditional-mallorcan-roof/`), `${lang}: roof card missing`);
  assert(landing.includes(`/technical-library/${lang}/${eticsSlugByLang[lang]}/`), `${lang}: ETICS card missing`);
  assert(landing.includes(`/technical-library/${lang}/${stoneSlugByLang[lang]}/`), `${lang}: Natural Stone card missing`);
  assert(landing.includes(`/technical-library/${lang}/${thermowoodSlugByLang[lang]}/`), `${lang}: ThermoWood card missing`);
  assert(
    landing.includes(
      'class="library-card library-card--natural-stone"',
    ),
    `${lang}: Natural Stone landing card class missing`,
  );
  assert(
    landing.includes("natural-stone-overview-hero-v1-2.png"),
    `${lang}: Natural Stone landing card does not use the clean V1.2 overview hero`,
  );
  assert(
    !landing.includes("natural-stone-hero-v1-2.png"),
    `${lang}: annotated Natural Stone hero remains on the landing page`,
  );
  assert(!landing.includes("stone-hero.png"), `${lang}: legacy Natural Stone hero remains on the landing page`);
  assert(
    landing.includes('class="library-card library-card--thermowood"'),
    `${lang}: ThermoWood landing card class missing`,
  );
  assert(
    landing.includes("thermowood-overview-hero-v1.png"),
    `${lang}: ThermoWood landing card does not use the clean overview hero`,
  );
  assert(
    !landing.includes("thermowood-hero-annotated-v1.png"),
    `${lang}: annotated ThermoWood hero remains on the landing page`,
  );
  assert((landing.match(/class="tl-button tl-button--secondary"/g) ?? []).length === 2, `${lang}: landing actions are not shared buttons`);

  for (const module of [
    { name: "Roof", slug: "traditional-mallorcan-roof", pdf: `EcoViva_A4_Traditional_Mallorcan_Roof_${lang.toUpperCase()}_Download.pdf` },
    { name: "ETICS", slug: eticsSlugByLang[lang], pdf: eticsPdfByLang[lang] },
    { name: "Natural Stone", slug: stoneSlugByLang[lang], pdf: stonePdfByLang[lang] },
  ]) {
    const pagePath = join(root, "public", "technical-library", lang, module.slug, "index.html");
    const pdfPath = join(root, "public", "downloads", module.pdf);
    const page = await readFile(pagePath, "utf8");
    const pdfHeader = (await readFile(pdfPath)).subarray(0, 5).toString("ascii");

    assert(page.includes(`<html lang="${lang}">`), `${lang} ${module.name}: incorrect html lang`);
    assert(page.includes(`<link rel="canonical" href="https://www.ecoviva-mallorca.com/technical-library/${lang}/${module.slug}/">`), `${lang} ${module.name}: canonical missing`);
    assert((page.match(/<link rel="alternate" hreflang="/g) ?? []).length === 4, `${lang} ${module.name}: incomplete hreflang set`);
    assert(page.includes('href="#main"'), `${lang} ${module.name}: skip link missing`);
    assert(page.includes('id="main"'), `${lang} ${module.name}: main landmark missing`);
    assert((page.match(/<h1>/g) ?? []).length === 1, `${lang} ${module.name}: page needs exactly one h1`);
    if (module.name !== "Natural Stone") {
      assert((page.match(/class="hero-number"/g) ?? []).length === 8, `${lang} ${module.name}: hero needs eight callouts`);
    }
    assert(!page.toLowerCase().includes("qr"), `${lang} ${module.name}: QR reference found in HTML`);
    assert([...page.matchAll(/<img /g)].every((match) => {
      const start = match.index;
      const end = page.indexOf(">", start);
      return page.slice(start, end).includes(" alt=");
    }), `${lang} ${module.name}: image without alt attribute`);
    assert(page.includes(`/downloads/${module.pdf}`), `${lang} ${module.name}: download link missing`);
    assert(page.includes(`/technical-library/${lang}/`), `${lang} ${module.name}: library return link missing`);
    assert(page.includes("https://www.ecoviva-mallorca.com/"), `${lang} ${module.name}: home link missing`);
    assert((page.match(/class="tl-button /g) ?? []).length === 3, `${lang} ${module.name}: three shared action buttons required`);
    assert(!page.includes("text-button"), `${lang} ${module.name}: plain-text home action remains`);
    assert(pdfHeader === "%PDF-", `${lang} ${module.name}: invalid PDF header`);
    if (module.name === "Natural Stone") {
      assert((page.match(/class="component-image"/g) ?? []).length === 8, `${lang}: Natural Stone needs eight components`);
      assert(page.includes("natural-stone-hero-v1-2.png"), `${lang}: approved V1.2 web hero missing`);
      assert(!page.includes("stone-hero.png"), `${lang}: legacy Natural Stone hero referenced`);
      assert(!page.includes("stone-veneer-strip.png"), `${lang}: legacy Natural Stone strip referenced`);
      const c = stoneCopy[lang];
      for (const value of [
        c.overview,
        ...c.layers.flatMap(([title, body]) => [title, body]),
        ...c.principles.flatMap(([title, body]) => [title, body]),
        ...c.benefits.flatMap(([title, body]) => [title, body]),
        c.compliance,
        c.stripNote,
      ]) {
        assert(page.includes(value), `${lang}: approved V1.2 Natural Stone copy missing: ${value}`);
      }
      assert((page.match(/<figure>/g) ?? []).length >= 10, `${lang}: ten named stone textures missing`);
      for (const name of ["Heras", "Mantiel", "Coria", "Calonge", "Cadaqués", "Mansilla", "Toix Blanca", "Cuarcita Multicolor", "Tor Terra", "Toril Gris"]) {
        assert(page.includes(`<figcaption>${name}</figcaption>`), `${lang}: stone texture ${name} missing`);
      }
    }
    for (const value of forbidden) {
      assert(!page.includes(value), `${lang} ${module.name}: forbidden reference ${value}`);
      assert(!landing.includes(value), `${lang}: forbidden landing reference ${value}`);
    }
  }

  const thermowood = thermowoodCopy[lang];
  const thermowoodPath = join(
    root,
    "public",
    "technical-library",
    lang,
    thermowoodSlugByLang[lang],
    "index.html",
  );
  const thermowoodPage = await readFile(thermowoodPath, "utf8");
  assert(thermowoodPage.includes(`<html lang="${lang}">`), `${lang} ThermoWood: incorrect html lang`);
  assert(
    thermowoodPage.includes(
      `<link rel="canonical" href="https://www.ecoviva-mallorca.com/technical-library/${lang}/${thermowoodSlugByLang[lang]}/">`,
    ),
    `${lang} ThermoWood: canonical missing`,
  );
  assert(
    (thermowoodPage.match(/<link rel="alternate" hreflang="/g) ?? []).length === 4,
    `${lang} ThermoWood: incomplete hreflang set`,
  );
  assert(thermowoodPage.includes('href="#main"'), `${lang} ThermoWood: skip link missing`);
  assert(thermowoodPage.includes('id="main"'), `${lang} ThermoWood: main landmark missing`);
  assert((thermowoodPage.match(/<h1>/g) ?? []).length === 1, `${lang} ThermoWood: page needs exactly one h1`);
  assert(
    thermowoodPage.includes('data-callout-count="5"') &&
      thermowoodPage.includes('data-leader-line-count="5"') &&
      thermowoodPage.includes('data-lower-airflow-arrows="4"') &&
      thermowoodPage.includes('data-upper-airflow-arrows="0"'),
    `${lang} ThermoWood: approved hero annotation counts missing`,
  );
  assert(
    thermowoodPage.includes(
      `data-callout-endpoints="${thermowoodGeometry.hero.callouts
        .map(({ endpoint }) => endpoint.join(","))
        .join(";")}"`,
    ),
    `${lang} ThermoWood: callout endpoints differ from shared geometry`,
  );
  assert(
    thermowoodPage.includes("thermowood-hero-annotated-v1.png") &&
      !thermowoodPage.includes("thermowood-overview-hero-v1.png"),
    `${lang} ThermoWood: annotated detail hero is incorrect`,
  );
  assert((thermowoodPage.match(/<span class="number">/g) ?? []).length === 5, `${lang} ThermoWood: build-up needs five numbered layers`);
  assert((thermowoodPage.match(/class="thermowood-component-image"/g) ?? []).length === 6, `${lang} ThermoWood: six unnumbered components required`);
  assert(
    thermowoodPage.includes('data-divider-count="5" data-numbering="none"'),
    `${lang} ThermoWood: five assembly dividers or unnumbered-component contract missing`,
  );
  assert(
    thermowoodPage.includes('class="thermowood-design-grid" data-numbering="none"'),
    `${lang} ThermoWood: unnumbered design-option contract missing`,
  );
  assert((thermowoodPage.match(/<figure>/g) ?? []).length === 10, `${lang} ThermoWood: six design and four ageing figures required`);
  assert((thermowoodPage.match(/class="tl-button /g) ?? []).length === 4, `${lang} ThermoWood: four shared action buttons required`);
  assert(!/preview v6/i.test(thermowoodPage), `${lang} ThermoWood: preview label remains`);
  assert(!thermowoodPage.toLowerCase().includes("qr"), `${lang} ThermoWood: QR reference found`);
  assert(
    [...thermowoodPage.matchAll(/<img /g)].every((match) => {
      const start = match.index;
      const end = thermowoodPage.indexOf(">", start);
      return thermowoodPage.slice(start, end).includes(" alt=");
    }),
    `${lang} ThermoWood: image without alt attribute`,
  );
  for (const value of [
    thermowood.title,
    thermowood.subtitle,
    thermowood.overview,
    thermowood.overviewNote,
    ...thermowood.why,
    ...thermowood.layers.flatMap(([title, body]) => [title, body]),
    ...thermowood.principles.flatMap(([title, body]) => [title, body]),
    ...thermowood.components.flatMap(([title, body]) => [title, body]),
    ...thermowood.designOptions.flatMap(([title, body]) => [title, body]),
    ...thermowood.benefits,
    ...thermowood.applications,
    ...thermowood.ageingStages,
    thermowood.ageingNote,
    thermowood.requirements,
  ]) {
    assert(
      thermowoodPage.includes(escapeHtml(value)),
      `${lang} ThermoWood: approved shared copy missing: ${value}`,
    );
  }
  for (const value of forbidden) {
    assert(!thermowoodPage.includes(value), `${lang} ThermoWood: forbidden reference ${value}`);
  }

  for (const [filename, expectedMedia, expectedTrim, expectedBleed] of [
    [
      thermowoodDownloadPdfByLang[lang],
      [0, 0, 210, 297],
      [0, 0, 210, 297],
      [0, 0, 210, 297],
    ],
    [
      thermowoodPrintPdfByLang[lang],
      [0, 0, 216, 303],
      [3, 3, 213, 300],
      [0, 0, 216, 303],
    ],
  ]) {
    const data = await readFile(join(root, "public", "downloads", filename));
    assert(data.subarray(0, 5).toString("ascii") === "%PDF-", `${lang} ThermoWood: invalid PDF ${filename}`);
    assert(data.toString("latin1").includes("/OutputIntents"), `${lang} ThermoWood: sRGB output intent missing in ${filename}`);
    for (const [boxName, expected] of [
      ["MediaBox", expectedMedia],
      ["TrimBox", expectedTrim],
      ["BleedBox", expectedBleed],
    ]) {
      const actual = pdfBox(data, boxName).map(pointsToMm);
      assert(
        actual.every((value, index) => approximately(value, expected[index])),
        `${lang} ThermoWood: ${filename} ${boxName} is ${actual.join(", ")} mm`,
      );
    }
  }
}

for (const asset of [
  "crepi-hero.png",
  "component-1-corner-profile.png",
  "component-2-mounting-block.png",
  "component-3-recessed-fixing.png",
  "component-4-window-profile.png",
  "component-5-starter-profile.png",
]) {
  await access(join(root, "public", "assets", "technical-library", "etics", asset));
}

for (const asset of [
  "natural-stone-hero-v1-2.png",
  "natural-stone-overview-hero-v1-2.png",
  "component_01_natural_stone_veneers.png",
  "component_02_corner_stones.png",
  "component_03_stone_adhesive.png",
  "component_04_joint_mortar.png",
  "component_05_starter_rail.png",
  "component_06_mechanical_anchor.png",
  "component_07_waterproofing_membrane.png",
  "component_08_support_system.png",
  "stone_01_heras.png",
  "stone_02_mantiel.png",
  "stone_03_coria.png",
  "stone_04_calonge.png",
  "stone_05_cadaques.png",
  "stone_06_mansilla.png",
  "stone_07_toix_blanca.png",
  "stone_08_cuarcita_multicolor.png",
  "stone_09_tor_terra.png",
  "stone_10_toril_gris.png",
]) {
  await access(join(root, "public", "assets", "technical-library", "natural-stone", asset));
}

for (const asset of [
  "thermowood-hero-annotated-v1.png",
  "thermowood-overview-hero-v1.png",
  ...thermowoodComponentImages,
  ...thermowoodDesignImages,
  ...thermowoodAgeingImages,
]) {
  await access(join(root, "public", "assets", "technical-library", "thermowood", asset));
}
const publicThermowoodFiles = [
  ...(await readdir(join(root, "public", "assets", "technical-library", "thermowood"))),
  ...(await readdir(join(root, "public", "downloads"))).filter((name) =>
    name.toLowerCase().includes("thermowood"),
  ),
];
for (const filename of publicThermowoodFiles) {
  assert(!/(^|[-_.])(preview|temp|test|screenshot|untitled)([-_.]|$)/i.test(filename), `Temporary ThermoWood filename is public: ${filename}`);
  assert(!/final-final|new-final/i.test(filename), `Experimental ThermoWood filename is public: ${filename}`);
  assert(!/a3/i.test(filename), `Accidental A3 ThermoWood file is public: ${filename}`);
}

const cleanStoneOverviewHero = await readFile(
  join(
    root,
    "public",
    "assets",
    "technical-library",
    "natural-stone",
    "natural-stone-overview-hero-v1-2.png",
  ),
);
assert(
  createHash("sha256").update(cleanStoneOverviewHero).digest("hex") ===
    "6e26010281315f9063a1ab1652ad09b4bef5f4c2c49f3ffc67dac72033d56300",
  "Natural Stone overview hero is not the approved clean raster embedded in the V1.2 master",
);

for (const legacyAsset of ["stone-hero.png", "stone-veneer-strip.png"]) {
  try {
    await access(
      join(
        root,
        "public",
        "assets",
        "technical-library",
        "natural-stone",
        legacyAsset,
      ),
    );
    throw new Error(`Legacy Natural Stone asset still exists: ${legacyAsset}`);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

console.log("Validated 3 pages each for Roof, ETICS, Natural Stone and ThermoWood, 3 landing pages, 15 PDFs, shared ThermoWood geometry/copy and all module image assets.");
