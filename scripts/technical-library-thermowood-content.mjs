import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const readContent = (lang) =>
  JSON.parse(readFileSync(join(here, `thermowood-content-${lang}.json`), "utf8"));

export const thermowoodCopy = Object.fromEntries(
  ["en", "es", "de"].map((lang) => [lang, readContent(lang)]),
);

export const thermowoodSlugByLang = Object.fromEntries(
  Object.entries(thermowoodCopy).map(([lang, content]) => [lang, content.slug]),
);

export const thermowoodDownloadPdfByLang = Object.fromEntries(
  Object.entries(thermowoodCopy).map(([lang, content]) => [
    lang,
    `${content.pdfStem}_Download.pdf`,
  ]),
);

export const thermowoodPrintPdfByLang = Object.fromEntries(
  Object.entries(thermowoodCopy).map(([lang, content]) => [
    lang,
    `${content.pdfStem}_Print_3mmBleed.pdf`,
  ]),
);

export const thermowoodComponentImages = [
  "thermowood-component-cladding-profile.png",
  "thermowood-component-timber-batten.png",
  "thermowood-component-stainless-screw.png",
  "thermowood-component-breather-membrane.png",
  "thermowood-component-insect-mesh.png",
  "thermowood-component-pir.png",
];

export const thermowoodDesignImages = Array.from(
  { length: 6 },
  (_, index) => `thermowood-design-option-${index + 1}.png`,
);

export const thermowoodAgeingImages = Array.from(
  { length: 4 },
  (_, index) => `thermowood-ageing-${index + 1}.png`,
);
