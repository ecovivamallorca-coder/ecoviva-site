import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const publicDir = join(root, 'public');
const version = '20260814-guides-tray-v6';

const copy = {
  en: {
    what:'What We Do', all:'All renovation solutions', examples:'Renovation Examples', how:'How We Work', why:'Why EcoViva', technical:'Technical Library', guides:'Guides', areas:'Areas', work:'Work with us', who:'Who We Are', office:'Offices & Studio', contact:'Contact', brochure:'Company brochure', cta:'Start your renovation', nav:'Main navigation', language:'Language', menu:'Open menu',
    footerIntro:'Complete renovation solutions for properties across Mallorca—technically assessed and professionally coordinated.', visit:'Visit our Offices & Studio', appointment:'Visits by appointment', explore:'Explore', partners:'Partners & contractors', privacy:'Privacy policy', footerTag:'Renovation · Insulation · Façades · Roofs · Solar'
  },
  es: {
    what:'Qué hacemos', all:'Todas las soluciones', examples:'Ejemplos de reforma', how:'Cómo trabajamos', why:'Por qué EcoViva', technical:'Biblioteca técnica', guides:'Guías', areas:'Zonas', work:'Trabaja con nosotros', who:'Quiénes somos', office:'Oficinas & Estudio', contact:'Contacto', brochure:'Folleto de empresa', cta:'Empieza tu reforma', nav:'Navegación principal', language:'Idioma', menu:'Abrir menú',
    footerIntro:'Soluciones integrales de reforma para propiedades en Mallorca, evaluadas técnicamente y coordinadas profesionalmente.', visit:'Visita nuestras Oficinas & Estudio', appointment:'Visitas con cita previa', explore:'Explorar', partners:'Colaboradores y contratistas', privacy:'Política de privacidad', footerTag:'Reformas · Aislamiento · Fachadas · Cubiertas · Solar'
  },
  de: {
    what:'Leistungen', all:'Alle Renovierungslösungen', examples:'Renovierungsbeispiele', how:'Unser Ablauf', why:'Warum EcoViva', technical:'Technische Bibliothek', guides:'Ratgeber', areas:'Regionen', work:'Mit uns arbeiten', who:'Über uns', office:'Büro & Studio', contact:'Kontakt', brochure:'Unternehmensbroschüre', cta:'Renovierung starten', nav:'Hauptnavigation', language:'Sprache', menu:'Menü öffnen',
    footerIntro:'Komplette Renovierungslösungen für Immobilien auf Mallorca – technisch geprüft und professionell koordiniert.', visit:'Besuchen Sie unser Büro & Studio', appointment:'Besuche nach Terminvereinbarung', explore:'Entdecken', partners:'Partner & Fachbetriebe', privacy:'Datenschutz', footerTag:'Renovierung · Dämmung · Fassaden · Dächer · Solar'
  }
};

const defaultLangUrls = { en:'/en/', es:'/es/', de:'/de/' };
const guideHubUrls = { en:'/guides/en/', es:'/guides/es/', de:'/guides/de/' };
const privacyUrls = { en:'/en/privacy-policy/', es:'/es/politica-de-privacidad/', de:'/de/datenschutzerklaerung/' };

function langFor(file, html){
  const p = file.replaceAll('\\','/');
  const m = p.match(/\/(?:technical-library|guides)\/(en|es|de)\//) || p.match(/\/public\/(en|es|de)\//);
  if(m) return m[1];
  const h = html.match(/<html[^>]+lang=["'](en|es|de)/i);
  return h ? h[1].toLowerCase() : 'en';
}

function alternateUrls(html){
  const urls = {...defaultLangUrls};
  for(const lang of ['en','es','de']){
    const re = new RegExp(`<link[^>]+rel=["']alternate["'][^>]+hreflang=["']${lang}["'][^>]+href=["']([^"']+)["'][^>]*>`, 'i');
    const rev = new RegExp(`<link[^>]+href=["']([^"']+)["'][^>]+hreflang=["']${lang}["'][^>]+rel=["']alternate["'][^>]*>`, 'i');
    const hit = html.match(re) || html.match(rev);
    if(hit) urls[lang] = hit[1].replace('https://www.ecoviva-mallorca.com','');
  }
  return urls;
}

function contextFor(file){
  const p = file.replaceAll('\\','/');
  if(p.includes('/technical-library/')) return 'technical';
  if(p.includes('/guides/')) return 'guides';
  if(p.includes('/brochure/')) return 'brochure';
  return 'main';
}

function headerHtml(lang, context, html){
  const c = copy[lang] || copy.en;
  const rootUrl = `/${lang}/`;
  const technicalUrl = `/technical-library/${lang}/`;
  const brochureUrl = `/${lang}/brochure/`;
  const guideActive = context === 'guides';
  const technicalActive = context === 'technical';
  const langUrls = alternateUrls(html);
  const guidesAttrs = `href="${guideHubUrls[lang]}"${guideActive ? ' aria-current="page"' : ''}`;
  return `<header class="site-header shared-site-header"><div class="scroll-progress" aria-hidden="true"><span></span></div><div class="nav-shell"><a class="brand" href="${rootUrl}" aria-label="EcoViva Mallorca"><img src="/assets/logos/ecoviva-horizontal-header.png" alt="EcoViva Mallorca"></a><nav class="main-nav" aria-label="${c.nav}"><div class="nav-dropdown"><button class="nav-dropdown-toggle" type="button" aria-expanded="false">${c.what} <span aria-hidden="true">⌄</span></button><div class="nav-dropdown-menu"><a href="${rootUrl}#what-we-do" data-section-link="what-we-do">${c.all}</a><a href="${rootUrl}#renovation-examples">${c.examples}</a></div></div><a href="${rootUrl}#how-we-work" data-section-link="how-we-work">${c.how}</a><a href="${rootUrl}#why-ecoviva" data-section-link="why-ecoviva">${c.why}</a><a href="${technicalUrl}"${technicalActive?' aria-current="page"':''}>${c.technical}</a><a ${guidesAttrs}>${c.guides}</a><a href="${rootUrl}#areas" data-section-link="areas">${c.areas}</a><a href="${rootUrl}#professionals" data-section-link="professionals">${c.work}</a><div class="nav-dropdown nav-dropdown-right"><button class="nav-dropdown-toggle" type="button" aria-expanded="false">${c.who} <span aria-hidden="true">⌄</span></button><div class="nav-dropdown-menu nav-dropdown-menu-right"><a href="${rootUrl}#about">Markus &amp; Maritza</a><a href="${rootUrl}#areas">${c.office}</a><a href="${brochureUrl}">${c.brochure}</a><a href="${rootUrl}#contact">${c.contact}</a></div></div><a class="button" href="${rootUrl}#renovation-request">${c.cta}</a></nav><nav class="language-nav" aria-label="${c.language}">${['en','es','de'].map(l=>`<a href="${langUrls[l]}" lang="${l}"${l===lang?' aria-current="page"':''}>${l.toUpperCase()}</a>`).join('')}</nav><button class="menu-toggle" type="button" aria-label="${c.menu}" aria-expanded="false"><span></span><span></span><span></span></button></div></header>`;
}

function footerHtml(lang){
  const c = copy[lang] || copy.en;
  const rootUrl = `/${lang}/`;
  return `<footer class="site-footer shared-site-footer"><div class="shared-footer-shell"><div class="footer-grid"><div class="footer-brand"><img src="/assets/logos/ecoviva-horizontal-header.png" alt="EcoViva Mallorca"><p>${c.footerIntro}</p></div><div class="footer-column"><h3>${c.visit}</h3><strong class="appointment-note">${c.appointment}</strong><span>Passeig de Mallorca, 14-A<br>Entresuelo 2, Puerta E<br>07012 Palma</span><a href="tel:+34871532758">+34 871 53 27 58</a><a href="mailto:info@ecoviva-mallorca.com">info@ecoviva-mallorca.com</a></div><div class="footer-column"><h3>${c.explore}</h3><a href="${rootUrl}#renovation-request">${c.cta}</a><a href="${rootUrl}#professionals">${c.partners}</a><a href="/technical-library/${lang}/">${c.technical}</a><a href="${guideHubUrls[lang]}">${c.guides}</a><a href="${rootUrl}brochure/">${c.brochure}</a><a href="${privacyUrls[lang]}">${c.privacy}</a></div></div><div class="footer-bottom"><span>© 2026 EcoViva Mallorca SL</span><span>${c.footerTag}</span></div></div></footer>`;
}

function cleanTechnicalActions(file, html, context){
  if(context !== 'technical') return html;
  const p = file.replaceAll('\\','/');
  const isLanding = /\/public\/technical-library\/(en|es|de)\/index\.html$/.test(p);
  if(isLanding){
    return html.replace(/<nav\b[^>]*class=["'][^"']*tl-actions--landing[^"']*["'][^>]*>[\s\S]*?<\/nav>/i,'');
  }
  return html.replace(/<nav\b([^>]*)class=["']([^"']*\btl-actions\b[^"']*)["']([^>]*)>([\s\S]*?)<\/nav>/i,(full,before,classes,after,inner)=>{
    const cleaned = inner
      .replace(/<a\b[^>]*href=["']https:\/\/www\.ecoviva-mallorca\.com\/?["'][^>]*>[\s\S]*?<\/a>/gi,'')
      .replace(/<a\b[^>]*href=["']\/technical-library\/start\/?["'][^>]*>[\s\S]*?<\/a>/gi,'');
    return `<nav${before}class="${classes}"${after}>${cleaned}</nav>`;
  });
}

function shouldProcess(file, html){
  const p = file.replaceAll('\\','/');
  const inScope = /\/public\/(en|es|de)\//.test(p) || p.includes('/public/technical-library/') || p.includes('/public/preview/guides/') || p.includes('/public/guides/');
  const hasChrome = /<(?:header|footer)\b[^>]*class=["'][^"']*(?:site-header|roof-site-header|shared-site-header|brochure-header|site-footer|roof-site-footer|shared-site-footer|brochure-footer)[^"']*["']/i.test(html);
  return inScope && hasChrome;
}

async function walk(dir){
  const entries = await readdir(dir,{withFileTypes:true});
  const files=[];
  for(const entry of entries){
    const full=join(dir,entry.name);
    if(entry.isDirectory()) files.push(...await walk(full));
    else if(entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

let changed=0;
for(const file of await walk(publicDir)){
  let html = await readFile(file,'utf8');
  if(!shouldProcess(file,html)) continue;
  const lang=langFor(file,html);
  if(!copy[lang]) continue;
  const context=contextFor(file);
  const nextHeader=headerHtml(lang,context,html);
  const nextFooter=footerHtml(lang);
  html = html.replace(/<header\b[^>]*class=["'][^"']*(?:shared-site-header|roof-site-header|site-header|brochure-header)[^"']*["'][^>]*>[\s\S]*?<\/header>/i,nextHeader);
  html = html.replace(/<footer\b[^>]*class=["'][^"']*(?:shared-site-footer|roof-site-footer|site-footer|brochure-footer)[^"']*["'][^>]*>[\s\S]*?<\/footer>/i,nextFooter);
  html = cleanTechnicalActions(file, html, context);
  html=html.replace(/\/assets\/shared-header\.css\?v=[^"']+/g,`/assets/shared-header.css?v=${version}`);
  html=html.replace(/\/assets\/shared-footer\.css\?v=[^"']+/g,`/assets/shared-footer.css?v=${version}`);
  html=html.replace(/\/assets\/shared-header\.js\?v=[^"']+/g,`/assets/shared-header.js?v=${version}`);
  if(!html.includes('/assets/shared-header.css')) html=html.replace('</head>',`  <link rel="stylesheet" href="/assets/shared-header.css?v=${version}">\n</head>`);
  if(!html.includes('/assets/shared-footer.css')) html=html.replace('</head>',`  <link rel="stylesheet" href="/assets/shared-footer.css?v=${version}">\n</head>`);
  if(context === 'guides' && !html.includes('data-guide-mobile-nav-fix')) {
    html=html.replace('</head>',`  <style data-guide-mobile-nav-fix>
    .guide-page .guide-hero{margin-top:0!important}
    @media(max-width:1080px){
      .guide-page .shared-site-header .main-nav{
        z-index:1000;
        height:calc(100dvh - 72px);
        overflow-y:auto;
        overscroll-behavior:contain;
        -webkit-overflow-scrolling:touch;
      }
    }
  </style>\n</head>`);
  }
  if(!html.includes('/assets/shared-header.js')) html=html.replace('</body>',`  <script src="/assets/shared-header.js?v=${version}" defer></script>\n</body>`);
  await writeFile(file,html,'utf8');
  changed++;
}
console.log(`Shared EcoViva chrome synchronized and Technical Library actions cleaned across ${changed} HTML files.`);
