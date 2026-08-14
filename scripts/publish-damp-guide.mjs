import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const pub = path.join(root, 'public');
const base = 'https://www.ecoviva-mallorca.com';

const guides = {
  en: {
    src: 'public/preview/guides/damp-moisture-mallorca/index.html',
    out: 'public/guides/en/damp-moisture-mallorca/index.html',
    path: '/guides/en/damp-moisture-mallorca/',
    title: 'Damp & Moisture Problems in Mallorca Homes | EcoViva Mallorca',
    description: 'Guide to condensation, rising damp, water infiltration and roof or terrace leaks in Mallorca homes, with practical diagnosis routes and renovation solutions.'
  },
  es: {
    src: 'public/preview/guides/problemas-humedad-mallorca/index.html',
    out: 'public/guides/es/problemas-humedad-mallorca/index.html',
    path: '/guides/es/problemas-humedad-mallorca/',
    title: 'Problemas de humedad en viviendas de Mallorca | EcoViva Mallorca',
    description: 'Guía sobre condensación, humedad por capilaridad, infiltraciones y filtraciones de cubiertas o terrazas en viviendas de Mallorca.'
  },
  de: {
    src: 'public/preview/guides/feuchtigkeitsprobleme-mallorca/index.html',
    out: 'public/guides/de/feuchtigkeitsprobleme-mallorca/index.html',
    path: '/guides/de/feuchtigkeitsprobleme-mallorca/',
    title: 'Feuchtigkeitsprobleme in Häusern auf Mallorca | EcoViva Mallorca',
    description: 'Ratgeber zu Kondensation, aufsteigender Feuchtigkeit, Wassereintritt sowie Dach- und Terrassenleckagen in Immobilien auf Mallorca.'
  }
};

const alternate = Object.fromEntries(Object.entries(guides).map(([lang, g]) => [lang, `${base}${g.path}`]));

function seoHead(lang, g) {
  const ogLocale = lang === 'en' ? 'en_GB' : lang === 'es' ? 'es_ES' : 'de_DE';
  return [
    `<meta name="robots" content="index,follow,max-image-preview:large">`,
    `<meta name="description" content="${g.description}">`,
    `<link rel="canonical" href="${base}${g.path}">`,
    `<link rel="alternate" hreflang="en" href="${alternate.en}">`,
    `<link rel="alternate" hreflang="es" href="${alternate.es}">`,
    `<link rel="alternate" hreflang="de" href="${alternate.de}">`,
    `<link rel="alternate" hreflang="x-default" href="${alternate.en}">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:locale" content="${ogLocale}">`,
    `<meta property="og:title" content="${g.title}">`,
    `<meta property="og:description" content="${g.description}">`,
    `<meta property="og:url" content="${base}${g.path}">`,
    `<meta property="og:image" content="${base}/assets/guides/damp-moisture/damp-moisture-mallorca-hero.webp">`
  ].join('');
}

const technicalFixes = {
  es: [
    ['/technical-library/es/universal-insulated-flat-roof-system/', '/technical-library/es/sistema-universal-cubierta-plana-aislada/']
  ],
  de: [
    ['/technical-library/de/universal-ventilated-facade-system/', '/technical-library/de/universelles-hinterlueftetes-fassadensystem/'],
    ['/technical-library/de/universal-insulated-flat-roof-system/', '/technical-library/de/universelles-gedaemmtes-flachdachsystem/']
  ]
};

const commercialLinks = {
  en: `<div class="mid-cta"><h3>Relevant renovation routes</h3><p>If the cause is linked to the building envelope, EcoViva can coordinate the appropriate renovation route.</p><div class="route-links"><a href="/en/facade-renovation-mallorca/">Facade renovation Mallorca →</a><a href="/en/roof-renovation-mallorca/">Roof renovation Mallorca →</a><a href="/en/terrace-renovation-mallorca/">Terraces & waterproofing Mallorca →</a><a href="/en/renovation-mallorca/">Complete renovation Mallorca →</a><a href="/guides/en/etics-installation-mistakes-mallorca/">ETICS installation mistakes: what render can hide →</a></div></div>`,
  es: `<div class="mid-cta"><h3>Rutas de reforma relacionadas</h3><p>Si la causa está relacionada con la envolvente del edificio, EcoViva puede coordinar la solución de reforma adecuada.</p><div class="route-links"><a href="/es/reforma-fachada-mallorca/">Reforma de fachada en Mallorca →</a><a href="/es/reforma-cubierta-mallorca/">Reforma de cubierta en Mallorca →</a><a href="/es/reforma-terraza-mallorca/">Terrazas e impermeabilización →</a><a href="/es/reforma-mallorca/">Reforma integral en Mallorca →</a><a href="/guides/es/errores-instalacion-sate-mallorca/">Errores de instalación SATE: lo que puede ocultar el revoco →</a></div></div>`,
  de: `<div class="mid-cta"><h3>Passende Renovierungsbereiche</h3><p>Liegt die Ursache in der Gebäudehülle, kann EcoViva die passende Renovierungslösung koordinieren.</p><div class="route-links"><a href="/de/fassadensanierung-mallorca/">Fassadensanierung Mallorca →</a><a href="/de/dachsanierung-mallorca/">Dachsanierung Mallorca →</a><a href="/de/terrassensanierung-mallorca/">Terrassen & Abdichtung →</a><a href="/de/renovierung-mallorca/">Komplette Renovierung Mallorca →</a><a href="/guides/de/wdvs-ausfuehrungsfehler-mallorca/">WDVS-Ausführungsfehler: was der Oberputz verdecken kann →</a></div></div>`
};

for (const [lang, g] of Object.entries(guides)) {
  let html = await fs.readFile(path.join(root, g.src), 'utf8');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${g.title}</title>`);
  html = html.replace(/<meta name="robots"[^>]*>/i, seoHead(lang, g));
  html = html.replaceAll('/preview/guides/damp-moisture-mallorca/', guides.en.path)
             .replaceAll('/preview/guides/problemas-humedad-mallorca/', guides.es.path)
             .replaceAll('/preview/guides/feuchtigkeitsprobleme-mallorca/', guides.de.path);
  for (const [from, to] of technicalFixes[lang] || []) html = html.replaceAll(from, to);
  html = html.replace(/(<\/div><\/section><\/div><section class="guide-final">)/, `${commercialLinks[lang]}$1`);
  if (!/<footer\b/i.test(html)) html = html.replace('</body>', '<footer class="site-footer"></footer></body>');
  await fs.mkdir(path.dirname(path.join(root, g.out)), { recursive: true });
  await fs.writeFile(path.join(root, g.out), html, 'utf8');
}

let sitemap = await fs.readFile(path.join(pub, 'sitemap.xml'), 'utf8');
if (!sitemap.includes(guides.en.path)) {
  const rows = Object.entries(guides).map(([lang, g]) => {
    const links = Object.entries(guides).map(([l, x]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${base}${x.path}"/>`).join('');
    return `  <url><loc>${base}${g.path}</loc>${links}<xhtml:link rel="alternate" hreflang="x-default" href="${base}${guides.en.path}"/></url>`;
  }).join('\n');
  sitemap = sitemap.replace('</urlset>', `${rows}\n</urlset>`);
  await fs.writeFile(path.join(pub, 'sitemap.xml'), sitemap, 'utf8');
}

console.log('Published Damp & Moisture Guide in EN/ES/DE with SEO metadata, public routes and sitemap entries.');
