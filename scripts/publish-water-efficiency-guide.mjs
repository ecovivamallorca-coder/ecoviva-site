import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const pub = path.join(root, 'public');
const base = 'https://www.ecoviva-mallorca.com';
const published = '2026-09-05';
const hero = '/assets/guides/water-efficiency/water-smart-mallorca-hero-v2.webp';

const routes = {
  en: '/guides/en/water-efficient-renovation-mallorca/',
  es: '/guides/es/reforma-eficiente-agua-mallorca/',
  de: '/guides/de/wassersparende-sanierung-mallorca/'
};

const content = {
  en: {
    lang: 'en', locale: 'en_GB',
    title: 'Water-Smart Renovation in Mallorca: 7 Decisions | EcoViva Mallorca',
    description: 'Renovating a property in Mallorca? Discover 7 practical ways to reduce water use, prevent leaks and plan pools and gardens more efficiently.',
    eyebrow: 'WATER-SMART RENOVATION MALLORCA',
    h1: 'Renovating in Mallorca: 7 Water-Smart Decisions for Property Owners',
    lead: 'Use the renovation moment to reveal hidden losses, reduce unnecessary consumption and leave the property easier to control and maintain.',
    date: 'Published 5 September 2026',
    primary: ['Request a technical property check', '/en/technical-property-renovation-check-mallorca/'],
    secondary: ['See how EcoViva works', '/en/#how-we-work'],
    introHeading: 'Make water part of the renovation plan—not an afterthought.',
    intro: [
      'Water is becoming a more important design factor for properties in Mallorca. Recent reporting indicates that desalinated water now represents a large share of the water supplied by ABAQUA on the island, while continued pool construction and water-intensive gardens are adding to demand.',
      'For homeowners, this is not a reason for panic or fashionable “eco” additions. It is a reason to make better technical decisions during a renovation. The right measures can reduce consumption, reveal hidden losses and make a home easier and less expensive to operate.',
      'Here are seven decisions worth taking before work begins.'
    ],
    before: 'BEFORE WORK BEGINS',
    decisions: [
      ['Inspect the existing water installation before closing walls', 'Older properties may contain mixed pipe materials, ageing connections, poorly documented routes or repairs from different periods. A small concealed leak can remain unnoticed until it causes damp patches, damaged finishes or an unusually high water bill.', 'Before replastering or installing new floors, identify the pipe routes, check visible connections and test the system where appropriate. Renovating finishes without first understanding the installation can hide a problem that becomes expensive to reach later.'],
      ['Divide the installation into controllable zones', 'A clear distribution system with accessible shut-off valves makes maintenance easier. Bathrooms, kitchens, irrigation and pool installations should not depend on one inaccessible main valve wherever a better layout is practical.', 'Zoning does not save water by itself, but it makes leaks easier to isolate, reduces disruption during repairs and improves control of the property.'],
      ['Choose efficient fixtures without sacrificing comfort', 'Low-flow taps and shower fittings, dual-flush toilets and properly selected appliances can reduce daily consumption. Performance depends on water pressure, pipe sizing, hot-water production and the needs of the occupants.', 'Choose equipment as part of one system rather than buying isolated products based only on a label.'],
      ['Treat the pool as a technical installation', 'A pool loses water through evaporation, splashing, filter cleaning and sometimes undetected leaks. During a renovation, review the basin, pipework, filtration, overflow details, automatic filling and the possibility of using a suitable cover.', 'An unexplained drop in water level should be investigated, not accepted as normal. A cover and well-managed filtration can help, but they do not compensate for a leaking installation.'],
      ["Design the garden for Mallorca's climate", 'Large lawns and plants with high irrigation needs can place a heavy load on water use. A Mediterranean garden can remain attractive with climate-suitable planting, shaded soil, mulching, drip irrigation and hydrozones that group plants according to their needs.', 'Irrigation should respond to the season and actual conditions. Poorly positioned sprinklers and fixed schedules often water paving, walls or already-wet soil.'],
      ['Assess rainwater and reuse options early', 'Depending on the property, roof layout, available space and applicable rules, collected rainwater may be useful for selected non-potable purposes. Some projects may also justify a professionally designed greywater system.', 'These systems need space, separation, filtration, maintenance and correct technical and legal assessment. They should be planned at the start of a renovation—not improvised after the bathrooms and landscaping are complete.'],
      ['Measure consumption and make problems visible', 'A water meter is most useful when someone actually monitors it. Sub-metering, leak alerts or smart monitoring can make abnormal consumption visible before it becomes major damage. Even a simple periodic reading can reveal changes.', 'Record a baseline, compare occupied and unoccupied periods and investigate unexplained use. Technology helps, but a clear response plan is just as important as the alert itself.']
    ],
    coordinatedHeading: 'One coordinated plan is better than seven isolated products',
    coordinated: ['Water efficiency is connected to the bathroom layout, hot-water system, garden, pool, roof drainage and maintenance access. The best moment to coordinate these elements is before quotations are final and finishes have been ordered.', 'EcoViva can review the existing property, identify priorities and translate them into a practical scope for contractors. We do not promise that every measure suits every building. We help determine which interventions are technically sensible for this property, its use and its renovation budget.'],
    mallorca: 'MALLORCA',
    mallorcaHeading: 'Designed around island conditions and the way the property is used.',
    mallorcaText: 'A permanently occupied home, a holiday property, a rural finca and a villa with a pool do not have the same water profile. Location, occupancy, storage, pressure, garden area and existing installations must be considered together. EcoViva assesses the real property instead of applying a generic checklist without context.',
    processHeading: 'From first inspection to a coordinated scope.',
    process: [['Share the context', 'Tell us about the property, its use, known problems and planned renovation.'], ['Review the installation', 'We inspect accessible pipework, fixtures, pool and irrigation interfaces and visible signs of loss or moisture.'], ['Define priorities', 'We distinguish urgent defects, sensible upgrades and optional future measures.'], ['Coordinate the scope', 'The agreed measures are included in one clear renovation scope before quotations and finishes are final.'], ['Follow execution', 'Relevant interfaces and completion points are checked during the works.']],
    relatedHeading: 'Continue from water use to the systems behind the property.',
    related: [['Damp and moisture problems in Mallorca', '/guides/en/damp-moisture-mallorca/'], ['Roof renovation in Mallorca', '/en/roof-renovation-mallorca/'], ['Technical property renovation check', '/en/technical-property-renovation-check-mallorca/'], ['Façades & ETICS in Mallorca', '/en/facade-renovation-mallorca/']],
    faqHeading: 'Water-smart renovation: frequently asked questions',
    faq: [['Do all older properties need completely new water pipes?', 'No. Age alone does not determine the solution. Materials, condition, accessibility, previous repairs and the planned works should be assessed before deciding between local repairs and wider replacement.'], ['Is a pool cover enough to stop excessive water loss?', 'A suitable cover can reduce evaporation, but it cannot correct leaking pipework, a defective basin, unsuitable overflow details or poor filtration management. Unexplained loss should be investigated.'], ['Can rainwater always be reused in a Mallorca property?', 'No. Feasibility depends on roof collection area, available storage, intended use, maintenance and applicable technical and municipal requirements. It should be assessed for the individual property.'], ['Can EcoViva include these measures in a larger renovation?', 'Yes. Water-related improvements can be coordinated with bathrooms, roofs, terraces, landscaping, pool works and other renovation packages so that interfaces are resolved before execution.'], ['Planning a renovation in Mallorca?', 'Ask EcoViva for a technical property review before work begins. You receive a clear assessment of risks, priorities and practical next steps—without unnecessary interventions.']],
    sources: 'Sources & local context',
    sourceTexts: ['Majorca Daily Bulletin · ABAQUA water supply · 2 September 2026', 'Cadena SER Mallorca · Terraferida pool analysis · 31 August 2026', 'Última Hora · Serra de Tramuntana water-security investment · 3 September 2026'],
    closing: 'Make water performance part of the plan before work begins.',
    closingText: 'Tell us how the property is used, what is being renovated and where you suspect losses or unnecessary consumption. Markus & Maritza will help define the appropriate next step.',
    closingCta: 'Request a technical property check'
  },
  es: {
    lang: 'es', locale: 'es_ES',
    title: 'Reforma eficiente en Mallorca: 7 decisiones sobre agua | EcoViva Mallorca',
    description: '¿Vas a reformar una vivienda en Mallorca? Descubre 7 medidas para reducir el consumo, evitar fugas y planificar mejor piscina y jardín.',
    eyebrow: 'REFORMA Y EFICIENCIA HÍDRICA EN MALLORCA',
    h1: 'Reformar en Mallorca: 7 decisiones para reducir el consumo de agua',
    lead: 'Aprovecha la reforma para detectar pérdidas, reducir consumos innecesarios y dejar una instalación más fácil de controlar y mantener.',
    date: 'Publicado el 5 de septiembre de 2026',
    primary: ['Solicitar una revisión técnica', '/es/revision-tecnica-compra-reforma-mallorca/'],
    secondary: ['Ver cómo trabaja EcoViva', '/es/#how-we-work'],
    introHeading: 'Integra el agua en el plan de reforma desde el principio.',
    intro: ['El agua se está convirtiendo en un criterio cada vez más importante al reformar una vivienda en Mallorca. Informaciones recientes señalan que el agua desalada ya representa una parte considerable del suministro de ABAQUA en la isla, mientras que la construcción de piscinas y los jardines de alto consumo siguen aumentando la demanda.', 'No se trata de alarmarse ni de añadir productos “ecológicos” sin criterio. Se trata de aprovechar la reforma para detectar pérdidas, reducir consumos innecesarios y dejar una instalación más fácil de controlar y mantener.', 'Estas son siete decisiones que conviene tomar antes de iniciar la obra.'],
    before: 'ANTES DE EMPEZAR',
    decisions: [
      ['Revisar la instalación antes de cerrar paredes y suelos', 'Muchas viviendas antiguas combinan tuberías de distintas épocas, conexiones envejecidas, recorridos poco documentados y reparaciones parciales. Una fuga pequeña y oculta puede pasar desapercibida hasta provocar humedades, daños en los acabados o facturas anormalmente altas.', 'Antes de enlucir, alicatar o colocar un pavimento nuevo, conviene localizar recorridos, revisar conexiones visibles y comprobar la instalación cuando proceda. Renovar solo la superficie puede ocultar un problema que después será mucho más caro alcanzar.'],
      ['Separar la instalación en zonas controlables', 'Una distribución clara y con llaves de corte accesibles facilita el mantenimiento. Siempre que la vivienda lo permita, baños, cocina, riego y piscina no deberían depender únicamente de una llave general difícil de localizar.', 'La sectorización no ahorra agua por sí sola, pero permite aislar una fuga, limita las molestias durante una reparación y mejora el control de la vivienda.'],
      ['Elegir grifería y aparatos eficientes sin perder confort', 'Aireadores, duchas de caudal reducido, inodoros de doble descarga y electrodomésticos bien elegidos pueden reducir el consumo diario. El resultado depende también de la presión, el diámetro de las tuberías, la producción de agua caliente y el uso real de la vivienda.', 'Conviene elegir los equipos como parte de un sistema y no como productos aislados seleccionados únicamente por una etiqueta.'],
      ['Tratar la piscina como una instalación técnica', 'Una piscina pierde agua por evaporación, salpicaduras, limpieza de filtros y, en algunos casos, fugas no detectadas. Durante la reforma hay que revisar el vaso, las tuberías, la filtración, los rebosaderos, el llenado automático y la viabilidad de una cubierta adecuada.', 'Una bajada de nivel inexplicable debe investigarse. Una cubierta y una filtración bien gestionada ayudan, pero no solucionan una instalación con fugas.'],
      ['Diseñar el jardín para el clima de Mallorca', 'El césped extenso y las especies con grandes necesidades de riego pueden elevar mucho el consumo. Un jardín mediterráneo puede seguir siendo atractivo utilizando plantas adaptadas, zonas de sombra, acolchado, riego por goteo e hidrosectorización según las necesidades de cada grupo de plantas.', 'El riego debe adaptarse a la estación y a las condiciones reales. Los aspersores mal orientados y los horarios fijos suelen regar pavimentos, muros o un suelo que todavía conserva humedad.'],
      ['Estudiar pronto la recogida y reutilización de agua', 'Según el inmueble, la cubierta, el espacio disponible y la normativa aplicable, el agua de lluvia puede aprovecharse para determinados usos no potables. Algunos proyectos también pueden justificar un sistema profesional de aguas grises.', 'Estas soluciones necesitan espacio, circuitos separados, filtración, mantenimiento y una evaluación técnica y normativa correcta. Deben estudiarse al principio de la reforma, no improvisarse cuando baños y jardín ya están terminados.'],
      ['Medir el consumo y hacer visibles las anomalías', 'Un contador resulta realmente útil cuando se controla. Los subcontadores, las alertas de fuga o la monitorización inteligente pueden detectar un consumo anormal antes de que se convierta en un daño importante. Incluso una lectura periódica sencilla permite observar cambios.', 'Conviene registrar un consumo de referencia, comparar los periodos con y sin ocupación e investigar cualquier uso inexplicable. La tecnología ayuda, pero también hace falta definir quién actuará cuando aparezca una alerta.']
    ],
    coordinatedHeading: 'Un plan coordinado funciona mejor que siete productos aislados',
    coordinated: ['La eficiencia hídrica está conectada con la distribución de los baños, el agua caliente, el jardín, la piscina, el drenaje de la cubierta y el acceso para mantenimiento. El mejor momento para coordinarlo todo es antes de cerrar los presupuestos y encargar los acabados.', 'EcoViva puede revisar el estado de la vivienda, identificar prioridades y convertirlas en un alcance de trabajo claro para los distintos profesionales. No todas las medidas son adecuadas para todos los edificios: analizamos qué intervenciones tienen sentido técnico para la vivienda, su uso y el presupuesto disponible.'],
    mallorca: 'MALLORCA',
    mallorcaHeading: 'Diseñado para las condiciones de la isla y el uso real de la vivienda.',
    mallorcaText: 'Una residencia habitual, una segunda vivienda, una finca rural y una villa con piscina no tienen el mismo perfil de consumo. La ubicación, la ocupación, el almacenamiento, la presión, el jardín y las instalaciones existentes deben estudiarse conjuntamente. EcoViva analiza la vivienda real, no aplica una lista genérica sin contexto.',
    processHeading: 'De la primera revisión a un alcance coordinado.',
    process: [['Compartir el contexto', 'Explícanos el uso de la vivienda, los problemas conocidos y la reforma prevista.'], ['Revisar la instalación', 'Inspeccionamos tuberías accesibles, aparatos, piscina, riego y señales visibles de pérdidas o humedad.'], ['Definir prioridades', 'Separamos defectos urgentes, mejoras recomendables y opciones futuras.'], ['Coordinar el alcance', 'Las medidas acordadas se integran en un plan claro antes de cerrar presupuestos y acabados.'], ['Seguir la ejecución', 'Controlamos las interfaces y puntos importantes durante la obra.']],
    relatedHeading: 'Del consumo de agua a los sistemas de la vivienda.',
    related: [['Humedades en Mallorca', '/guides/es/problemas-humedad-mallorca/'], ['Reforma de cubiertas en Mallorca', '/es/reforma-cubierta-mallorca/'], ['Revisión técnica de vivienda y reforma', '/es/revision-tecnica-compra-reforma-mallorca/'], ['Fachadas y SATE en Mallorca', '/es/reforma-fachada-mallorca/']],
    faqHeading: 'Reforma y agua: preguntas frecuentes',
    faq: [['¿Todas las viviendas antiguas necesitan renovar completamente las tuberías?', 'No. La edad por sí sola no determina la solución. Hay que valorar materiales, estado, accesibilidad, reparaciones anteriores y alcance de la reforma antes de decidir entre reparaciones locales o una sustitución más amplia.'], ['¿Una cubierta para la piscina evita todo el consumo excesivo?', 'Una cubierta adecuada puede reducir la evaporación, pero no corrige fugas en tuberías o vaso, rebosaderos mal resueltos ni una filtración mal gestionada. Cualquier pérdida inexplicable debe investigarse.'], ['¿Siempre se puede reutilizar el agua de lluvia?', 'No. Depende de la superficie de recogida, el espacio para almacenamiento, el uso previsto, el mantenimiento y los requisitos técnicos y municipales aplicables a la vivienda.'], ['¿Puede EcoViva integrar estas medidas en una reforma completa?', 'Sí. Las mejoras relacionadas con el agua pueden coordinarse con baños, cubiertas, terrazas, jardín, piscina y otras partidas para resolver correctamente todas las conexiones antes de ejecutar.'], ['¿Estás preparando una reforma en Mallorca?', 'Solicita una revisión técnica de la vivienda antes de comenzar. EcoViva te ayuda a definir riesgos, prioridades y próximos pasos prácticos, evitando intervenciones innecesarias.']],
    sources: 'Fuentes y contexto local',
    sourceTexts: ['Majorca Daily Bulletin · suministro de ABAQUA · 2 de septiembre de 2026', 'Cadena SER Mallorca · análisis de piscinas de Terraferida · 31 de agosto de 2026', 'Última Hora · inversión hídrica en la Serra de Tramuntana · 3 de septiembre de 2026'],
    closing: 'Integra el uso del agua en el proyecto antes de iniciar la obra.',
    closingText: 'Cuéntanos cómo se utiliza la vivienda, qué se va a reformar y dónde sospechas pérdidas o consumos innecesarios. Markus & Maritza te ayudarán a definir el siguiente paso.',
    closingCta: 'Solicitar una revisión técnica'
  },
  de: {
    lang: 'de', locale: 'de_DE',
    title: 'Wassersparend sanieren auf Mallorca: 7 Maßnahmen | EcoViva Mallorca',
    description: 'Sie renovieren eine Immobilie auf Mallorca? Sieben praktische Maßnahmen gegen Leckagen und für effiziente Bäder, Pools und Gärten.',
    eyebrow: 'WASSERBEWUSSTE SANIERUNG AUF MALLORCA',
    h1: 'Renovieren auf Mallorca: 7 Maßnahmen für einen geringeren Wasserverbrauch',
    lead: 'Nutzen Sie die Sanierung, um versteckte Verluste zu erkennen, unnötigen Verbrauch zu reduzieren und die Immobilie besser kontrollierbar zu machen.',
    date: 'Veröffentlicht am 5. September 2026',
    primary: ['Technische Objektprüfung anfragen', '/de/technischer-immobiliencheck-renovierung-mallorca/'],
    secondary: ['So arbeitet EcoViva', '/de/#how-we-work'],
    introHeading: 'Wasser von Anfang an in die Sanierungsplanung einbeziehen.',
    intro: ['Wasser wird bei der Sanierung von Immobilien auf Mallorca zu einem immer wichtigeren Planungsthema. Aktuelle Berichte zeigen, dass entsalztes Meerwasser bereits einen erheblichen Anteil der von ABAQUA auf der Insel bereitgestellten Wassermenge ausmacht. Gleichzeitig erhöhen neue Pools und bewässerungsintensive Gärten den Bedarf.', 'Das ist kein Grund für Panik oder für wahllos eingebaute „Öko“-Produkte. Es ist ein guter Grund, bei einer Sanierung technisch durchdachte Entscheidungen zu treffen. So lassen sich versteckte Verluste erkennen, unnötiger Verbrauch reduzieren und Betrieb sowie Wartung der Immobilie verbessern.', 'Diese sieben Punkte sollten vor Baubeginn geprüft werden.'],
    before: 'VOR BAUBEGINN',
    decisions: [
      ['Leitungen prüfen, bevor Wände und Böden geschlossen werden', 'In älteren Häusern finden sich häufig Rohrleitungen aus unterschiedlichen Bauphasen, gealterte Verbindungen, nicht dokumentierte Leitungswege und punktuelle Reparaturen. Eine kleine verdeckte Leckage kann lange unbemerkt bleiben, bis Feuchteschäden, beschädigte Oberflächen oder ungewöhnlich hohe Rechnungen auftreten.', 'Vor dem Verputzen, Fliesen oder Verlegen neuer Böden sollten Leitungswege und zugängliche Anschlüsse geprüft werden. Wo es sinnvoll ist, gehört auch eine technische Prüfung der Installation dazu. Neue Oberflächen über einer unbekannten Altinstallation können spätere Reparaturen unnötig verteuern.'],
      ['Die Installation in kontrollierbare Bereiche aufteilen', 'Eine klare Verteilung mit gut erreichbaren Absperrventilen erleichtert die Wartung. Wenn es die Immobilie zulässt, sollten Bäder, Küche, Bewässerung und Pooltechnik nicht ausschließlich von einem schwer zugänglichen Hauptventil abhängen.', 'Die Aufteilung spart nicht automatisch Wasser, macht Leckagen aber leichter eingrenzbar und reduziert die Beeinträchtigung bei Reparaturen.'],
      ['Wassersparende Armaturen passend zum System auswählen', 'Durchflussbegrenzte Armaturen und Duschen, Zweimengenspülungen und passend ausgewählte Haushaltsgeräte können den täglichen Verbrauch senken. Entscheidend sind jedoch auch Wasserdruck, Leitungsdimensionen, Warmwasserbereitung und die tatsächliche Nutzung.', 'Produkte sollten deshalb als Teil eines Gesamtsystems ausgewählt werden – nicht nur anhand eines einzelnen Effizienzlabels.'],
      ['Den Pool als technische Anlage behandeln', 'Ein Pool verliert Wasser durch Verdunstung, Spritzwasser, Filterreinigung und mitunter durch unerkannte Leckagen. Bei einer Sanierung sollten Becken, Rohrleitungen, Filterung, Überlauf, automatische Nachspeisung und eine geeignete Abdeckung geprüft werden.', 'Ein unerklärlicher Rückgang des Wasserstands ist kein normaler Dauerzustand und sollte untersucht werden. Eine Abdeckung und gut eingestellte Filtertechnik helfen, ersetzen aber keine Reparatur einer undichten Anlage.'],
      ['Den Garten für das Klima Mallorcas planen', 'Große Rasenflächen und Pflanzen mit hohem Bewässerungsbedarf können den Verbrauch stark erhöhen. Ein attraktiver mediterraner Garten lässt sich mit klimaangepassten Pflanzen, beschatteten Bodenflächen, Mulch, Tropfbewässerung und getrennten Bewässerungszonen gestalten.', 'Die Bewässerung sollte an Jahreszeit und tatsächliche Bedingungen angepasst werden. Schlecht ausgerichtete Sprinkler und starre Zeitpläne bewässern häufig Pflaster, Mauern oder noch feuchte Böden.'],
      ['Regenwassernutzung und Wiederverwendung früh prüfen', 'Je nach Gebäude, Dachfläche, verfügbarem Platz und geltenden Vorschriften kann gesammeltes Regenwasser für bestimmte Nicht-Trinkwasserzwecke geeignet sein. Bei manchen Projekten kann auch eine professionell geplante Grauwasseranlage sinnvoll sein.', 'Solche Systeme benötigen Platz, getrennte Leitungen, Filterung, Wartung sowie eine korrekte technische und rechtliche Bewertung. Sie gehören an den Anfang der Planung und sollten nicht erst nach Fertigstellung von Bädern und Außenanlagen improvisiert werden.'],
      ['Verbrauch messen und Abweichungen sichtbar machen', 'Ein Wasserzähler hilft vor allem dann, wenn seine Werte kontrolliert werden. Unterzähler, Leckagewarnungen oder intelligente Überwachung können ungewöhnlichen Verbrauch sichtbar machen, bevor ein großer Schaden entsteht. Auch regelmäßiges einfaches Ablesen kann Veränderungen aufdecken.', 'Ein Ausgangswert, der Vergleich bewohnter und unbewohnter Zeiträume und die Untersuchung unerklärlicher Verbräuche schaffen Klarheit. Technik ist hilfreich – ebenso wichtig ist ein klarer Plan, wer bei einer Warnung reagiert.']
    ],
    coordinatedHeading: 'Ein abgestimmtes Konzept ist besser als sieben Einzelprodukte',
    coordinated: ['Wassereffizienz hängt mit Badplanung, Warmwasserbereitung, Garten, Pool, Dachentwässerung und Wartungszugang zusammen. Der richtige Zeitpunkt zur Koordination liegt vor der endgültigen Vergabe und bevor Oberflächen bestellt werden.', 'EcoViva kann den Bestand prüfen, Prioritäten festlegen und daraus einen verständlichen Leistungsumfang für die beteiligten Fachbetriebe entwickeln. Nicht jede Maßnahme passt zu jedem Gebäude. Entscheidend ist, was für die konkrete Immobilie, ihre Nutzung und das verfügbare Budget technisch sinnvoll ist.'],
    mallorca: 'MALLORCA',
    mallorcaHeading: 'Auf die Bedingungen der Insel und die tatsächliche Nutzung abgestimmt.',
    mallorcaText: 'Ein dauerhaft bewohntes Haus, eine Ferienimmobilie, eine ländliche Finca und eine Villa mit Pool haben unterschiedliche Verbrauchsprofile. Lage, Belegung, Speicherung, Wasserdruck, Gartenfläche und vorhandene Installationen müssen gemeinsam betrachtet werden. EcoViva bewertet die konkrete Immobilie statt eine allgemeine Checkliste ohne Kontext anzuwenden.',
    processHeading: 'Von der ersten Prüfung zum koordinierten Leistungsumfang.',
    process: [['Kontext teilen', 'Beschreiben Sie Nutzung, bekannte Probleme und geplante Sanierung.'], ['Installation prüfen', 'Wir betrachten zugängliche Leitungen, Armaturen, Pool- und Bewässerungsschnittstellen sowie sichtbare Hinweise auf Verluste oder Feuchtigkeit.'], ['Prioritäten definieren', 'Dringende Mängel, sinnvolle Verbesserungen und spätere Optionen werden voneinander getrennt.'], ['Leistungsumfang koordinieren', 'Die vereinbarten Maßnahmen werden vor endgültiger Vergabe und Materialauswahl in einem klaren Sanierungsumfang zusammengeführt.'], ['Ausführung begleiten', 'Wichtige Schnittstellen und Fertigstellungspunkte werden während der Arbeiten kontrolliert.']],
    relatedHeading: 'Vom Wasserverbrauch zu den technischen Systemen der Immobilie.',
    related: [['Feuchteprobleme auf Mallorca', '/guides/de/feuchtigkeitsprobleme-mallorca/'], ['Dachsanierung auf Mallorca', '/de/dachsanierung-mallorca/'], ['Technische Immobilien- und Sanierungsprüfung', '/de/technischer-immobiliencheck-renovierung-mallorca/'], ['Fassaden & WDVS auf Mallorca', '/de/fassadensanierung-mallorca/']],
    faqHeading: 'Wassersparende Sanierung: häufige Fragen',
    faq: [['Müssen in jedem älteren Haus alle Wasserleitungen erneuert werden?', 'Nein. Das Alter allein entscheidet nicht. Materialien, Zustand, Zugänglichkeit, frühere Reparaturen und der geplante Sanierungsumfang sollten geprüft werden, bevor über lokale Reparaturen oder eine umfassendere Erneuerung entschieden wird.'], ['Reicht eine Poolabdeckung gegen hohen Wasserverlust aus?', 'Eine geeignete Abdeckung kann die Verdunstung reduzieren. Sie behebt jedoch keine undichten Leitungen, Schäden am Becken, ungeeignete Überlaufdetails oder eine schlecht gesteuerte Filterung. Unerklärliche Verluste sollten untersucht werden.'], ['Kann Regenwasser bei jeder Immobilie genutzt werden?', 'Nein. Entscheidend sind Sammelfläche, Speicherplatz, Verwendungszweck, Wartung sowie die geltenden technischen und kommunalen Anforderungen. Die Machbarkeit muss objektspezifisch geprüft werden.'], ['Kann EcoViva diese Maßnahmen in eine Gesamtsanierung integrieren?', 'Ja. Wasserbezogene Verbesserungen können mit Bädern, Dächern, Terrassen, Außenanlagen, Poolarbeiten und weiteren Gewerken koordiniert werden, damit Schnittstellen vor der Ausführung geklärt sind.'], ['Planen Sie eine Sanierung auf Mallorca?', 'Lassen Sie die Immobilie vor Baubeginn technisch prüfen. EcoViva unterstützt Sie dabei, Risiken, Prioritäten und sinnvolle nächste Schritte festzulegen – ohne unnötige Maßnahmen.']],
    sources: 'Quellen & lokaler Kontext',
    sourceTexts: ['Majorca Daily Bulletin · Wasserversorgung durch ABAQUA · 2. September 2026', 'Cadena SER Mallorca · Poolanalyse von Terraferida · 31. August 2026', 'Última Hora · Investitionen in die Wassersicherheit der Serra de Tramuntana · 3. September 2026'],
    closing: 'Wasserperformance planen, bevor die Arbeiten beginnen.',
    closingText: 'Beschreiben Sie uns die Nutzung der Immobilie, die geplanten Arbeiten und mögliche Verluste oder unnötige Verbräuche. Markus & Maritza helfen Ihnen, den passenden nächsten Schritt festzulegen.',
    closingCta: 'Technische Objektprüfung anfragen'
  }
};

const sourceUrls = [
  'https://www.majorcadailybulletin.com/news/local/2026/09/02/145433/more-than-than-half-the-water-agency-supply-mallorca-now-desalinated.html',
  'https://cadenaser.com/baleares/2026/08/31/terraferida-denuncia-la-construccion-de-10680-piscinas-en-mallorca-en-9-anos-radio-mallorca/',
  'https://www.ultimahora.es/noticias/local/2026/09/03/2701323/govern-destina-millones-ecotasa-seguridad-hidrica-serra-tramuntana.html'
];

const decisionImages = {
  0: {
    src: '/assets/guides/water-efficiency/water-installation-inspection.webp',
    alt: {
      en: 'Pressure testing and inspection of water pipes before a Mallorca renovation wall is closed',
      es: 'Prueba de presión y revisión de tuberías antes de cerrar una pared durante una reforma en Mallorca',
      de: 'Druckprüfung und Kontrolle von Wasserleitungen vor dem Schließen einer Wand bei einer Sanierung auf Mallorca'
    }
  },
  3: {
    src: '/assets/guides/water-efficiency/pool-cover-filtration-detail-v3.webp',
    alt: {
      en: 'Mallorca villa pool with a cover and accessible filtration installation',
      es: 'Piscina de una villa en Mallorca con cubierta e instalación de filtración accesible',
      de: 'Pool einer Mallorca-Villa mit Abdeckung und zugänglicher Filteranlage'
    }
  },
  5: {
    src: '/assets/guides/water-efficiency/mediterranean-garden-rainwater.webp',
    alt: {
      en: 'Mediterranean garden with drip irrigation and rainwater storage at a Mallorca property',
      es: 'Jardín mediterráneo con riego por goteo y depósito de agua de lluvia en una vivienda de Mallorca',
      de: 'Mediterraner Garten mit Tropfbewässerung und Regenwasserspeicher an einer Immobilie auf Mallorca'
    }
  }
};

const css = `<style>
.guide-page{background:#fff;color:#11111f}.guide-hero{position:relative;min-height:630px;display:flex;align-items:flex-end;background:#474940 url('${hero}') center/cover no-repeat;margin-top:84px}.guide-hero:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(17,17,31,.82),rgba(17,17,31,.62) 45%,rgba(17,17,31,.1) 80%)}.guide-hero-inner{position:relative;z-index:1;width:min(1120px,calc(100% - 48px));margin:0 auto;padding:78px 0;color:#fff}.guide-eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:.78rem;font-weight:700;color:#b9c78f}.guide-hero h1{max-width:880px;margin:.45rem 0 1rem;font-size:clamp(2.6rem,5vw,5rem);line-height:.98;color:#fff}.guide-lead{max-width:760px;font-size:1.12rem;line-height:1.72}.guide-date{display:block;margin-top:18px;color:rgba(255,255,255,.76);font-size:.88rem}.guide-shell{max-width:1120px;margin:auto;padding:0 24px}.guide-section{padding:64px 0;border-bottom:1px solid rgba(17,17,31,.12)}.guide-section h2{max-width:820px;font-size:clamp(2rem,3.3vw,3.1rem);line-height:1.08;margin-top:0}.guide-section p,.guide-section li{line-height:1.72}.guide-intro-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:54px}.guide-quote{padding:32px;border:1px solid rgba(62,107,32,.35);border-radius:16px;background:#f6f5ef;font-size:1.45rem;line-height:1.28;color:#465c25}.issue-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;margin-top:32px}.issue-card{overflow:hidden;border:1px solid rgba(17,17,31,.13);border-radius:18px;background:#fff}.issue-card>img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;background:#e7e4dc}.issue-copy{padding:28px}.issue-copy h3{margin:.15rem 0 1rem;font-size:1.45rem}.issue-number{font-size:.76rem;letter-spacing:.12em;font-weight:800;color:#54742f}.warning-box{margin:34px 0;padding:30px 32px;background:#f1f0e8;border-left:4px solid #54742f;border-radius:0 14px 14px 0}.warning-box strong{display:block;font-size:1.2rem;margin-bottom:8px}.diagnosis-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 34px;margin:26px 0;padding:0;list-style:none}.diagnosis-list li{padding:18px 0;border-top:1px solid rgba(17,17,31,.12)}.route-box{margin-top:30px;padding:34px;border-radius:18px;background:#f3f1e9}.route-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 24px;margin-top:20px}.route-links a{color:#3e6b20;font-weight:700}.guide-actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:24px}.guide-button{display:inline-flex;padding:14px 21px;border-radius:999px;background:#3e6b20;color:#fff;text-decoration:none;font-weight:800}.guide-button--secondary{background:transparent;border:1px solid rgba(255,255,255,.7)}.guide-final{background:#11111f;color:#fff;padding:72px 0}.guide-final h2{color:#fff}.source-list{padding-left:20px}.source-list a{color:#3e6b20}.faq-list article{padding:22px 0;border-top:1px solid rgba(17,17,31,.12)}.faq-list h3{margin:0 0 8px;font-size:1.25rem}@media(max-width:800px){.guide-hero{min-height:560px;margin-top:72px}.guide-hero-inner{width:min(100% - 34px,1120px);padding:54px 0}.guide-intro-grid,.issue-grid,.diagnosis-list,.route-links{grid-template-columns:1fr}.guide-section{padding:48px 0}}
</style>`;

function page(lang, c) {
  const url = `${base}${routes[lang]}`;
  const alternates = Object.entries(routes).map(([l, route]) => `<link rel="alternate" hreflang="${l}" href="${base}${route}">`).join('');
  const decisions = c.decisions.map(([heading, p1, p2], i) => {
    const image = decisionImages[i];
    const media = image ? `<img src="${image.src}" alt="${image.alt[lang]}" width="1280" height="801" loading="lazy">` : '';
    return `<article class="issue-card">${media}<div class="issue-copy"><span class="issue-number">${String(i + 1).padStart(2, '0')} · ${c.before}</span><h3>${heading}</h3><p>${p1}</p><p>${p2}</p></div></article>`;
  }).join('');
  const process = c.process.map(([heading, text], i) => `<li><strong>${String(i + 1).padStart(2, '0')} · ${heading}</strong><br>${text}</li>`).join('');
  const related = c.related.map(([label, href]) => `<a href="${href}">${label} <span aria-hidden="true">→</span></a>`).join('');
  const faq = c.faq.map(([question, answer]) => `<article><h3>${question}</h3><p>${answer}</p></article>`).join('');
  const sourceList = sourceUrls.map((href, i) => `<li><a href="${href}" target="_blank" rel="noopener">${c.sourceTexts[i]}</a></li>`).join('');
  const articleSchema = {'@context':'https://schema.org','@type':'Article',headline:c.h1,description:c.description,inLanguage:lang,datePublished:published,dateModified:published,author:{'@type':'Organization',name:'EcoViva Mallorca'},publisher:{'@type':'Organization',name:'EcoViva Mallorca'},mainEntityOfPage:url,image:`${base}${hero}`};
  const breadcrumbSchema = {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'EcoViva Mallorca',item:`${base}/${lang}/`},{'@type':'ListItem',position:2,name:lang==='es'?'Guías':lang==='de'?'Ratgeber':'Guides',item:`${base}/guides/${lang}/`},{'@type':'ListItem',position:3,name:c.h1,item:url}]};
  const faqSchema = {'@context':'https://schema.org','@type':'FAQPage',mainEntity:c.faq.map(([question, answer])=>({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}}))};
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${c.title}</title><meta name="robots" content="index,follow,max-image-preview:large"><meta name="description" content="${c.description}"><link rel="canonical" href="${url}">${alternates}<link rel="alternate" hreflang="x-default" href="${base}${routes.en}"><meta property="og:type" content="article"><meta property="og:locale" content="${c.locale}"><meta property="og:title" content="${c.title}"><meta property="og:description" content="${c.description}"><meta property="og:url" content="${url}"><meta property="og:image" content="${base}${hero}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${c.title}"><meta name="twitter:description" content="${c.description}"><meta name="twitter:image" content="${base}${hero}"><script type="application/ld+json">${JSON.stringify([articleSchema,breadcrumbSchema,faqSchema])}</script>${css}<link rel="stylesheet" href="/assets/shared-header.css?v=20260902-roof-facade-v1"><link rel="stylesheet" href="/assets/shared-footer.css?v=20260902-roof-facade-v1"></head><body class="guide-page"><header class="site-header shared-site-header"></header><main><section class="guide-hero"><div class="guide-hero-inner"><p class="guide-eyebrow">${c.eyebrow}</p><h1>${c.h1}</h1><p class="guide-lead">${c.lead}</p><div class="guide-actions"><a class="guide-button" href="${c.primary[1]}">${c.primary[0]}</a><a class="guide-button guide-button--secondary" href="${c.secondary[1]}">${c.secondary[0]}</a></div><time class="guide-date" datetime="${published}">${c.date}</time></div></section><div class="guide-shell"><section class="guide-section"><div class="guide-intro-grid"><div><p class="guide-eyebrow">${c.before}</p><h2>${c.introHeading}</h2>${c.intro.map(p=>`<p>${p}</p>`).join('')}</div><aside class="guide-quote">${c.lead}</aside></div></section><section class="guide-section"><p class="guide-eyebrow">${c.before}</p><h2>${c.h1}</h2><div class="issue-grid">${decisions}</div></section><section class="guide-section"><h2>${c.coordinatedHeading}</h2>${c.coordinated.map(p=>`<p>${p}</p>`).join('')}<div class="warning-box"><strong>${c.mallorca}</strong><h3>${c.mallorcaHeading}</h3><p>${c.mallorcaText}</p></div></section><section class="guide-section"><p class="guide-eyebrow">ECO VIVA</p><h2>${c.processHeading}</h2><ol class="diagnosis-list">${process}</ol></section><section class="guide-section"><p class="guide-eyebrow">${lang==='es'?'GUÍAS Y BIBLIOTECA TÉCNICA':lang==='de'?'RATGEBER & TECHNISCHE BIBLIOTHEK':'GUIDES & TECHNICAL LIBRARY'}</p><h2>${c.relatedHeading}</h2><div class="route-box"><div class="route-links">${related}</div></div></section><section class="guide-section"><p class="guide-eyebrow">FAQ</p><h2>${c.faqHeading}</h2><div class="faq-list">${faq}</div></section><section class="guide-section"><h2>${c.sources}</h2><ul class="source-list">${sourceList}</ul></section></div><section class="guide-final"><div class="guide-shell"><p class="guide-eyebrow">MARKUS &amp; MARITZA</p><h2>${c.closing}</h2><p>${c.closingText}</p><div class="guide-actions"><a class="guide-button" href="${c.primary[1]}">${c.closingCta}</a></div></div></section></main><footer class="site-footer shared-site-footer"></footer><script src="/assets/shared-header.js?v=20260902-roof-facade-v1" defer></script></body></html>`;
}

for (const [lang, c] of Object.entries(content)) {
  const file = path.join(pub, routes[lang], 'index.html');
  await fs.mkdir(path.dirname(file), {recursive:true});
  await fs.writeFile(file, page(lang, c), 'utf8');
}

const markerStart = '<!-- WATER-EFFICIENCY-GUIDE:START -->';
const markerEnd = '<!-- WATER-EFFICIENCY-GUIDE:END -->';
let sitemap = await fs.readFile(path.join(pub, 'sitemap.xml'), 'utf8');
sitemap = sitemap.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}\\n?`, 'g'), '');
const hreflang = Object.entries(routes).map(([lang, route]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${base}${route}"/>`).join('');
const rows = Object.values(routes).map(route => `  <url><loc>${base}${route}</loc><lastmod>${published}</lastmod>${hreflang}<xhtml:link rel="alternate" hreflang="x-default" href="${base}${routes.en}"/></url>`).join('\n');
const block = `${markerStart}\n${rows}\n${markerEnd}\n`;
sitemap = sitemap.replace('<!-- SEO_RENOVATION_CLUSTER_START -->', `${block}<!-- SEO_RENOVATION_CLUSTER_START -->`);
await fs.writeFile(path.join(pub, 'sitemap.xml'), sitemap, 'utf8');

console.log('Published Water Efficiency Guide in EN/ES/DE with SEO, FAQ and sitemap entries.');
