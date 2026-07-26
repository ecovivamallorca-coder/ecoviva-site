import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { langs } from "./technical-library-content.mjs";
import { eticsPdfByLang, eticsSlugByLang } from "./technical-library-etics-content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const forbidden = ["localhost", "chatgpt.com", "openai.com", "/Users/", "file://", "vercel.app"];

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

for (const lang of langs) {
  const slug = eticsSlugByLang[lang];
  const pagePath = join(root, "public", "technical-library", lang, slug, "index.html");
  const landingPath = join(root, "public", "technical-library", lang, "index.html");
  const pdfPath = join(root, "public", "downloads", eticsPdfByLang[lang]);
  const page = await readFile(pagePath, "utf8");
  const landing = await readFile(landingPath, "utf8");
  const pdfHeader = (await readFile(pdfPath)).subarray(0, 5).toString("ascii");

  assert(page.includes(`<html lang="${lang}">`), `${lang}: incorrect html lang`);
  assert(page.includes(`<link rel="canonical" href="https://www.ecoviva-mallorca.com/technical-library/${lang}/${slug}/">`), `${lang}: canonical missing`);
  assert((page.match(/<link rel="alternate" hreflang="/g) ?? []).length === 4, `${lang}: incomplete hreflang set`);
  assert(page.includes('href="#main"'), `${lang}: skip link missing`);
  assert(page.includes('id="main"'), `${lang}: main landmark missing`);
  assert((page.match(/<h1>/g) ?? []).length === 1, `${lang}: page needs exactly one h1`);
  assert((page.match(/class="hero-number"/g) ?? []).length === 8, `${lang}: hero needs eight callouts`);
  assert(!page.toLowerCase().includes("qr"), `${lang}: QR reference found in HTML`);
  assert([...page.matchAll(/<img /g)].every((match) => {
    const start = match.index;
    const end = page.indexOf(">", start);
    return page.slice(start, end).includes(" alt=");
  }), `${lang}: image without alt attribute`);
  assert(page.includes(`/downloads/${eticsPdfByLang[lang]}`), `${lang}: download link missing`);
  assert(page.includes(`/technical-library/${lang}/`), `${lang}: library return link missing`);
  assert(page.includes("https://www.ecoviva-mallorca.com/"), `${lang}: home link missing`);
  assert(landing.includes(`/technical-library/${lang}/traditional-mallorcan-roof/`), `${lang}: roof card missing`);
  assert(landing.includes(`/technical-library/${lang}/${slug}/`), `${lang}: ETICS card missing`);
  assert(pdfHeader === "%PDF-", `${lang}: invalid PDF header`);

  for (const value of forbidden) {
    assert(!page.includes(value), `${lang}: forbidden reference ${value}`);
    assert(!landing.includes(value), `${lang}: forbidden landing reference ${value}`);
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

console.log("Validated 3 ETICS pages, 3 landing pages, 3 PDFs and 6 ETICS image assets.");
