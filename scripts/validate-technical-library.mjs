import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { langs } from "./technical-library-content.mjs";
import { eticsPdfByLang, eticsSlugByLang } from "./technical-library-etics-content.mjs";
import {
  stoneCopy,
  stonePdfByLang,
  stoneSlugByLang,
} from "./technical-library-natural-stone-content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const forbidden = ["localhost", "chatgpt.com", "openai.com", "/Users/", "file://", "vercel.app"];

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

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
  assert(landing.includes("natural-stone-hero-v1-2.png"), `${lang}: Natural Stone landing card does not use the approved V1.2 hero`);
  assert(!landing.includes("stone-hero.png"), `${lang}: legacy Natural Stone hero remains on the landing page`);
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

console.log("Validated 3 Roof, 3 ETICS and 3 Natural Stone pages, 3 landing pages, 9 PDFs and all module image assets.");
