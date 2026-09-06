import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const pub = path.join(root, 'public');
const base = 'https://www.ecoviva-mallorca.com';
const published = '2026-09-06';
const source = 'https://www.aemet.es/documentos/es/serviciosclimaticos/vigilancia_clima/resumenes_climat/ccaa/illes-balears/avance_climat_bal_ago_2026.pdf';
const assets = '/assets/guides/summer-heat';
const hero = `${assets}/palma-record-heat-hero.webp`;

const routes = {
  en: '/guides/en/mallorca-hottest-august-home-insulation/',
  es: '/guides/es/agosto-mas-caluroso-mallorca-aislamiento-vivienda/',
  de: '/guides/de/heissester-august-mallorca-waermedaemmung/'
};

const content = {
  en: {
    lang: 'en', locale: 'en_GB',
    title: 'Mallorca’s Hottest August: Why Home Insulation Matters | EcoViva',
    description: 'August 2026 was the Balearic Islands’ hottest August since 1961. See how roofs, façades, glazing and shading affect summer comfort in Mallorca.',
    eyebrow: 'RECORD HEAT · AUGUST 2026',
    h1: 'Mallorca Just Recorded Its Hottest August Ever',
    lead: "As Mallorca's summers become harder on buildings, insulation is no longer only about winter efficiency. The roof and façade also determine how quickly heat enters a home – and how hard air conditioning has to work to remove it.",
    date: 'Published 6 September 2026',
    recordEyebrow: 'AUGUST 2026 · AEMET',
    recordHeading: 'A record month puts the building envelope in focus',
    recordText: 'AEMET reported that August 2026 was the warmest August in the Balearic Islands since the series began in 1961. The regional average temperature reached 28.3 °C, 2.7 °C above the reference average. Pollença reached 41.9 °C during the month.',
    stats: [['28.3 °C','AVERAGE TEMPERATURE','Balearic Islands','sun'],['+2.7 °C','ABOVE REFERENCE','August average','thermometer'],['41.9 °C','PEAK TEMPERATURE','Pollença','sun-hot'],['1961','RECORD SERIES BEGAN','AEMET','archive']],
    sourceLabel: 'Read the official AEMET climatological summary',
    coolingHeading: 'Air conditioning treats the heat. It does not stop it entering.',
    cooling: ['When roofs, walls, glazing and junctions allow large heat gains, cooling systems must continuously compensate. A more powerful air-conditioning unit can lower indoor temperature, but it does not correct an inefficient building envelope.','Before simply adding more cooling capacity, it is worth understanding where the property gains heat and which improvements make technical sense.'],
    callout: 'The objective is not to eliminate air conditioning. It is to reduce avoidable heat gains so the cooling system has an easier job.',
    roofHeading: 'The roof is one of the first places to investigate',
    roof: ['A roof receives intense solar exposure for hours. In poorly insulated properties, that heat can migrate toward the rooms below and continue affecting comfort after the outdoor temperature begins to fall.','When a traditional tiled roof is already due for renovation, insulation, airtightness, waterproofing and ventilation details should be considered as one coherent roof build-up rather than as separate interventions.'],
    roofLinks: [['Explore roof renovation','/en/roof-renovation-mallorca/'],['Traditional Mallorcan roof system','/technical-library/en/traditional-mallorcan-roof/']],
    facadeHeading: 'External insulation can reduce heat flow through exposed walls',
    facade: ['ETICS/SATE adds a continuous insulation layer to the outside of the building. Correctly designed and installed, it can reduce thermal bridges and slow heat transfer through the external walls while also improving winter comfort.','It is not a universal solution for every property. Orientation, existing construction, moisture behaviour, façade condition and architectural constraints should be assessed first.'],
    facadeLinks: [['Explore façades & ETICS','/en/facade-renovation-mallorca/'],['ETICS technical system','/technical-library/en/etics-external-wall-insulation/'],['ETICS quality guide','/guides/en/etics-installation-mistakes-mallorca/']],
    wholeHeading: 'The strongest strategy is usually a combination',
    whole: ['Summer comfort is rarely solved by one product. Depending on the property, the most effective renovation strategy may combine roof and façade insulation, solar control, efficient glazing, shading, controlled ventilation and correctly sized cooling. Solar PV can then help cover part of the electrical demand created by cooling.','The sequence matters: first understand the building, then reduce unnecessary heat gains, and finally size the active systems around the improved property.'],
    wholeItems: ['Roof insulation','Façade insulation','Efficient glazing','External shading','Controlled ventilation','Correctly sized cooling','Solar PV'],
    ctaEyebrow: 'TECHNICAL PROPERTY RENOVATION CHECK',
    ctaHeading: 'Is your Mallorca property prepared for hotter summers?',
    ctaText: 'EcoViva can assess the building envelope, visible risks and renovation priorities before you decide where to invest. The goal is a coherent plan – not isolated measures.',
    ctaLabel: 'Request a technical property check',
    ctaHref: '/en/technical-property-renovation-check-mallorca/',
    imageAlts: {thermometer:'Outdoor thermometer showing extreme summer heat in Mallorca',cooling:'Air conditioning working during intense summer heat in a Mallorca villa',roof:'Traditional Mallorcan tiled roof renovation with continuous insulation',facade:'EcoViva installer applying an external insulation system to a Mallorca property'}
  },
  es: {
    lang: 'es', locale: 'es_ES',
    title: 'El agosto más cálido de Mallorca: por qué aislar importa | EcoViva',
    description: 'Agosto de 2026 fue el agosto más cálido en Baleares desde 1961. Descubre cómo cubierta, fachada, vidrio y sombra afectan al confort en verano.',
    eyebrow: 'CALOR RÉCORD · AGOSTO DE 2026',
    h1: 'Mallorca acaba de registrar su agosto más cálido',
    lead: 'A medida que los veranos de Mallorca exigen más a los edificios, el aislamiento deja de ser una cuestión exclusivamente invernal. La cubierta y la fachada también determinan la rapidez con la que entra el calor y el esfuerzo que necesita el aire acondicionado para expulsarlo.',
    date: 'Publicado el 6 de septiembre de 2026',
    recordEyebrow: 'AGOSTO DE 2026 · AEMET',
    recordHeading: 'Un mes récord pone el foco en la envolvente del edificio',
    recordText: 'AEMET informó de que agosto de 2026 fue el agosto más cálido en las Illes Balears desde el inicio de la serie en 1961. La temperatura media regional alcanzó 28,3 °C, 2,7 °C por encima del promedio de referencia. En Pollença se registraron 41,9 °C durante el mes.',
    stats: [['28,3 °C','TEMPERATURA MEDIA','Illes Balears','sun'],['+2,7 °C','SOBRE LA REFERENCIA','Media de agosto','thermometer'],['41,9 °C','TEMPERATURA MÁXIMA','Pollença','sun-hot'],['1961','INICIO DE LA SERIE','AEMET','archive']],
    sourceLabel: 'Consultar el avance climatológico oficial de AEMET',
    coolingHeading: 'El aire acondicionado combate el calor. No impide que entre.',
    cooling: ['Cuando cubiertas, muros, acristalamientos y encuentros permiten grandes ganancias térmicas, los sistemas de refrigeración deben compensarlas continuamente. Un equipo de aire acondicionado más potente puede bajar la temperatura interior, pero no corrige una envolvente ineficiente.','Antes de añadir simplemente más potencia de refrigeración, conviene entender por dónde gana calor la vivienda y qué mejoras tienen sentido técnico.'],
    callout: 'El objetivo no es eliminar el aire acondicionado, sino reducir las ganancias de calor evitables para que el sistema trabaje con menos esfuerzo.',
    roofHeading: 'La cubierta es uno de los primeros puntos que conviene investigar',
    roof: ['Una cubierta recibe una intensa radiación solar durante horas. En viviendas mal aisladas, ese calor puede avanzar hacia las estancias inferiores y seguir afectando al confort incluso cuando la temperatura exterior empieza a bajar.','Si una cubierta tradicional de teja ya necesita una reforma, el aislamiento, la estanqueidad al aire, la impermeabilización y la ventilación deben plantearse como una sola solución constructiva coherente y no como intervenciones separadas.'],
    roofLinks: [['Ver reforma de cubiertas','/es/reforma-cubierta-mallorca/'],['Sistema tradicional de cubierta mallorquina','/technical-library/es/traditional-mallorcan-roof/']],
    facadeHeading: 'El aislamiento exterior puede reducir el flujo de calor a través de los muros expuestos',
    facade: ['Un sistema SATE/ETICS incorpora una capa continua de aislamiento por el exterior del edificio. Bien diseñado y ejecutado, puede reducir puentes térmicos y ralentizar la transmisión de calor a través de los muros, además de mejorar el confort en invierno.','No es una solución universal para todas las viviendas. Antes hay que valorar la orientación, la construcción existente, el comportamiento frente a la humedad, el estado de la fachada y las limitaciones arquitectónicas.'],
    facadeLinks: [['Ver fachadas y SATE','/es/reforma-fachada-mallorca/'],['Sistema técnico SATE','/technical-library/es/sistema-sate-aislamiento-exterior/'],['Guía de calidad SATE','/guides/es/errores-instalacion-sate-mallorca/']],
    wholeHeading: 'La estrategia más sólida suele ser una combinación',
    whole: ['El confort de verano rara vez se resuelve con un único producto. Según la vivienda, la estrategia más eficaz puede combinar aislamiento de cubierta y fachada, control solar, acristalamiento eficiente, sombra, ventilación controlada y una refrigeración correctamente dimensionada. La energía solar fotovoltaica puede ayudar después a cubrir parte de la demanda eléctrica de la climatización.','El orden importa: primero se comprende el edificio, después se reducen las ganancias térmicas innecesarias y, por último, se dimensionan los sistemas activos para la vivienda mejorada.'],
    wholeItems: ['Aislamiento de cubierta','Aislamiento de fachada','Acristalamiento eficiente','Protección solar exterior','Ventilación controlada','Refrigeración dimensionada','Energía solar fotovoltaica'],
    ctaEyebrow: 'REVISIÓN TÉCNICA DE LA VIVIENDA Y LA REFORMA',
    ctaHeading: '¿Está preparada tu vivienda en Mallorca para veranos más calurosos?',
    ctaText: 'EcoViva puede evaluar la envolvente, los riesgos visibles y las prioridades de reforma antes de que decidas dónde invertir. El objetivo es un plan coherente, no medidas aisladas.',
    ctaLabel: 'Solicitar una revisión técnica',
    ctaHref: '/es/revision-tecnica-compra-reforma-mallorca/',
    imageAlts: {thermometer:'Termómetro exterior durante un episodio de calor extremo en Mallorca',cooling:'Aire acondicionado funcionando durante el calor intenso en una villa de Mallorca',roof:'Reforma de una cubierta tradicional mallorquina con aislamiento continuo',facade:'Instalador de EcoViva aplicando un sistema de aislamiento exterior en Mallorca'}
  },
  de: {
    lang: 'de', locale: 'de_DE',
    title: 'Mallorcas heißester August: Warum Dämmung wichtiger wird | EcoViva',
    description: 'August 2026 war der heißeste August auf den Balearen seit 1961. Erfahren Sie, wie Dach, Fassade, Verglasung und Verschattung den Sommerkomfort beeinflussen.',
    eyebrow: 'REKORDHITZE · AUGUST 2026',
    h1: 'Mallorca verzeichnete gerade seinen heißesten August',
    lead: 'Da Mallorcas Sommer die Gebäude immer stärker belasten, geht es bei Dämmung längst nicht mehr nur um Energieeffizienz im Winter. Dach und Fassade bestimmen auch, wie schnell Wärme ins Haus gelangt – und wie viel Arbeit die Klimaanlage leisten muss, um sie wieder abzuführen.',
    date: 'Veröffentlicht am 6. September 2026',
    recordEyebrow: 'AUGUST 2026 · AEMET',
    recordHeading: 'Ein Rekordmonat rückt die Gebäudehülle in den Mittelpunkt',
    recordText: 'Laut AEMET war der August 2026 der heißeste August auf den Balearen seit Beginn der Messreihe im Jahr 1961. Die regionale Mitteltemperatur erreichte 28,3 °C und lag damit 2,7 °C über dem Referenzmittel. In Pollença wurden im Laufe des Monats 41,9 °C gemessen.',
    stats: [['28,3 °C','MITTELTEMPERATUR','Balearen','sun'],['+2,7 °C','ÜBER DEM REFERENZWERT','Augustmittel','thermometer'],['41,9 °C','HÖCHSTTEMPERATUR','Pollença','sun-hot'],['1961','BEGINN DER MESSREIHE','AEMET','archive']],
    sourceLabel: 'Offizielle klimatologische Zusammenfassung von AEMET lesen',
    coolingHeading: 'Eine Klimaanlage kühlt die Wärme ab. Sie verhindert nicht, dass sie eindringt.',
    cooling: ['Wenn Dach, Außenwände, Verglasungen und Anschlüsse hohe Wärmeeinträge zulassen, muss die Kühlung diese laufend ausgleichen. Eine leistungsstärkere Klimaanlage kann die Raumtemperatur senken, behebt aber keine ineffiziente Gebäudehülle.','Bevor lediglich zusätzliche Kühlleistung installiert wird, sollte geklärt werden, wo das Gebäude Wärme aufnimmt und welche Verbesserungen technisch sinnvoll sind.'],
    callout: 'Das Ziel ist nicht, auf Klimatisierung zu verzichten. Vermeidbare Wärmeeinträge sollen reduziert werden, damit das Kühlsystem weniger leisten muss.',
    roofHeading: 'Das Dach gehört zu den ersten Bauteilen, die geprüft werden sollten',
    roof: ['Ein Dach ist über Stunden intensiver Sonneneinstrahlung ausgesetzt. Bei schlecht gedämmten Gebäuden kann diese Wärme in die darunterliegenden Räume wandern und den Komfort noch beeinträchtigen, wenn die Außentemperatur bereits sinkt.','Steht die Sanierung eines traditionellen Ziegeldachs ohnehin an, sollten Dämmung, Luftdichtheit, Abdichtung und Lüftungsdetails als ein zusammenhängender Dachaufbau geplant werden – nicht als voneinander getrennte Maßnahmen.'],
    roofLinks: [['Dachsanierung entdecken','/de/dachsanierung-mallorca/'],['Traditionelles mallorquinisches Dachsystem','/technical-library/de/traditional-mallorcan-roof/']],
    facadeHeading: 'Eine Außendämmung kann den Wärmestrom durch exponierte Wände reduzieren',
    facade: ['Ein WDVS/SATE ergänzt die Außenseite des Gebäudes um eine durchgehende Dämmschicht. Richtig geplant und ausgeführt, kann es Wärmebrücken reduzieren, den Wärmeeintrag durch Außenwände verlangsamen und zugleich den Winterkomfort verbessern.','Es ist keine Universallösung für jede Immobilie. Ausrichtung, vorhandene Konstruktion, Feuchteverhalten, Fassadenzustand und architektonische Vorgaben müssen zuerst geprüft werden.'],
    facadeLinks: [['Fassaden & WDVS entdecken','/de/fassadensanierung-mallorca/'],['Technisches WDVS-System','/technical-library/de/wdvs-aussendaemmung-putzfassade/'],['WDVS-Qualitätsratgeber','/guides/de/wdvs-ausfuehrungsfehler-mallorca/']],
    wholeHeading: 'Die wirksamste Strategie ist meist eine Kombination',
    whole: ['Sommerlicher Komfort lässt sich selten mit einem einzigen Produkt herstellen. Je nach Immobilie kann die sinnvollste Strategie Dach- und Fassadendämmung, Sonnenschutz, effiziente Verglasung, Verschattung, kontrollierte Lüftung und passend dimensionierte Kühlung kombinieren. Eine Photovoltaikanlage kann anschließend einen Teil des Strombedarfs der Kühlung abdecken.','Die Reihenfolge ist entscheidend: zuerst das Gebäude verstehen, dann unnötige Wärmeeinträge reduzieren und schließlich die aktiven Systeme auf die verbesserte Immobilie abstimmen.'],
    wholeItems: ['Dachdämmung','Fassadendämmung','Effiziente Verglasung','Außenliegender Sonnenschutz','Kontrollierte Lüftung','Passend dimensionierte Kühlung','Photovoltaik'],
    ctaEyebrow: 'TECHNISCHER IMMOBILIEN- UND SANIERUNGSCHECK',
    ctaHeading: 'Ist Ihre Immobilie auf Mallorca auf heißere Sommer vorbereitet?',
    ctaText: 'EcoViva kann Gebäudehülle, sichtbare Risiken und Sanierungsprioritäten prüfen, bevor Sie über Ihre Investitionen entscheiden. Das Ziel ist ein schlüssiges Gesamtkonzept – keine isolierten Einzelmaßnahmen.',
    ctaLabel: 'Technischen Immobiliencheck anfragen',
    ctaHref: '/de/technischer-immobiliencheck-renovierung-mallorca/',
    imageAlts: {thermometer:'Außenthermometer bei extremer Sommerhitze auf Mallorca',cooling:'Klimaanlage im Dauereinsatz während großer Sommerhitze in einer Villa auf Mallorca',roof:'Sanierung eines traditionellen mallorquinischen Ziegeldachs mit durchgehender Dämmung',facade:'EcoViva-Monteur beim Anbringen eines Außendämmsystems auf Mallorca'}
  }
};

const icon = kind => {
  if (kind === 'thermometer') return '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M26 12a6 6 0 0 1 12 0v25a13 13 0 1 1-12 0z"/><path d="M32 20v25"/><circle cx="32" cy="46" r="5"/></svg>';
  if (kind === 'archive') return '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M13 50h38M18 50V24h28v26M23 24v-8h18v8M24 33h5M35 33h5M24 41h5M35 41h5"/></svg>';
  const hot = kind === 'sun-hot';
  return `<svg viewBox="0 0 64 64" aria-hidden="true" class="${hot?'hot':''}"><circle cx="32" cy="32" r="11"/><path d="M32 7v7M32 50v7M7 32h7M50 32h7M14 14l5 5M45 45l5 5M50 14l-5 5M19 45l-5 5"/></svg>`;
};

const css = `<style>
:root{--ink:#11111f;--green:#477d38;--pale:#f5f4ed;--line:rgba(17,17,31,.13);--gold:#c57a19}.heat-guide{margin:0;background:#fff;color:var(--ink)}.heat-guide *{box-sizing:border-box}.heat-hero{position:relative;min-height:690px;margin-top:0;display:flex;align-items:flex-end;background:#31402d url('${hero}') center/cover no-repeat}.heat-hero:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,15,22,.88) 0%,rgba(12,15,22,.65) 48%,rgba(12,15,22,.12) 84%)}.heat-shell{width:min(1160px,calc(100% - 48px));margin:auto}.heat-hero-copy{position:relative;z-index:1;color:#fff;padding:92px 0 78px}.eyebrow{margin:0 0 14px;color:#b9d2a0;font-size:.78rem;font-weight:800;letter-spacing:.17em;text-transform:uppercase}.heat-hero h1{max-width:880px;margin:0 0 22px;color:#fff;font-size:clamp(2.8rem,5.5vw,5.6rem);line-height:.95}.heat-lead{max-width:760px;margin:0;font-size:1.15rem;line-height:1.72}.heat-date{display:block;margin-top:22px;color:rgba(255,255,255,.72);font-size:.88rem}.section{padding:76px 0;border-bottom:1px solid var(--line)}.section h2{margin:0 0 22px;font-size:clamp(2rem,3.8vw,3.55rem);line-height:1.05}.section p{font-size:1.04rem;line-height:1.76}.record-grid,.editorial-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(360px,.95fr);gap:54px;align-items:center}.editorial-grid.reverse .editorial-media{order:2}.editorial-media img{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;border-radius:22px}.editorial-copy{max-width:600px}.source-link,.link-row a{color:var(--green);font-weight:800}.source-link{display:inline-flex;margin-top:12px}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:38px}.stat{min-width:0;padding:24px 14px 22px;text-align:center;border:1px solid #e6e5dd;border-radius:18px;background:#fff}.stat svg{display:block;width:58px;height:58px;margin:0 auto 17px;fill:none;stroke:var(--green);stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.stat svg.hot{stroke:var(--gold)}.stat strong{display:block;font-size:clamp(1.8rem,3vw,2.8rem);line-height:1;white-space:nowrap}.stat b{display:block;min-height:2.4em;margin-top:16px;color:#6d7169;font-size:.75rem;line-height:1.2;letter-spacing:.11em}.stat span{display:block;margin-top:10px;color:#7d8179;font-size:.84rem}.callout{margin-top:28px;padding:26px 28px;border-left:4px solid var(--green);border-radius:0 14px 14px 0;background:var(--pale);color:#3d552d;font-size:1.2rem;font-weight:750;line-height:1.45}.link-row{display:flex;gap:13px;flex-wrap:wrap;margin-top:26px}.link-row a{padding:11px 15px;border:1px solid rgba(71,125,56,.3);border-radius:999px;text-decoration:none}.whole{background:var(--pale)}.whole-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:60px;align-items:start}.systems{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;list-style:none;margin:4px 0 0;padding:0}.systems li{padding:16px 18px;border-radius:12px;background:#fff;border:1px solid #e5e3da;font-weight:750}.systems li:before{content:"✓";color:var(--green);margin-right:9px}.final-cta{padding:86px 0;background:var(--ink);color:#fff}.final-cta h2{max-width:850px;margin:0 0 20px;color:#fff;font-size:clamp(2.2rem,4.5vw,4.2rem);line-height:1.02}.final-cta p:not(.eyebrow){max-width:720px;font-size:1.08rem;line-height:1.7}.cta-button{display:inline-flex;margin-top:20px;padding:15px 23px;border-radius:999px;background:var(--green);color:#fff;text-decoration:none;font-weight:850}@media(max-width:850px){.heat-hero{min-height:610px;margin-top:0;background-position:58% center}.heat-shell{width:min(100% - 34px,1160px)}.heat-hero-copy{padding:70px 0 58px}.section{padding:54px 0}.record-grid,.editorial-grid,.whole-grid{grid-template-columns:1fr;gap:30px}.editorial-grid.reverse .editorial-media{order:0}.stats{grid-template-columns:repeat(2,1fr)}.systems{grid-template-columns:1fr}}@media(max-width:480px){.heat-hero h1{font-size:2.65rem}.heat-lead{font-size:1rem}.stats{grid-template-columns:1fr 1fr;gap:10px}.stat{padding:19px 8px}.stat svg{width:45px;height:45px;margin-bottom:13px}.stat strong{font-size:1.65rem}.stat b{font-size:.63rem}.editorial-media img{border-radius:16px}.link-row{align-items:stretch}.link-row a{width:100%}}
</style>`;

function links(rows){return `<div class="link-row">${rows.map(([label,href])=>`<a href="${href}">${label} <span aria-hidden="true">→</span></a>`).join('')}</div>`}

function page(lang,c){
  const url=`${base}${routes[lang]}`;
  const alternates=Object.entries(routes).map(([l,r])=>`<link rel="alternate" hreflang="${l}" href="${base}${r}">`).join('');
  const stats=c.stats.map(([value,label,note,kind])=>`<article class="stat">${icon(kind)}<strong>${value}</strong><b>${label}</b><span>${note}</span></article>`).join('');
  const schema={'@context':'https://schema.org','@type':'Article',headline:c.h1,description:c.description,inLanguage:lang,datePublished:published,dateModified:published,author:{'@type':'Organization',name:'EcoViva Mallorca'},publisher:{'@type':'Organization',name:'EcoViva Mallorca'},mainEntityOfPage:url,image:`${base}${hero}`,citation:source};
  const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'EcoViva Mallorca',item:`${base}/${lang}/`},{'@type':'ListItem',position:2,name:lang==='es'?'Guías':lang==='de'?'Ratgeber':'Guides',item:`${base}/guides/${lang}/`},{'@type':'ListItem',position:3,name:c.h1,item:url}]};
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${c.title}</title><meta name="description" content="${c.description}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${url}">${alternates}<link rel="alternate" hreflang="x-default" href="${base}${routes.en}"><meta property="og:type" content="article"><meta property="og:locale" content="${c.locale}"><meta property="og:title" content="${c.title}"><meta property="og:description" content="${c.description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${base}${hero}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${c.title}"><meta name="twitter:description" content="${c.description}"><meta name="twitter:image" content="${base}${hero}"><script type="application/ld+json">${JSON.stringify([schema,breadcrumb])}</script>${css}<link rel="stylesheet" href="/assets/shared-header.css?v=20260902-roof-facade-v1"><link rel="stylesheet" href="/assets/shared-footer.css?v=20260902-roof-facade-v1"><link rel="stylesheet" href="/assets/social-footer.css?v=20260906-v1"></head><body class="heat-guide"><header class="site-header shared-site-header"></header><main><section class="heat-hero"><div class="heat-shell heat-hero-copy"><p class="eyebrow">${c.eyebrow}</p><h1>${c.h1}</h1><p class="heat-lead">${c.lead}</p><time class="heat-date" datetime="${published}">${c.date}</time></div></section><section class="section"><div class="heat-shell"><div class="record-grid"><div><p class="eyebrow">${c.recordEyebrow}</p><h2>${c.recordHeading}</h2><p>${c.recordText}</p><a class="source-link" href="${source}" target="_blank" rel="noopener">${c.sourceLabel} →</a></div><div class="editorial-media"><img src="${assets}/mallorca-heat-thermometer.webp" alt="${c.imageAlts.thermometer}" width="1672" height="941"></div></div><div class="stats">${stats}</div></div></section><section class="section"><div class="heat-shell editorial-grid"><div class="editorial-media"><img src="${assets}/air-conditioning-heat-demand.webp" alt="${c.imageAlts.cooling}" width="1672" height="941" loading="lazy"></div><div class="editorial-copy"><h2>${c.coolingHeading}</h2>${c.cooling.map(p=>`<p>${p}</p>`).join('')}<aside class="callout">${c.callout}</aside></div></div></section><section class="section"><div class="heat-shell editorial-grid reverse"><div class="editorial-media"><img src="${assets}/mallorcan-roof-insulation.webp" alt="${c.imageAlts.roof}" width="1672" height="941" loading="lazy"></div><div class="editorial-copy"><h2>${c.roofHeading}</h2>${c.roof.map(p=>`<p>${p}</p>`).join('')}${links(c.roofLinks)}</div></div></section><section class="section"><div class="heat-shell editorial-grid"><div class="editorial-media"><img src="${assets}/ecoviva-etics-installer.webp" alt="${c.imageAlts.facade}" width="1536" height="1024" loading="lazy"></div><div class="editorial-copy"><h2>${c.facadeHeading}</h2>${c.facade.map(p=>`<p>${p}</p>`).join('')}${links(c.facadeLinks)}</div></div></section><section class="section whole"><div class="heat-shell whole-grid"><div><h2>${c.wholeHeading}</h2>${c.whole.map(p=>`<p>${p}</p>`).join('')}</div><ul class="systems">${c.wholeItems.map(x=>`<li>${x}</li>`).join('')}</ul></div></section><section class="final-cta"><div class="heat-shell"><p class="eyebrow">${c.ctaEyebrow}</p><h2>${c.ctaHeading}</h2><p>${c.ctaText}</p><a class="cta-button" href="${c.ctaHref}">${c.ctaLabel}</a></div></section></main><footer class="site-footer shared-site-footer"></footer><script src="/assets/shared-header.js?v=20260902-roof-facade-v1" defer></script></body></html>`;
}

for(const [lang,c] of Object.entries(content)){
  const out=path.join(pub,routes[lang],'index.html');
  await fs.mkdir(path.dirname(out),{recursive:true});
  await fs.writeFile(out,page(lang,c),'utf8');
}

const markerStart='<!-- SUMMER-HEAT-GUIDE:START -->';
const markerEnd='<!-- SUMMER-HEAT-GUIDE:END -->';
let sitemap=await fs.readFile(path.join(pub,'sitemap.xml'),'utf8');
sitemap=sitemap.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}\\n?`,'g'),'');
const hreflang=Object.entries(routes).map(([lang,route])=>`<xhtml:link rel="alternate" hreflang="${lang}" href="${base}${route}"/>`).join('');
const rows=Object.values(routes).map(route=>`  <url><loc>${base}${route}</loc><lastmod>${published}</lastmod>${hreflang}<xhtml:link rel="alternate" hreflang="x-default" href="${base}${routes.en}"/></url>`).join('\n');
sitemap=sitemap.replace('</urlset>',`${markerStart}\n${rows}\n${markerEnd}\n</urlset>`);
await fs.writeFile(path.join(pub,'sitemap.xml'),sitemap,'utf8');
console.log('Prepared Summer Heat Guide in EN/ES/DE.');
