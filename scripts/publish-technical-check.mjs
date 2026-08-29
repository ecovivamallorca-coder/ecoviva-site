import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const pub = path.join(root, 'public');
const base = 'https://www.ecoviva-mallorca.com';

const pages = {
  en: {
    slug: 'technical-property-renovation-check-mallorca',
    title: 'Technical Property & Renovation Check Mallorca | EcoViva',
    description: 'A practical technical property and renovation check in Mallorca for international buyers and owners who need clarity on risks, priorities and realistic next steps.',
    eyebrow: 'Before you buy · Before you renovate',
    h1: 'Know what the property may require before you commit.',
    lead: 'A practical on-site review for international buyers and owners who want technical and budgetary clarity before purchasing or planning a renovation in Mallorca.',
    cta: 'Request your technical check',
    secondary: 'How the check works',
    promise: 'Visible risks · Renovation priorities · Budget direction',
    whenTitle: 'Useful before a decision becomes expensive.',
    whenText: 'The check is designed for the moment when you need a grounded view of the building, but do not yet need a complete renovation proposal.',
    when: [
      ['Before purchasing', 'Understand visible technical concerns and likely renovation priorities before you take the next step.'],
      ['After purchasing', 'Turn a long list of ideas and defects into a practical order of priorities.'],
      ['Before requesting quotations', 'Clarify what should be included so that later proposals are based on the same real scope.']
    ],
    includesTitle: 'What the check can cover',
    includesText: 'The scope is adapted to the property and your decision. Typical attention points include:',
    includes: ['Visible moisture and water-entry risks', 'Roofs, terraces, façades and external openings', 'Insulation, overheating and comfort issues', 'Likely renovation interfaces and priorities', 'Available photos, plans and project information', 'A realistic recommendation for the next step'],
    processTitle: 'A clear route from uncertainty to action.',
    process: [
      ['01', 'Share the context', 'Tell us whether you are buying, already own the property or are preparing a renovation. Send the information already available.'],
      ['02', 'Review the property', 'We visit the property and focus on the conditions most relevant to your intended decision and renovation plans.'],
      ['03', 'Receive direction', 'You receive a concise summary of priorities, risks and the appropriate next step: proceed, investigate further or prepare a renovation scope.']
    ],
    priceTitle: 'A focused professional review — normally €150–€300.',
    priceText: 'The exact fee is confirmed in advance and depends on location, property size and scope. If the related renovation is entrusted to EcoViva, the check fee can be credited against the project.',
    afterTitle: 'The check is the starting point. EcoViva can also deliver the renovation.',
    afterText: 'When the property needs work, EcoViva can define the solution, prepare a coordinated proposal, appoint the appropriate specialists and remain your central point of contact through execution and handover.',
    note: 'This practical visual review is not a legal due-diligence report, destructive investigation or structural engineer’s report. Where specialist or statutory advice is needed, we identify that as the next step.',
    faqTitle: 'Questions before booking',
    faqs: [
      ['Is this only for buyers?', 'No. It is also useful for owners who need clarity before prioritising or budgeting a renovation.'],
      ['Will I receive a renovation quotation?', 'Not automatically. The check first clarifies the likely scope and priorities. A coordinated EcoViva proposal can follow when appropriate.'],
      ['Can EcoViva inspect anywhere in Mallorca?', 'Yes, subject to the property, scope and scheduling. The fee is confirmed before the visit.']
    ],
    finalTitle: 'Make the next property decision with more clarity.',
    finalText: 'Share the property, location and decision you are facing. EcoViva will review the request personally and confirm the suitable next step.',
    homeEyebrow: 'Technical property & renovation check',
    homeTitle: 'Buying or renovating?<br><em>Know what you are taking on.</em>',
    homeText: 'A focused on-site review of visible risks, renovation priorities and realistic next steps — normally €150–€300 and creditable if EcoViva carries out the related renovation.',
    homeLink: 'Explore the technical check'
  },
  es: {
    slug: 'revision-tecnica-compra-reforma-mallorca',
    title: 'Revisión técnica de compra y reforma en Mallorca | EcoViva',
    description: 'Revisión técnica práctica para compradores y propietarios internacionales que necesitan claridad sobre riesgos, prioridades y próximos pasos antes de comprar o reformar en Mallorca.',
    eyebrow: 'Antes de comprar · Antes de reformar',
    h1: 'Conoce lo que puede necesitar la propiedad antes de comprometerte.',
    lead: 'Una revisión práctica in situ para compradores y propietarios internacionales que buscan claridad técnica y presupuestaria antes de comprar o planificar una reforma en Mallorca.',
    cta: 'Solicita tu revisión técnica',
    secondary: 'Cómo funciona',
    promise: 'Riesgos visibles · Prioridades de reforma · Orientación presupuestaria',
    whenTitle: 'Útil antes de que una decisión resulte costosa.',
    whenText: 'La revisión está pensada para el momento en que necesitas una visión fundamentada del edificio, pero aún no una propuesta completa de reforma.',
    when: [
      ['Antes de comprar', 'Comprende los problemas técnicos visibles y las prioridades probables antes de dar el siguiente paso.'],
      ['Después de comprar', 'Convierte una larga lista de ideas y defectos en un orden práctico de prioridades.'],
      ['Antes de pedir presupuestos', 'Aclara qué debe incluirse para que las propuestas posteriores partan del mismo alcance real.']
    ],
    includesTitle: 'Qué puede incluir la revisión',
    includesText: 'El alcance se adapta a la propiedad y a tu decisión. Los puntos habituales incluyen:',
    includes: ['Humedad visible y riesgos de entrada de agua', 'Cubiertas, terrazas, fachadas y huecos exteriores', 'Aislamiento, sobrecalentamiento y confort', 'Encuentros técnicos y prioridades de reforma', 'Fotos, planos e información disponible', 'Recomendación realista del siguiente paso'],
    processTitle: 'Un recorrido claro desde la incertidumbre hasta la acción.',
    process: [
      ['01', 'Comparte el contexto', 'Indica si estás comprando, ya eres propietario o preparas una reforma. Envíanos la información disponible.'],
      ['02', 'Revisamos la propiedad', 'Visitamos la propiedad y nos centramos en las condiciones más relevantes para tu decisión y tus planes.'],
      ['03', 'Recibe orientación', 'Recibes un resumen conciso de prioridades, riesgos y el siguiente paso adecuado: avanzar, investigar o preparar el alcance.']
    ],
    priceTitle: 'Una revisión profesional enfocada — normalmente entre 150 y 300 €.',
    priceText: 'La tarifa exacta se confirma previamente y depende de la ubicación, el tamaño y el alcance. Si EcoViva realiza la reforma relacionada, el coste de la revisión puede descontarse del proyecto.',
    afterTitle: 'La revisión es el comienzo. EcoViva también puede ejecutar la reforma.',
    afterText: 'Cuando la propiedad necesita obras, EcoViva puede definir la solución, preparar una propuesta coordinada, seleccionar a los especialistas y seguir siendo tu punto de contacto hasta la entrega.',
    note: 'Esta revisión visual práctica no sustituye una due diligence legal, una investigación destructiva ni un informe de ingeniería estructural. Si se requiere un especialista o trámite oficial, lo indicamos como siguiente paso.',
    faqTitle: 'Preguntas antes de reservar',
    faqs: [
      ['¿Es solo para compradores?', 'No. También es útil para propietarios que necesitan claridad antes de priorizar o presupuestar una reforma.'],
      ['¿Recibiré un presupuesto de reforma?', 'No automáticamente. Primero se aclaran alcance y prioridades. Después puede prepararse una propuesta coordinada de EcoViva.'],
      ['¿EcoViva revisa propiedades en toda Mallorca?', 'Sí, según la propiedad, el alcance y la planificación. La tarifa se confirma antes de la visita.']
    ],
    finalTitle: 'Toma la siguiente decisión con más claridad.',
    finalText: 'Comparte la propiedad, la ubicación y la decisión que tienes delante. EcoViva revisará la solicitud personalmente y confirmará el siguiente paso adecuado.',
    homeEyebrow: 'Revisión técnica de compra y reforma',
    homeTitle: '¿Vas a comprar o reformar?<br><em>Conoce lo que asumes.</em>',
    homeText: 'Una revisión enfocada in situ de riesgos visibles, prioridades y próximos pasos realistas — normalmente entre 150 y 300 €, descontables si EcoViva realiza la reforma relacionada.',
    homeLink: 'Descubre la revisión técnica'
  },
  de: {
    slug: 'technischer-immobiliencheck-renovierung-mallorca',
    title: 'Technischer Immobilien- & Renovierungscheck Mallorca | EcoViva',
    description: 'Praktischer technischer Immobiliencheck für internationale Käufer und Eigentümer, die vor Kauf oder Renovierung auf Mallorca Klarheit zu Risiken, Prioritäten und nächsten Schritten benötigen.',
    eyebrow: 'Vor dem Kauf · Vor der Renovierung',
    h1: 'Wissen Sie, was die Immobilie erfordern kann, bevor Sie sich festlegen.',
    lead: 'Eine praxisnahe Vor-Ort-Prüfung für internationale Käufer und Eigentümer, die vor dem Kauf oder der Renovierungsplanung auf Mallorca technische und budgetäre Klarheit wünschen.',
    cta: 'Technischen Check anfragen',
    secondary: 'So funktioniert der Check',
    promise: 'Sichtbare Risiken · Renovierungsprioritäten · Budgetorientierung',
    whenTitle: 'Hilfreich, bevor eine Entscheidung teuer wird.',
    whenText: 'Der Check ist für den Moment gedacht, in dem Sie eine fundierte Einschätzung des Gebäudes benötigen, aber noch kein vollständiges Renovierungsangebot.',
    when: [
      ['Vor dem Kauf', 'Erkennen Sie sichtbare technische Punkte und wahrscheinliche Renovierungsprioritäten vor dem nächsten Schritt.'],
      ['Nach dem Kauf', 'Bringen Sie eine lange Liste von Ideen und Mängeln in eine praktische Reihenfolge.'],
      ['Vor Angeboten', 'Klären Sie den notwendigen Umfang, damit spätere Angebote auf derselben realistischen Grundlage beruhen.']
    ],
    includesTitle: 'Was der Check umfassen kann',
    includesText: 'Der Umfang wird an die Immobilie und Ihre Entscheidung angepasst. Typische Prüfpunkte sind:',
    includes: ['Sichtbare Feuchte- und Wassereintrittsrisiken', 'Dächer, Terrassen, Fassaden und Außenöffnungen', 'Dämmung, Überhitzung und Komfort', 'Technische Schnittstellen und Prioritäten', 'Vorhandene Fotos, Pläne und Projektinformationen', 'Realistische Empfehlung für den nächsten Schritt'],
    processTitle: 'Ein klarer Weg von Unsicherheit zu Handlung.',
    process: [
      ['01', 'Kontext teilen', 'Sagen Sie uns, ob Sie kaufen, bereits Eigentümer sind oder eine Renovierung vorbereiten, und senden Sie vorhandene Informationen.'],
      ['02', 'Immobilie prüfen', 'Wir besichtigen die Immobilie und konzentrieren uns auf die für Ihre Entscheidung und Renovierungspläne wichtigsten Bedingungen.'],
      ['03', 'Orientierung erhalten', 'Sie erhalten eine kompakte Zusammenfassung von Prioritäten, Risiken und dem passenden nächsten Schritt.']
    ],
    priceTitle: 'Eine fokussierte professionelle Prüfung — normalerweise 150–300 €.',
    priceText: 'Die genaue Gebühr wird vorab bestätigt und hängt von Lage, Größe und Umfang ab. Wird die zugehörige Renovierung EcoViva übertragen, kann die Check-Gebühr auf das Projekt angerechnet werden.',
    afterTitle: 'Der Check ist der Einstieg. EcoViva kann auch die Renovierung umsetzen.',
    afterText: 'Wenn Arbeiten erforderlich sind, kann EcoViva die Lösung definieren, ein koordiniertes Angebot vorbereiten, passende Spezialisten einsetzen und bis zur Ausführung und Übergabe Ihr zentraler Ansprechpartner bleiben.',
    note: 'Diese praxisnahe Sichtprüfung ersetzt keine rechtliche Due Diligence, zerstörende Untersuchung oder statische Begutachtung. Falls Fachgutachten oder behördliche Beratung erforderlich sind, benennen wir dies als nächsten Schritt.',
    faqTitle: 'Fragen vor der Buchung',
    faqs: [
      ['Ist der Check nur für Käufer?', 'Nein. Er ist auch für Eigentümer sinnvoll, die vor Priorisierung oder Budgetierung einer Renovierung Klarheit benötigen.'],
      ['Erhalte ich ein Renovierungsangebot?', 'Nicht automatisch. Zuerst werden Umfang und Prioritäten geklärt. Danach kann bei Bedarf ein koordiniertes EcoViva-Angebot folgen.'],
      ['Prüft EcoViva Immobilien auf ganz Mallorca?', 'Ja, abhängig von Immobilie, Umfang und Terminplanung. Die Gebühr wird vor dem Besuch bestätigt.']
    ],
    finalTitle: 'Treffen Sie die nächste Immobilienentscheidung mit mehr Klarheit.',
    finalText: 'Teilen Sie Immobilie, Standort und die anstehende Entscheidung mit. EcoViva prüft Ihre Anfrage persönlich und bestätigt den passenden nächsten Schritt.',
    homeEyebrow: 'Technischer Immobilien- & Renovierungscheck',
    homeTitle: 'Kaufen oder renovieren?<br><em>Wissen Sie, worauf Sie sich einlassen.</em>',
    homeText: 'Eine fokussierte Vor-Ort-Prüfung sichtbarer Risiken, Renovierungsprioritäten und realistischer nächster Schritte — normalerweise 150–300 €, anrechenbar bei anschließender EcoViva-Renovierung.',
    homeLink: 'Technischen Check entdecken'
  }
};

const urls = Object.fromEntries(Object.entries(pages).map(([lang, p]) => [lang, `/${lang}/${p.slug}/`]));

const sectionLabels = {
  en: ['EcoViva technical check', 'Scope', 'Process', 'Clear fee', 'From check to renovation', 'FAQ', 'Your interests first'],
  es: ['Revisión técnica EcoViva', 'Alcance', 'Proceso', 'Tarifa clara', 'De la revisión a la reforma', 'Preguntas frecuentes', 'Tus intereses primero'],
  de: ['Technischer EcoViva-Check', 'Leistungsumfang', 'Ablauf', 'Klare Gebühr', 'Vom Check zur Renovierung', 'Häufige Fragen', 'Ihre Interessen zuerst']
};

function list(items) { return items.map(x => `<li>${x}</li>`).join(''); }
function cards(items) { return items.map(([a,b,c]) => `<article class="check-card">${c ? `<span>${a}</span><h3>${b}</h3><p>${c}</p>` : `<h3>${a}</h3><p>${b}</p>`}</article>`).join(''); }
function alternates() { return Object.entries(urls).map(([lang,url]) => `<link rel="alternate" hreflang="${lang}" href="${base}${url}">`).join('') + `<link rel="alternate" hreflang="x-default" href="${base}${urls.en}">`; }

function render(lang, p) {
  const [overviewLabel, scopeLabel, processLabel, feeLabel, renovationLabel, faqLabel, interestsLabel] = sectionLabels[lang];
  const faqSchema = {'@context':'https://schema.org','@type':'FAQPage',mainEntity:p.faqs.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))};
  const serviceSchema = {'@context':'https://schema.org','@type':'Service',name:p.title.split('|')[0].trim(),provider:{'@type':'Organization',name:'EcoViva Mallorca SL',url:`${base}/${lang}/`},areaServed:{'@type':'Place',name:'Mallorca'},offers:{'@type':'Offer',priceCurrency:'EUR',lowPrice:'150',highPrice:'300'}};
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${p.title}</title><meta name="description" content="${p.description}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${base}${urls[lang]}">${alternates()}<meta property="og:type" content="website"><meta property="og:site_name" content="EcoViva Mallorca"><meta property="og:title" content="${p.title}"><meta property="og:description" content="${p.description}"><meta property="og:url" content="${base}${urls[lang]}"><meta property="og:image" content="${base}/assets/website-preview/studio-plan-review.webp"><link rel="icon" href="/favicon/favicon.png"><link rel="stylesheet" href="/assets/technical-check.css?v=20260829-1"><script type="application/ld+json">${JSON.stringify(serviceSchema)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script></head><body><header class="site-header"></header><main><section class="check-hero"><div class="check-shell check-hero-grid"><div><p class="check-eyebrow">${p.eyebrow}</p><h1>${p.h1}</h1><p class="check-lead">${p.lead}</p><div class="check-actions"><a class="check-button" href="/${lang}/?request_type_code=TECHNICAL_CHECK#renovation-request">${p.cta}</a><a class="check-button check-button-ghost" href="#process">${p.secondary}</a></div></div><aside><small>EcoViva Mallorca</small><strong>${p.promise}</strong></aside></div></section><section class="check-signal"><div class="check-shell"><span>${p.promise}</span></div></section><section class="check-section check-white"><div class="check-shell"><div class="check-heading"><p class="check-eyebrow">${overviewLabel}</p><h2>${p.whenTitle}</h2><p>${p.whenText}</p></div><div class="check-grid">${cards(p.when)}</div></div></section><section class="check-section"><div class="check-shell check-two"><div><p class="check-eyebrow">${scopeLabel}</p><h2>${p.includesTitle}</h2><p>${p.includesText}</p></div><ul class="check-list">${list(p.includes)}</ul></div></section><section class="check-section check-dark" id="process"><div class="check-shell"><div class="check-heading"><p class="check-eyebrow">${processLabel}</p><h2>${p.processTitle}</h2></div><div class="check-grid">${cards(p.process)}</div></div></section><section class="check-section check-white"><div class="check-shell check-price"><div><p class="check-eyebrow">${feeLabel}</p><h2>${p.priceTitle}</h2><p>${p.priceText}</p></div><div><p class="check-eyebrow">${renovationLabel}</p><h2>${p.afterTitle}</h2><p>${p.afterText}</p></div></div><p class="check-shell check-note">${p.note}</p></section><section class="check-section"><div class="check-shell"><div class="check-heading"><p class="check-eyebrow">${faqLabel}</p><h2>${p.faqTitle}</h2></div><div class="check-faq">${p.faqs.map(([q,a])=>`<article><h3>${q}</h3><p>${a}</p></article>`).join('')}</div></div></section><section class="check-final"><div class="check-shell"><p class="check-eyebrow">${interestsLabel}</p><h2>${p.finalTitle}</h2><p>${p.finalText}</p><a class="check-button" href="/${lang}/?request_type_code=TECHNICAL_CHECK#renovation-request">${p.cta}</a></div></section></main><footer class="site-footer"></footer></body></html>`;
}

for (const [lang,p] of Object.entries(pages)) {
  const dir = path.join(pub, lang, p.slug);
  await fs.mkdir(dir, {recursive:true});
  await fs.writeFile(path.join(dir,'index.html'), render(lang,p));
  const homePath = path.join(pub,lang,'index.html');
  let home = await fs.readFile(homePath,'utf8');
  home = home.replace(/\/assets\/website-preview\.css\?v=[^"']+/g,'/assets/website-preview.css?v=20260829-technical-check-v1');
  home = home.replace(/<!-- TECHNICAL-CHECK:START -->[\s\S]*?<!-- TECHNICAL-CHECK:END -->/g,'');
  const block = `<!-- TECHNICAL-CHECK:START --><section class="technical-check-home" aria-labelledby="technical-check-home-title"><div class="shell technical-check-home-grid"><div><p class="eyebrow">${p.homeEyebrow}</p><h2 id="technical-check-home-title">${p.homeTitle}</h2></div><div><p>${p.homeText}</p><a class="button button-dark" href="${urls[lang]}">${p.homeLink} →</a></div></div></section><!-- TECHNICAL-CHECK:END -->`;
  home = home.replace('<section class="section section-white" id="what-we-do"', `${block}<section class="section section-white" id="what-we-do"`);
  await fs.writeFile(homePath,home);
}

const smPath = path.join(pub,'sitemap.xml');
let sm = await fs.readFile(smPath,'utf8');
sm = sm.replace(/\s*<!-- TECHNICAL-CHECK-SITEMAP:START -->[\s\S]*?<!-- TECHNICAL-CHECK-SITEMAP:END -->\s*/g,'\n');
const sitemapRows = Object.entries(urls).map(([lang,url])=>`  <url><loc>${base}${url}</loc>${Object.entries(urls).map(([l,u])=>`<xhtml:link rel="alternate" hreflang="${l}" href="${base}${u}"/>`).join('')}${lang==='en'?`<xhtml:link rel="alternate" hreflang="x-default" href="${base}${urls.en}"/>`:''}</url>`).join('\n');
sm = sm.replace('</urlset>',`  <!-- TECHNICAL-CHECK-SITEMAP:START -->\n${sitemapRows}\n  <!-- TECHNICAL-CHECK-SITEMAP:END -->\n</urlset>`);
await fs.writeFile(smPath,sm);

console.log('Technical property check pages and homepage entries published in EN, ES and DE.');
