import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const flatRoofCopy = Object.fromEntries(
  ["en", "es", "de"].map((lang) => [
    lang,
    JSON.parse(readFileSync(join(here, `flat-roof-content-${lang}.json`), "utf8")),
  ]),
);

export const flatRoofSlugByLang = Object.fromEntries(
  Object.entries(flatRoofCopy).map(([lang, content]) => [lang, content.slug]),
);
export const flatRoofDownloadPdfByLang = Object.fromEntries(
  Object.entries(flatRoofCopy).map(([lang, content]) => [lang, `${content.pdfStem}_Download.pdf`]),
);
export const flatRoofPrintPdfByLang = Object.fromEntries(
  Object.entries(flatRoofCopy).map(([lang, content]) => [lang, `${content.pdfStem}_Print_3mmBleed.pdf`]),
);
export const flatRoofComponentImages = [
  "component-waterproofing.png",
  "component-v3-vapour-barrier.png",
  "component-pir-aluminium.png",
  "component-roof-drain.png",
  "component-aluminium-edge.png",
  "component-zinc-flashing.png",
  "component-stainless-fixings.png",
  "component-timber-joist.png",
];
export const flatRoofOptionImages = [
  "option-bituminous.png",
  "option-resitrix.png",
  "option-epdm.png",
  "option-pvc.png",
  "option-tpo.png",
  "option-liquid.png",
];
