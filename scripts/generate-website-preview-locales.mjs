import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = await readFile(resolve(root, "public/website-preview/en/index.html"), "utf8");

const locales = {
  es: {
    title: "EcoViva Mallorca | Reformas con un único socio responsable",
    description: "EcoViva reúne la experiencia técnica y los profesionales especializados necesarios para obras concretas y reformas integrales en Mallorca.",
    replacements: [
      ["Skip to content", "Saltar al contenido"],
      ["Main navigation", "Navegación principal"],
      ["Language", "Idioma"],
      ["What We Do", "Qué hacemos"],
      ["How We Work", "Cómo trabajamos"],
      ["Technical Library", "Biblioteca técnica"],
      ["Offices & Studio", "Oficinas y estudio"],
      ["Work with us", "Trabaja con nosotros"],
      ["Discuss your project", "Hablemos de tu proyecto"],
      ["Renovation · Technical expertise · Mallorca", "Reformas · Experiencia técnica · Mallorca"],
      ["Renovate in Mallorca<br><em>with confidence.</em>", "Reforma en Mallorca<br><em>con total confianza.</em>"],
      ["EcoViva brings the right technical expertise and specialist contractors together—whether you are planning one specific improvement or a complete renovation.", "EcoViva reúne la experiencia técnica y los profesionales especializados adecuados, tanto para una mejora concreta como para una reforma integral."],
      ["Explore Technical Library", "Explorar la biblioteca técnica"],
      ["Your interests first", "Tus intereses, ante todo"],
      ["One coordinated renovation.<br>Clearly managed.", "Una reforma coordinada.<br>Gestionada con claridad."],
      ["What we do", "Qué hacemos"],
      ["Improve one part.<br><em>Or renovate the whole.</em>", "Mejora una parte.<br><em>O reforma el conjunto.</em>"],
      ["Come to EcoViva for a clearly defined roof, façade, insulation, waterproofing or solar project. When several works affect one another, we bring them together in one coordinated renovation.", "Acude a EcoViva para un proyecto bien definido de cubierta, fachada, aislamiento, impermeabilización o energía solar. Cuando varias actuaciones se influyen entre sí, las integramos en una única reforma coordinada."],
      ["Complete renovations", "Reformas integrales"],
      ["One plan for the whole property", "Un plan para toda la propiedad"],
      ["Discuss your renovation →", "Hablemos de tu reforma →"],
      ["Roofs", "Cubiertas"],
      ["Pitched and flat-roof systems", "Sistemas para cubiertas inclinadas y planas"],
      ["Explore roof systems →", "Explorar sistemas de cubierta →"],
      ["Façades", "Fachadas"],
      ["ETICS, stone, timber and panel systems", "SATE, piedra, madera y sistemas de paneles"],
      ["Explore façade systems →", "Explorar sistemas de fachada →"],
      ["One property · One connected plan", "Una propiedad · Un plan conectado"],
      ["Separate works.<br><em>Properly connected.</em>", "Trabajos distintos.<br><em>Correctamente conectados.</em>"],
      ["A roof, façade, window or solar installation may look like an individual job. In practice, each can affect insulation, waterproofing, ventilation and finishing.", "Una cubierta, fachada, ventana o instalación solar puede parecer una actuación independiente. En la práctica, cada una puede afectar al aislamiento, la impermeabilización, la ventilación y los acabados."],
      ["EcoViva identifies those connections, defines the complete scope and coordinates the right specialists as one clear project.", "EcoViva identifica esas conexiones, define el alcance completo y coordina a los especialistas adecuados como un único proyecto claro."],
      ["Tell us about your property", "Cuéntanos sobre tu propiedad"],
      ["How we work", "Cómo trabajamos"],
      ["Six clear steps.<br><em>From request to handover.</em>", "Seis pasos claros.<br><em>De la solicitud a la entrega.</em>"],
      ["Every stage has a purpose, a decision and a defined next step—with clear communication, technical preparation and local coordination throughout.", "Cada fase tiene un propósito, una decisión y un siguiente paso definido, con comunicación clara, preparación técnica y coordinación local durante todo el proceso."],
      ["Review your request", "Revisamos tu solicitud"],
      ["We use the information you share to understand the property, priorities and appropriate next step.", "Utilizamos la información que compartes para comprender la propiedad, tus prioridades y el siguiente paso adecuado."],
      ["Assess the property", "Evaluamos la propiedad"],
      ["We inspect the relevant conditions and determine what the project actually requires.", "Inspeccionamos las condiciones relevantes y determinamos lo que el proyecto realmente necesita."],
      ["Define the approach", "Definimos el enfoque"],
      ["We prepare a clear scope, technical approach and division of responsibilities.", "Preparamos un alcance claro, el enfoque técnico y el reparto de responsabilidades."],
      ["Present your proposal", "Presentamos tu propuesta"],
      ["We personally explain one coordinated EcoViva quotation and discuss the next steps with you.", "Te presentamos personalmente una propuesta coordinada de EcoViva y comentamos contigo los siguientes pasos."],
      ["Coordinate the works", "Coordinamos los trabajos"],
      ["We appoint the appropriate specialists and remain responsible for planning and execution.", "Seleccionamos a los especialistas adecuados y asumimos la responsabilidad de la planificación y la ejecución."],
      ["Inspect and hand over", "Inspeccionamos y entregamos"],
      ["We complete the final inspection, formally hand over the project and remain involved during the agreed warranty period.", "Realizamos la inspección final, entregamos formalmente el proyecto y seguimos implicados durante el periodo de garantía acordado."],
      ["A better project start", "Un mejor comienzo para tu proyecto"],
      ["Not a generic contact form.<br><em>A first project assessment.</em>", "No es un formulario de contacto genérico.<br><em>Es una primera evaluación del proyecto.</em>"],
      ["Our guided request asks about your property, location, priorities, timing and the work you are considering. That gives us enough context to review the request and recommend a useful next step.", "Nuestra solicitud guiada recoge información sobre tu propiedad, ubicación, prioridades, plazos y los trabajos que estás considerando. Así obtenemos el contexto necesario para revisar el proyecto y recomendar el siguiente paso más útil."],
      ["Start your project request", "Iniciar la solicitud del proyecto"],
      ["Property · Priorities · Timing · Photos & plans", "Propiedad · Prioridades · Plazos · Fotos y planos"],
      ["You share the essentials. We assess the full scope and recommend the right next step.", "Tú compartes lo esencial. Nosotros evaluamos el alcance completo y recomendamos el siguiente paso adecuado."],
      ["Inside the EcoViva Offices & Studio", "Dentro de las Oficinas y Estudio EcoViva"],
      ["Advice starts with<br><em>understanding the building.</em>", "El asesoramiento empieza por<br><em>comprender el edificio.</em>"],
      ["Plans, building details and real material samples come together before a solution is proposed. This is where separate questions become one coordinated renovation approach.", "Planos, detalles constructivos y muestras reales de materiales se reúnen antes de proponer una solución. Aquí, las cuestiones independientes se convierten en un enfoque de reforma coordinado."],
      ["Understand the property", "Comprender la propiedad"],
      ["Define the right system", "Definir el sistema adecuado"],
      ["Natural stone", "Piedra natural"],
      ["Texture, tone and authentic character", "Textura, tono y carácter auténtico"],
      ["Timber profiles", "Perfiles de madera"],
      ["Profiles and finishes compared in person", "Perfiles y acabados comparados en persona"],
      ["Technical clarity<br><em>before work begins.</em>", "Claridad técnica<br><em>antes de iniciar los trabajos.</em>"],
      ["Explore the build-ups, materials and critical details behind all six roof and façade systems currently in the EcoViva Technical Library.", "Descubre la composición, los materiales y los detalles críticos de los seis sistemas de cubierta y fachada disponibles actualmente en la Biblioteca Técnica EcoViva."],
      ["Explore all systems", "Explorar todos los sistemas"],
      ["Traditional Mallorcan Roof", "Cubierta tradicional mallorquina"],
      ["Insulated Flat Roof", "Cubierta plana aislada"],
      ["ETICS Façade", "Fachada SATE"],
      ["Natural Stone Façade", "Fachada de piedra natural"],
      ["ThermoWood Façade", "Fachada ThermoWood"],
      ["Universal Ventilated Façade", "Fachada ventilada universal"],
      ["Passeig de Mallorca · Central Palma", "Passeig de Mallorca · Centro de Palma"],
      ["A place to discuss<br><em>your property in detail.</em>", "Un lugar para analizar<br><em>tu propiedad en detalle.</em>"],
      ["Our centrally located Offices & Studio give owners, architects and specialists a professional place to review plans, compare technical systems and discuss a proposal in person.", "Nuestras Oficinas y Estudio, situadas en el centro, ofrecen a propietarios, arquitectos y especialistas un espacio profesional para revisar planos, comparar sistemas técnicos y comentar una propuesta en persona."],
      ["View on Google Maps", "Ver en Google Maps"],
      ["Main office & consultation space", "Oficina principal y espacio de consulta"],
      ["Private meeting room", "Sala de reuniones privada"],
      ["Entrance · Entresuelo 2E", "Entrada · Entresuelo 2E"],
      ["Based in Palma. Working across Mallorca.", "Con sede en Palma. Trabajamos en toda Mallorca."],
      ["South-west · Tramuntana · North · Centre · East · South", "Suroeste · Tramuntana · Norte · Centro · Este · Sur"],
      ["Work with EcoViva", "Trabaja con EcoViva"],
      ["Strong local relationships.<br><em>Clear professional routes.</em>", "Relaciones locales sólidas.<br><em>Vías profesionales claras.</em>"],
      ["EcoViva works with professionals who introduce property owners and with experienced specialists who carry out high-quality renovation work across Mallorca.", "EcoViva colabora con profesionales que nos presentan a propietarios y con especialistas experimentados que ejecutan reformas de alta calidad en toda Mallorca."],
      ["Architects · Agents · Property managers", "Arquitectos · Agentes · Gestores de propiedades"],
      ["Property partners", "Colaboradores inmobiliarios"],
      ["Give your clients one dependable renovation partner for technical preparation, quotations and coordinated execution.", "Ofrece a tus clientes un socio de confianza para la preparación técnica, las propuestas y la ejecución coordinada de sus reformas."],
      ["Partner with EcoViva →", "Colabora con EcoViva →"],
      ["Roofers · Façade teams · Installers · Trades", "Cubiertas · Fachadas · Instaladores · Oficios"],
      ["Specialist contractors", "Contratistas especializados"],
      ["Join a carefully selected network for well-prepared renovation projects with clear scopes and professional coordination.", "Únete a una red cuidadosamente seleccionada para proyectos bien preparados, con alcances claros y coordinación profesional."],
      ["Join our contractor network →", "Únete a nuestra red de contratistas →"],
      ["Personal guidance.<br><em>Technical depth.</em>", "Atención personal.<br><em>Profundidad técnica.</em>"],
      ["EcoViva Mallorca was founded by Markus Hackenjos and Maritza Cubillos to give international property owners one dependable local partner.", "Markus Hackenjos y Maritza Cubillos fundaron EcoViva Mallorca para ofrecer a propietarios internacionales un único socio local de confianza."],
      ["We combine more than a decade of renovation experience with local presence, technical preparation and a network of specialist contractors.", "Combinamos más de una década de experiencia en reformas con presencia local, preparación técnica y una red de contratistas especializados."],
      ["renovation experience", "de experiencia en reformas"],
      ["projects contributed to", "proyectos realizados"],
      ["communication", "comunicación"],
      ["Your next step", "Tu siguiente paso"],
      ["Start with a clearer <em>project request.</em>", "Empieza con una <em>solicitud de proyecto más clara.</em>"],
      ["Tell us about the property and the work you have in mind. We will review it and recommend the right next step.", "Cuéntanos sobre la propiedad y los trabajos que tienes en mente. Los revisaremos y recomendaremos el siguiente paso adecuado."],
      ["Or call", "O llámanos al"],
      ["Or email EcoViva", "O escribe a EcoViva"],
      ["Technical preparation and coordinated renovation for properties across Mallorca.", "Preparación técnica y reformas coordinadas para propiedades en toda Mallorca."],
      ["Visit our Offices & Studio", "Visita nuestras Oficinas y Estudio"],
      ["Explore", "Explorar"],
      ["Client project request", "Solicitud de proyecto"],
      ["Partners & contractors", "Colaboradores y contratistas"],
      ["Privacy policy", "Política de privacidad"],
      ["Renovation · Insulation · Façades · Roofs · Solar", "Reformas · Aislamiento · Fachadas · Cubiertas · Solar"]
    ]
  },
  de: {
    title: "EcoViva Mallorca | Renovierung mit einem verantwortlichen Partner",
    description: "EcoViva vereint technische Kompetenz und spezialisierte Fachbetriebe für Einzelmaßnahmen und Komplettsanierungen auf Mallorca.",
    replacements: [
      ["Skip to content", "Zum Inhalt springen"],
      ["Main navigation", "Hauptnavigation"],
      ["Language", "Sprache"],
      ["What We Do", "Was wir tun"],
      ["How We Work", "Wie wir arbeiten"],
      ["Technical Library", "Technische Bibliothek"],
      ["Offices & Studio", "Büro & Studio"],
      ["Work with us", "Mit uns arbeiten"],
      ["Discuss your project", "Projekt besprechen"],
      ["Renovation · Technical expertise · Mallorca", "Renovierung · Technische Expertise · Mallorca"],
      ["Renovate in Mallorca<br><em>with confidence.</em>", "Renovieren auf Mallorca<br><em>mit Sicherheit.</em>"],
      ["EcoViva brings the right technical expertise and specialist contractors together—whether you are planning one specific improvement or a complete renovation.", "EcoViva bringt die passende technische Expertise und spezialisierte Fachbetriebe zusammen – für eine konkrete Maßnahme ebenso wie für eine Komplettsanierung."],
      ["Explore Technical Library", "Technische Bibliothek entdecken"],
      ["Your interests first", "Ihre Interessen zuerst"],
      ["One coordinated renovation.<br>Clearly managed.", "Eine koordinierte Renovierung.<br>Klar geführt."],
      ["What we do", "Was wir tun"],
      ["Improve one part.<br><em>Or renovate the whole.</em>", "Einen Bereich verbessern.<br><em>Oder alles renovieren.</em>"],
      ["Come to EcoViva for a clearly defined roof, façade, insulation, waterproofing or solar project. When several works affect one another, we bring them together in one coordinated renovation.", "EcoViva übernimmt klar definierte Dach-, Fassaden-, Dämmungs-, Abdichtungs- oder Solarprojekte. Wenn mehrere Arbeiten ineinandergreifen, bündeln wir sie zu einer koordinierten Renovierung."],
      ["Complete renovations", "Komplettsanierungen"],
      ["One plan for the whole property", "Ein Plan für die gesamte Immobilie"],
      ["Discuss your renovation →", "Renovierung besprechen →"],
      ["Roofs", "Dächer"],
      ["Pitched and flat-roof systems", "Systeme für Steil- und Flachdächer"],
      ["Explore roof systems →", "Dachsysteme entdecken →"],
      ["Façades", "Fassaden"],
      ["ETICS, stone, timber and panel systems", "WDVS, Stein, Holz und Plattensysteme"],
      ["Explore façade systems →", "Fassadensysteme entdecken →"],
      ["One property · One connected plan", "Eine Immobilie · Ein abgestimmter Plan"],
      ["Separate works.<br><em>Properly connected.</em>", "Einzelne Arbeiten.<br><em>Richtig miteinander verbunden.</em>"],
      ["A roof, façade, window or solar installation may look like an individual job. In practice, each can affect insulation, waterproofing, ventilation and finishing.", "Ein Dach, eine Fassade, ein Fenster oder eine Solaranlage kann wie eine Einzelmaßnahme wirken. In der Praxis beeinflusst jede davon Dämmung, Abdichtung, Belüftung und Ausbau."],
      ["EcoViva identifies those connections, defines the complete scope and coordinates the right specialists as one clear project.", "EcoViva erkennt diese Zusammenhänge, definiert den vollständigen Umfang und koordiniert die passenden Spezialisten als ein klar geführtes Projekt."],
      ["Tell us about your property", "Erzählen Sie uns von Ihrer Immobilie"],
      ["How we work", "Wie wir arbeiten"],
      ["Six clear steps.<br><em>From request to handover.</em>", "Sechs klare Schritte.<br><em>Von der Anfrage bis zur Übergabe.</em>"],
      ["Every stage has a purpose, a decision and a defined next step—with clear communication, technical preparation and local coordination throughout.", "Jede Phase hat einen Zweck, eine Entscheidung und einen klar definierten nächsten Schritt – mit transparenter Kommunikation, technischer Vorbereitung und lokaler Koordination."],
      ["Review your request", "Anfrage prüfen"],
      ["We use the information you share to understand the property, priorities and appropriate next step.", "Anhand Ihrer Angaben verstehen wir die Immobilie, Ihre Prioritäten und den passenden nächsten Schritt."],
      ["Assess the property", "Immobilie beurteilen"],
      ["We inspect the relevant conditions and determine what the project actually requires.", "Wir prüfen die relevanten Gegebenheiten und bestimmen, was das Projekt tatsächlich benötigt."],
      ["Define the approach", "Vorgehen definieren"],
      ["We prepare a clear scope, technical approach and division of responsibilities.", "Wir definieren einen klaren Leistungsumfang, das technische Vorgehen und die Verantwortlichkeiten."],
      ["Present your proposal", "Angebot präsentieren"],
      ["We personally explain one coordinated EcoViva quotation and discuss the next steps with you.", "Wir erläutern Ihnen persönlich ein abgestimmtes EcoViva-Angebot und besprechen die nächsten Schritte."],
      ["Coordinate the works", "Arbeiten koordinieren"],
      ["We appoint the appropriate specialists and remain responsible for planning and execution.", "Wir beauftragen die passenden Fachbetriebe und bleiben für Planung und Ausführung verantwortlich."],
      ["Inspect and hand over", "Prüfen und übergeben"],
      ["We complete the final inspection, formally hand over the project and remain involved during the agreed warranty period.", "Wir führen die Endkontrolle durch, übergeben das Projekt formell und bleiben während der vereinbarten Gewährleistungszeit eingebunden."],
      ["A better project start", "Ein besserer Projektstart"],
      ["Not a generic contact form.<br><em>A first project assessment.</em>", "Kein allgemeines Kontaktformular.<br><em>Eine erste Projekteinschätzung.</em>"],
      ["Our guided request asks about your property, location, priorities, timing and the work you are considering. That gives us enough context to review the request and recommend a useful next step.", "Unsere geführte Anfrage erfasst Ihre Immobilie, den Standort, Prioritäten, Zeitplanung und die geplanten Arbeiten. So erhalten wir genügend Kontext, um die Anfrage zu prüfen und einen sinnvollen nächsten Schritt zu empfehlen."],
      ["Start your project request", "Projektanfrage starten"],
      ["Property · Priorities · Timing · Photos & plans", "Immobilie · Prioritäten · Zeitplan · Fotos & Pläne"],
      ["You share the essentials. We assess the full scope and recommend the right next step.", "Sie teilen die wichtigsten Angaben. Wir bewerten den Gesamtumfang und empfehlen den passenden nächsten Schritt."],
      ["Inside the EcoViva Offices & Studio", "Im EcoViva Büro & Studio"],
      ["Advice starts with<br><em>understanding the building.</em>", "Gute Beratung beginnt damit,<br><em>das Gebäude zu verstehen.</em>"],
      ["Plans, building details and real material samples come together before a solution is proposed. This is where separate questions become one coordinated renovation approach.", "Pläne, Baudetails und echte Materialmuster werden zusammengeführt, bevor wir eine Lösung vorschlagen. Hier werden einzelne Fragen zu einem abgestimmten Renovierungskonzept."],
      ["Understand the property", "Immobilie verstehen"],
      ["Define the right system", "Das richtige System definieren"],
      ["Natural stone", "Naturstein"],
      ["Texture, tone and authentic character", "Textur, Farbton und authentischer Charakter"],
      ["Timber profiles", "Holzprofile"],
      ["Profiles and finishes compared in person", "Profile und Oberflächen persönlich vergleichen"],
      ["Technical clarity<br><em>before work begins.</em>", "Technische Klarheit<br><em>vor Beginn der Arbeiten.</em>"],
      ["Explore the build-ups, materials and critical details behind all six roof and façade systems currently in the EcoViva Technical Library.", "Entdecken Sie Aufbau, Materialien und kritische Details aller sechs Dach- und Fassadensysteme in der Technischen Bibliothek von EcoViva."],
      ["Explore all systems", "Alle Systeme entdecken"],
      ["Traditional Mallorcan Roof", "Traditionelles mallorquinisches Dach"],
      ["Insulated Flat Roof", "Gedämmtes Flachdach"],
      ["ETICS Façade", "WDVS-Fassade"],
      ["Natural Stone Façade", "Natursteinfassade"],
      ["ThermoWood Façade", "ThermoWood-Fassade"],
      ["Universal Ventilated Façade", "Universelle hinterlüftete Fassade"],
      ["Passeig de Mallorca · Central Palma", "Passeig de Mallorca · Palma Zentrum"],
      ["A place to discuss<br><em>your property in detail.</em>", "Ein Ort, um Ihre Immobilie<br><em>im Detail zu besprechen.</em>"],
      ["Our centrally located Offices & Studio give owners, architects and specialists a professional place to review plans, compare technical systems and discuss a proposal in person.", "Unser zentral gelegenes Büro & Studio bietet Eigentümern, Architekten und Fachleuten einen professionellen Ort, um Pläne zu prüfen, technische Systeme zu vergleichen und ein Angebot persönlich zu besprechen."],
      ["View on Google Maps", "Auf Google Maps ansehen"],
      ["Main office & consultation space", "Hauptbüro & Beratungsbereich"],
      ["Private meeting room", "Privater Besprechungsraum"],
      ["Entrance · Entresuelo 2E", "Eingang · Entresuelo 2E"],
      ["Based in Palma. Working across Mallorca.", "Sitz in Palma. Tätig auf ganz Mallorca."],
      ["South-west · Tramuntana · North · Centre · East · South", "Südwest · Tramuntana · Nord · Mitte · Ost · Süd"],
      ["Work with EcoViva", "Mit EcoViva arbeiten"],
      ["Strong local relationships.<br><em>Clear professional routes.</em>", "Starke lokale Beziehungen.<br><em>Klare professionelle Wege.</em>"],
      ["EcoViva works with professionals who introduce property owners and with experienced specialists who carry out high-quality renovation work across Mallorca.", "EcoViva arbeitet mit Fachleuten, die uns Immobilieneigentümer vorstellen, sowie mit erfahrenen Spezialisten für hochwertige Renovierungsarbeiten auf ganz Mallorca."],
      ["Architects · Agents · Property managers", "Architekten · Makler · Property Manager"],
      ["Property partners", "Immobilienpartner"],
      ["Give your clients one dependable renovation partner for technical preparation, quotations and coordinated execution.", "Bieten Sie Ihren Kunden einen verlässlichen Renovierungspartner für technische Vorbereitung, Angebote und koordinierte Ausführung."],
      ["Partner with EcoViva →", "Partner von EcoViva werden →"],
      ["Roofers · Façade teams · Installers · Trades", "Dachdecker · Fassadenteams · Installateure · Gewerke"],
      ["Specialist contractors", "Spezialisierte Fachbetriebe"],
      ["Join a carefully selected network for well-prepared renovation projects with clear scopes and professional coordination.", "Werden Sie Teil eines sorgfältig ausgewählten Netzwerks für gut vorbereitete Renovierungsprojekte mit klaren Leistungsumfängen und professioneller Koordination."],
      ["Join our contractor network →", "Unserem Fachbetriebsnetzwerk beitreten →"],
      ["Personal guidance.<br><em>Technical depth.</em>", "Persönliche Begleitung.<br><em>Technische Tiefe.</em>"],
      ["EcoViva Mallorca was founded by Markus Hackenjos and Maritza Cubillos to give international property owners one dependable local partner.", "Markus Hackenjos und Maritza Cubillos gründeten EcoViva Mallorca, um internationalen Immobilieneigentümern einen verlässlichen lokalen Partner zu bieten."],
      ["We combine more than a decade of renovation experience with local presence, technical preparation and a network of specialist contractors.", "Wir verbinden mehr als zehn Jahre Renovierungserfahrung mit lokaler Präsenz, technischer Vorbereitung und einem Netzwerk spezialisierter Fachbetriebe."],
      ["renovation experience", "Renovierungserfahrung"],
      ["projects contributed to", "realisierte Projekte"],
      ["communication", "Kommunikation"],
      ["Your next step", "Ihr nächster Schritt"],
      ["Start with a clearer <em>project request.</em>", "Starten Sie mit einer klareren <em>Projektanfrage.</em>"],
      ["Tell us about the property and the work you have in mind. We will review it and recommend the right next step.", "Erzählen Sie uns von der Immobilie und den geplanten Arbeiten. Wir prüfen Ihre Angaben und empfehlen den passenden nächsten Schritt."],
      ["Or call", "Oder anrufen:"],
      ["Or email EcoViva", "Oder EcoViva schreiben"],
      ["Technical preparation and coordinated renovation for properties across Mallorca.", "Technische Vorbereitung und koordinierte Renovierung für Immobilien auf ganz Mallorca."],
      ["Visit our Offices & Studio", "Besuchen Sie unser Büro & Studio"],
      ["Explore", "Entdecken"],
      ["Client project request", "Projektanfrage für Kunden"],
      ["Partners & contractors", "Partner & Fachbetriebe"],
      ["Privacy policy", "Datenschutz"],
      ["Renovation · Insulation · Façades · Roofs · Solar", "Renovierung · Dämmung · Fassaden · Dächer · Solar"]
    ]
  }
};

const routeMaps = {
  es: [
    ["/technical-library/en/traditional-mallorcan-roof/", "/technical-library/es/traditional-mallorcan-roof/"],
    ["/technical-library/en/universal-insulated-flat-roof-system/", "/technical-library/es/sistema-universal-cubierta-plana-aislada/"],
    ["/technical-library/en/etics-external-wall-insulation/", "/technical-library/es/sistema-sate-aislamiento-exterior/"],
    ["/technical-library/en/natural-stone-facade-system/", "/technical-library/es/sistema-fachada-piedra-natural/"],
    ["/technical-library/en/ventilated-thermowood-facade-system/", "/technical-library/es/sistema-fachada-ventilada-thermowood/"],
    ["/technical-library/en/universal-ventilated-facade-system/", "/technical-library/es/sistema-universal-fachada-ventilada/"]
  ],
  de: [
    ["/technical-library/en/traditional-mallorcan-roof/", "/technical-library/de/traditional-mallorcan-roof/"],
    ["/technical-library/en/universal-insulated-flat-roof-system/", "/technical-library/de/universelles-gedaemmtes-flachdachsystem/"],
    ["/technical-library/en/etics-external-wall-insulation/", "/technical-library/de/wdvs-aussendaemmung-putzfassade/"],
    ["/technical-library/en/natural-stone-facade-system/", "/technical-library/de/naturstein-fassadensystem/"],
    ["/technical-library/en/ventilated-thermowood-facade-system/", "/technical-library/de/hinterlueftetes-thermowood-fassadensystem/"],
    ["/technical-library/en/universal-ventilated-facade-system/", "/technical-library/de/universelles-hinterlueftetes-fassadensystem/"]
  ]
};

for (const [locale, config] of Object.entries(locales)) {
  let html = source;
  for (const [from, to] of routeMaps[locale]) html = html.replaceAll(from, to);
  html = html
    .replace('<html lang="en">', `<html lang="${locale}">`)
    .replace(/<title>.*?<\/title>/, `<title>${config.title}</title>`)
    .replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${config.description}">`)
    .replaceAll('/website-preview/en/', `/website-preview/${locale}/`)
    .replaceAll('/en/', `/${locale}/`)
    .replace(`aria-current="page">EN</a>`, `>EN</a>`)
    .replace(`lang="${locale}">${locale.toUpperCase()}</a>`, `lang="${locale}" aria-current="page">${locale.toUpperCase()}</a>`);

  html = html.replaceAll("/technical-library/en/", `/technical-library/${locale}/`);
  if (locale === "es") {
    html = html
      .replaceAll("/es/partners", "/es/colaboradores")
      .replaceAll("/es/privacy-policy", "/es/politica-de-privacidad");
  } else {
    html = html
      .replaceAll("/de/partners", "/de/partner")
      .replaceAll("/de/privacy-policy", "/de/datenschutzerklaerung");
  }
  for (const [from, to] of config.replacements) html = html.replaceAll(from, to);
  if (locale === "es") {
    html = html
      .replace('<a href="/website-preview/es/" >EN</a>', '<a href="/website-preview/en/">EN</a>')
      .replaceAll("Explorar Biblioteca técnica", "Explorar la Biblioteca Técnica")
      .replaceAll("Explorar the build-ups, materials and critical details behind all six roof and façade systems currently in the EcoViva Biblioteca técnica.", "Descubre la composición, los materiales y los detalles críticos de los seis sistemas de cubierta y fachada disponibles actualmente en la Biblioteca Técnica EcoViva.")
      .replaceAll("Our centrally located Oficinas y estudio give owners, architects and specialists a professional place to review plans, compare technical systems and discuss a proposal in person.", "Nuestras Oficinas y Estudio, situadas en el centro, ofrecen a propietarios, arquitectos y especialistas un espacio profesional para revisar planos, comparar sistemas técnicos y comentar una propuesta en persona.")
      .replaceAll("Inside the EcoViva Oficinas y estudio", "Dentro de las Oficinas y Estudio EcoViva")
      .replaceAll("Visit our Oficinas y estudio", "Visita nuestras Oficinas y Estudio");
  } else {
    html = html
      .replace('<a href="/website-preview/de/" >EN</a>', '<a href="/website-preview/en/">EN</a>')
      .replaceAll("Entdecken Technische Bibliothek", "Technische Bibliothek entdecken")
      .replaceAll("Entdecken the build-ups, materials and critical details behind all six roof and façade systems currently in the EcoViva Technische Bibliothek.", "Entdecken Sie Aufbau, Materialien und kritische Details aller sechs Dach- und Fassadensysteme in der Technischen Bibliothek von EcoViva.")
      .replaceAll("Our centrally located Büro & Studio give owners, architects and specialists a professional place to review plans, compare technical systems and discuss a proposal in person.", "Unser zentral gelegenes Büro & Studio bietet Eigentümern, Architekten und Fachleuten einen professionellen Ort, um Pläne zu prüfen, technische Systeme zu vergleichen und ein Angebot persönlich zu besprechen.")
      .replaceAll("Inside the EcoViva Büro & Studio", "Im EcoViva Büro & Studio")
      .replaceAll("Visit our Büro & Studio", "Besuchen Sie unser Büro & Studio");
  }

  const target = resolve(root, `public/website-preview/${locale}/index.html`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}
