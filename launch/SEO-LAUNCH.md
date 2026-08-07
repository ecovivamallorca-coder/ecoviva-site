# EcoViva Mallorca SEO + live route launch specification

Prepared: 2026-08-07

## Final public routes
- `/` -> permanent redirect to `/en/`
- `/en/` -> English website
- `/es/` -> Spanish website
- `/de/` -> German website
- Existing `/technical-library/en/`, `/technical-library/es/`, `/technical-library/de/` remain unchanged.
- Existing non-www -> www permanent redirect remains unchanged.

## Preview routes after launch
- `/website-preview/en/` -> permanent redirect to `/en/`
- `/website-preview/es/` -> permanent redirect to `/es/`
- `/website-preview/de/` -> permanent redirect to `/de/`

This prevents duplicate indexed copies of the same website.

## Homepage SEO metadata

### English
Title: `EcoViva Mallorca | Complete Renovation Solutions in Mallorca`
Description: `Complete renovations, roofs, façades, windows, insulation, solar, interiors and exterior works in Mallorca — technically assessed and professionally coordinated by EcoViva.`
Canonical: `https://www.ecoviva-mallorca.com/en/`

### Spanish
Title: `EcoViva Mallorca | Soluciones integrales de reforma en Mallorca`
Description: `Reformas integrales, cubiertas, fachadas, ventanas, aislamiento, energía solar e interiores en Mallorca, evaluadas técnicamente y coordinadas profesionalmente por EcoViva.`
Canonical: `https://www.ecoviva-mallorca.com/es/`

### German
Title: `EcoViva Mallorca | Komplette Renovierungslösungen auf Mallorca`
Description: `Komplettsanierungen, Dächer, Fassaden, Fenster, Dämmung, Solar sowie Innen- und Außenarbeiten auf Mallorca — technisch geprüft und professionell koordiniert von EcoViva.`
Canonical: `https://www.ecoviva-mallorca.com/de/`

## Hreflang on all three homepages
```html
<link rel="alternate" hreflang="en" href="https://www.ecoviva-mallorca.com/en/">
<link rel="alternate" hreflang="es" href="https://www.ecoviva-mallorca.com/es/">
<link rel="alternate" hreflang="de" href="https://www.ecoviva-mallorca.com/de/">
<link rel="alternate" hreflang="x-default" href="https://www.ecoviva-mallorca.com/en/">
```

## Indexing at launch
Replace preview `noindex,nofollow` with:
`<meta name="robots" content="index,follow,max-image-preview:large">`

Do this only on the definitive `/en/`, `/es/`, `/de/` copies. Preview URLs are redirected and therefore do not need to remain indexable.

## Open Graph / social metadata
Each language page receives:
- `og:type=website`
- localized `og:title`
- localized `og:description`
- definitive canonical URL as `og:url`
- EcoViva hero image as `og:image`
- `og:site_name=EcoViva Mallorca`
- locale: `en_GB`, `es_ES`, `de_DE`
- Twitter card: `summary_large_image`

## Structured data
Use `ProfessionalService` + `Organization` for EcoViva Mallorca SL with:
- name: EcoViva Mallorca SL
- url: definitive language URL / organization homepage
- telephone: +34 871 53 27 58
- email: info@ecoviva-mallorca.com
- address: Passeig de Mallorca, 14-A, Entresuelo 2, Puerta E, 07012 Palma, Illes Balears, Spain
- areaServed: Mallorca
- availableLanguage: English, Spanish, German

Do not add review/rating markup without real review data.

## Launch files
Move/copy `launch/robots.txt` to `public/robots.txt` and `launch/sitemap.xml` to `public/sitemap.xml` in the actual launch commit.

## Final launch QA
1. `/` redirects once to `/en/`.
2. `/en/`, `/es/`, `/de/` return 200.
3. Language switcher uses definitive routes, not `/website-preview/`.
4. Fillout uses `https://ecoviva-mallorca.fillout.com/request`.
5. Technical Library routes remain 200.
6. No definitive homepage contains `noindex`.
7. Canonical is self-referencing in each language.
8. hreflang is reciprocal across EN/ES/DE plus x-default.
9. `/robots.txt` and `/sitemap.xml` return 200.
10. Old preview URLs redirect permanently to their definitive language routes.
11. Mobile menu, hero, request form and partner/contractor query routes are smoke-tested.
12. Coming Soon homepage is no longer served after launch.

## Important
This folder is staging documentation only. Nothing inside `launch/` is publicly served by Vercel's `public/` output, so preparing these files does not launch the new website or expose the sitemap before the approved launch action.
