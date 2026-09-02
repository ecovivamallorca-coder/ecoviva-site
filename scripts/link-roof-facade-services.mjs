import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', 'public');
const markerStart = '<!-- RELATED_SERVICE_LINKS_START -->';
const markerEnd = '<!-- RELATED_SERVICE_LINKS_END -->';

const labels = {
  en:{eyebrow:'FROM TECHNICAL DETAIL TO RENOVATION',title:'Need this system assessed for your property?',roof:'Explore roof renovation in Mallorca',facade:'Explore façade renovation & ETICS in Mallorca'},
  es:{eyebrow:'DEL DETALLE TÉCNICO A LA REFORMA',title:'¿Necesitas evaluar este sistema para tu propiedad?',roof:'Ver reforma de cubiertas en Mallorca',facade:'Ver reforma de fachadas y SATE en Mallorca'},
  de:{eyebrow:'VOM TECHNISCHEN DETAIL ZUR SANIERUNG',title:'Soll dieses System für Ihre Immobilie geprüft werden?',roof:'Dachsanierung auf Mallorca ansehen',facade:'Fassadensanierung & WDVS ansehen'}
};
const urls={
  en:{roof:'/en/roof-renovation-mallorca/',facade:'/en/facade-renovation-mallorca/'},
  es:{roof:'/es/reforma-cubierta-mallorca/',facade:'/es/reforma-fachada-mallorca/'},
  de:{roof:'/de/dachsanierung-mallorca/',facade:'/de/fassadensanierung-mallorca/'}
};

const targets = [
  ['guides/en/damp-moisture-mallorca/index.html','en',['roof','facade']],
  ['guides/es/problemas-humedad-mallorca/index.html','es',['roof','facade']],
  ['guides/de/feuchtigkeitsprobleme-mallorca/index.html','de',['roof','facade']],
  ['guides/en/etics-installation-mistakes-mallorca/index.html','en',['facade']],
  ['guides/es/errores-instalacion-sate-mallorca/index.html','es',['facade']],
  ['guides/de/wdvs-ausfuehrungsfehler-mallorca/index.html','de',['facade']],
  ['technical-library/en/traditional-mallorcan-roof/index.html','en',['roof']],
  ['technical-library/es/traditional-mallorcan-roof/index.html','es',['roof']],
  ['technical-library/de/traditional-mallorcan-roof/index.html','de',['roof']],
  ['technical-library/en/universal-insulated-flat-roof-system/index.html','en',['roof']],
  ['technical-library/es/sistema-universal-cubierta-plana-aislada/index.html','es',['roof']],
  ['technical-library/de/universelles-gedaemmtes-flachdachsystem/index.html','de',['roof']],
  ['technical-library/en/etics-external-wall-insulation/index.html','en',['facade']],
  ['technical-library/es/sistema-sate-aislamiento-exterior/index.html','es',['facade']],
  ['technical-library/de/wdvs-aussendaemmung-putzfassade/index.html','de',['facade']],
  ['technical-library/en/natural-stone-facade-system/index.html','en',['facade']],
  ['technical-library/es/sistema-fachada-piedra-natural/index.html','es',['facade']],
  ['technical-library/de/naturstein-fassadensystem/index.html','de',['facade']],
  ['technical-library/en/ventilated-thermowood-facade-system/index.html','en',['facade']],
  ['technical-library/es/sistema-fachada-ventilada-thermowood/index.html','es',['facade']],
  ['technical-library/de/hinterlueftetes-thermowood-fassadensystem/index.html','de',['facade']],
  ['technical-library/en/universal-ventilated-facade-system/index.html','en',['facade']],
  ['technical-library/es/sistema-universal-fachada-ventilada/index.html','es',['facade']],
  ['technical-library/de/universelles-hinterlueftetes-fassadensystem/index.html','de',['facade']]
];

for(const [relative,lang,services] of targets){
  const file=resolve(root,relative);
  let html=await readFile(file,'utf8');
  html=html.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`,'g'),'');
  const links=services.map(service=>`<a href="${urls[lang][service]}">${labels[lang][service]} <span aria-hidden="true">→</span></a>`).join('');
  const block=`${markerStart}<aside class="ecoviva-related-service" aria-label="${labels[lang].title}"><div><p>${labels[lang].eyebrow}</p><h2>${labels[lang].title}</h2></div><nav>${links}</nav></aside>${markerEnd}`;
  html=html.replace(/<footer\b/i,`${block}<footer`);
  await writeFile(file,html,'utf8');
}

console.log(`Linked ${targets.length} Guide and Technical Library pages to roof and façade services.`);
