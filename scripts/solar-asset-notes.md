# EcoViva Solar assets — 1 October 2026

## Product images

The ten PNG product images in `public/assets/technical-library/solar/` are extracted from the product-image regions of Pedro Wydoodt / TLS-Solutions' supplied `Ecoviva Mallorca SL.pdf`, dated 30 September 2026. They retain the supplied manufacturer imagery, rather than substituting generated hardware.

- Page 2: ProMount aluminium rail, double-adjustable roof hook, click middle clamp, click end clamp.
- Page 3: ProMount SOLARSPEED east-west profile, side plate and ballast holder.
- Page 4: Bauer glass-glass panel (illustrative PURE reference; final article to confirm).
- Page 5: Solis inverter (illustrative S6-series image; final model to confirm) and Marstek VENUS E (3.0 example; final version to confirm).

The quotation contains purchase prices and is not published. Image credits and product scope are retained in the page copy and technical sheet. Manufacturer mounting reference: https://promountsolar.com/promount-home/ . No K2 or Soprasolar products are offered as part of these packages.

## Architectural and build-up images

Generated with the built-in image generation tool. Original supplied EcoViva pitched/flat roof cutaways are the edit targets. Corrected v3 pitched rendering references the original ProMount hook/rail photos and manufacturer mounting image; mounting largely remains concealed under two rails and the panels, with no fittings scattered across the exposed roof. The flat-roof cutaway is the first rendering selected by Markus on 1 October (Unknown.png); it is an illustrative roof integration. Exact SOLARSPEED profile, side plate and ballast-holder details are shown in the original product photographs separately.

Prompt intent: preserve the original roof layers and studio perspective; show a compact Bauer-style module array integrated above the covering; avoid loose fixings, random hooks, floating parts and waterproofing penetrations. Detail photos show the actual supplied hardware separately. Architectural scene prompts request traditional tiled roof, contemporary flat roof and ground mounting in a Mallorcan setting, with no logos or people. The flat-roof scene was corrected against the supplied SOLARSPEED reference.

These are illustrative integration concepts, not construction drawings, certified manufacturer assembly diagrams or photographs of completed EcoViva projects. That distinction is visible in localized captions. Final fixings, loads, ballast, module/inverter compatibility and weatherproofing are designed for each installation.

## Regenerating pages and technical sheets

`node scripts/build-site.mjs` builds the localized pages and exports `scripts/solar-pdf-content.generated.json`. For the downloadable sheets, run `python scripts/generate-solar-technical-pdfs.py` with ReportLab, Pillow and DejaVu fonts installed. The three four-page PDFs are committed as static website downloads. Their images are encoded as JPEG internally to keep downloads small.
