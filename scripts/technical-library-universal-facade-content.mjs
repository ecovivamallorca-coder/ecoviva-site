import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const readContent = (lang) =>
  JSON.parse(readFileSync(join(here, `universal-facade-content-${lang}.json`), "utf8"));

export const universalCopy = Object.fromEntries(
  ["en", "es", "de"].map((lang) => [lang, readContent(lang)]),
);

export const universalSlugByLang = Object.fromEntries(
  Object.entries(universalCopy).map(([lang, content]) => [lang, content.slug]),
);

export const universalDownloadPdfByLang = Object.fromEntries(
  Object.entries(universalCopy).map(([lang, content]) => [
    lang,
    `${content.pdfStem}_Download.pdf`,
  ]),
);

export const universalPrintPdfByLang = Object.fromEntries(
  Object.entries(universalCopy).map(([lang, content]) => [
    lang,
    `${content.pdfStem}_Print_3mmBleed.pdf`,
  ]),
);

export const universalComponentImages = [
  "component-pir.png",
  "component-substructure.png",
  "component-fixing.png",
  "component-ventilation-profile.png",
  "component-joint-profile.png",
];

export const universalMaterialImages = [
  "material-rockpanel.png",
  "material-fibre-cement.png",
  "material-natural-slate.png",
  "material-hpl.png",
  "material-aluminium.png",
  "material-porcelain.png",
];
