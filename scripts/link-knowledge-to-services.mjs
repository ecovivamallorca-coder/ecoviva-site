import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const markerStart = '<!-- KISS_PHASE7_SERVICE_LINK_START -->';
const markerEnd = '<!-- KISS_PHASE7_SERVICE_LINK_END -->';
const legacyMarkerStart = '<!-- RELATED_SERVICE_LINKS_START -->';
const legacyMarkerEnd = '<!-- RELATED_SERVICE_LINKS_END -->';

const labels = {
  en: {
    eyebrow: 'FROM TECHNICAL KNOWLEDGE TO EXECUTION',
    title: 'Planning this work for your property?',
    text: 'EcoViva translates the technical assessment into a coordinated renovation scope, suitable materials, specialist execution and quality control in Mallorca.',
    action: 'Explore the renovation service',
  },
  es: {
    eyebrow: 'DEL CONOCIMIENTO TÉCNICO A LA EJECUCIÓN',
    title: '¿Está planificando este trabajo en su propiedad?',
    text: 'EcoViva convierte la evaluación técnica en una reforma coordinada, con materiales adecuados, ejecución especializada y control de calidad en Mallorca.',
    action: 'Ver el servicio de reforma',
  },
  de: {
    eyebrow: 'VOM TECHNISCHEN WISSEN ZUR AUSFÜHRUNG',
    title: 'Planen Sie diese Arbeiten an Ihrer Immobilie?',
    text: 'EcoViva überführt die technische Bewertung in einen koordinierten Sanierungsumfang mit passenden Materialien, Fachausführung und Qualitätskontrolle auf Mallorca.',
    action: 'Sanierungsleistung ansehen',
  },
};

const serviceNames = {
  roof: { en: 'Roof renovation in Mallorca', es: 'Reforma de cubiertas en Mallorca', de: 'Dachsanierung auf Mallorca' },
  facade: { en: 'Façade renovation in Mallorca', es: 'Reforma de fachadas en Mallorca', de: 'Fassadensanierung auf Mallorca' },
  solar: { en: 'Solar panels and batteries in Mallorca', es: 'Placas solares y baterías en Mallorca', de: 'Photovoltaik und Batteriespeicher auf Mallorca' },
  energy: { en: 'Energy renovation in Mallorca', es: 'Reforma energética en Mallorca', de: 'Energetische Sanierung auf Mallorca' },
  terrace: { en: 'Terrace renovation in Mallorca', es: 'Reforma de terrazas en Mallorca', de: 'Terrassensanierung auf Mallorca' },
  interior: { en: 'Interior renovation in Mallorca', es: 'Reforma interior en Mallorca', de: 'Innenrenovierung auf Mallorca' },
};

const serviceUrls = {
  roof: { en: '/en/roof-renovation-mallorca/', es: '/es/reforma-cubierta-mallorca/', de: '/de/dachsanierung-mallorca/' },
  facade: { en: '/en/facade-renovation-mallorca/', es: '/es/reforma-fachada-mallorca/', de: '/de/fassadensanierung-mallorca/' },
  solar: { en: '/en/solar-panels-mallorca/', es: '/es/placas-solares-mallorca/', de: '/de/photovoltaik-mallorca/' },
  energy: { en: '/en/energy-renovation-mallorca/', es: '/es/reforma-energetica-mallorca/', de: '/de/energetische-sanierung-mallorca/' },
  terrace: { en: '/en/terrace-renovation-mallorca/', es: '/es/reforma-terraza-mallorca/', de: '/de/terrassensanierung-mallorca/' },
  interior: { en: '/en/interior-renovation-mallorca/', es: '/es/reforma-interior-mallorca/', de: '/de/innenrenovierung-mallorca/' },
};

const technical = {
  'traditional-mallorcan-roof': 'roof',
  'etics-external-wall-insulation': 'facade',
  'sistema-sate-aislamiento-exterior': 'facade',
  'wdvs-aussendaemmung-putzfassade': 'facade',
  'natural-stone-facade-system': 'facade',
  'sistema-fachada-piedra-natural': 'facade',
  'naturstein-fassadensystem': 'facade',
  'ventilated-thermowood-facade-system': 'facade',
  'sistema-fachada-ventilada-thermowood': 'facade',
  'hinterlueftetes-thermowood-fassadensystem': 'facade',
  'universal-ventilated-facade-system': 'facade',
  'sistema-universal-fachada-ventilada': 'facade',
  'universelles-hinterlueftetes-fassadensystem': 'facade',
  'universal-insulated-flat-roof-system': 'roof',
  'sistema-universal-cubierta-plana-aislada': 'roof',
  'universelles-gedaemmtes-flachdachsystem': 'roof',
  'solar-panels-battery-system': 'solar',
  'sistema-fotovoltaico-baterias': 'solar',
  'photovoltaik-batteriesystem': 'solar',
};

const guides = {
  'mallorca-hottest-august-home-insulation': 'energy',
  'agosto-mas-caluroso-mallorca-aislamiento-vivienda': 'energy',
  'heissester-august-mallorca-waermedaemmung': 'energy',
  'etics-installation-mistakes-mallorca': 'facade',
  'errores-instalacion-sate-mallorca': 'facade',
  'wdvs-ausfuehrungsfehler-mallorca': 'facade',
  'damp-moisture-mallorca': 'terrace',
  'problemas-humedad-mallorca': 'terrace',
  'feuchtigkeitsprobleme-mallorca': 'terrace',
  'water-efficient-renovation-mallorca': 'interior',
  'reforma-eficiente-agua-mallorca': 'interior',
  'wassersparende-sanierung-mallorca': 'interior',
};

const style = `<style id="kiss-phase7-service-link-style">
.kiss-service-link{margin:54px auto;padding:0 24px}.kiss-service-link__inner{max-width:1060px;margin:auto;padding:34px 38px;border:1px solid rgba(62,107,32,.28);border-radius:18px;background:#f3f5ed}.kiss-service-link__eyebrow{margin:0 0 10px;color:#54742f;font-size:.76rem;font-weight:800;letter-spacing:.13em}.kiss-service-link h2{margin:0 0 12px;font-size:clamp(1.75rem,3vw,2.6rem);line-height:1.08}.kiss-service-link p{max-width:780px;line-height:1.7}.kiss-service-link a{display:inline-block;margin-top:8px;color:#3e6b20;font-weight:800;text-decoration:underline;text-underline-offset:4px}@media(max-width:640px){.kiss-service-link{padding:0 17px}.kiss-service-link__inner{padding:28px 24px}}
</style>`;

const block = (lang, service) => {
  const l = labels[lang];
  return `${markerStart}<section class="kiss-service-link" aria-labelledby="kiss-service-link-title"><div class="kiss-service-link__inner"><p class="kiss-service-link__eyebrow">${l.eyebrow}</p><h2 id="kiss-service-link-title">${l.title}</h2><p>${l.text}</p><a href="${serviceUrls[service][lang]}">${l.action}: ${serviceNames[service][lang]} →</a></div></section>${markerEnd}`;
};

async function apply(group, mapping) {
  let updated = 0;
  for (const lang of ['en', 'es', 'de']) {
    const langDir = path.join(root, 'public', group, lang);
    for (const [slug, service] of Object.entries(mapping)) {
      const file = path.join(langDir, slug, 'index.html');
      try {
        let html = await fs.readFile(file, 'utf8');
        html = html.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`, 'g'), '');
        html = html.replace(new RegExp(`${legacyMarkerStart}[\\s\\S]*?${legacyMarkerEnd}`, 'g'), '');
        const destination = serviceUrls[service][lang];
        if (html.includes(`href="${destination}"`) || html.includes(`href='${destination}'`)) {
          await fs.writeFile(file, html);
          updated++;
          continue;
        }
        if (!html.includes('id="kiss-phase7-service-link-style"')) html = html.replace('</head>', `${style}</head>`);
        const insertion = block(lang, service);
        html = html.includes('</main>') ? html.replace('</main>', `${insertion}</main>`) : html.replace(/<footer\b/, `${insertion}<footer`);
        await fs.writeFile(file, html);
        updated++;
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
  }
  return updated;
}

const technicalCount = await apply('technical-library', technical);
const guideCount = await apply('guides', guides);
console.log(`KISS phase 7 linked ${technicalCount} technical pages and ${guideCount} guides to commercial services.`);
