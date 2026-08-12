import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const publicDir = join(root, 'public');
const version = '20260812-header-v1';

const copy = {
  en: {
    what:'What We Do', all:'All renovation solutions', examples:'Renovation Examples', how:'How We Work', why:'Why EcoViva', technical:'Technical Library', guides:'Guides', areas:'Areas', work:'Work with us', who:'Who We Are', office:'Offices & Studio', contact:'Contact', cta:'Start your renovation', nav:'Main navigation', language:'Language', menu:'Open menu'
  },
  es: {
    what:'Qué hacemos', all:'Todas las soluciones', examples:'Ejemplos de reforma', how:'Cómo trabajamos', why:'Por qué EcoViva', technical:'Biblioteca técnica', guides:'Guías', areas:'Zonas', work:'Trabaja con nosotros', who:'Quiénes somos', office:'Oficinas & Estudio', contact:'Contacto', cta:'Empieza tu reforma', nav:'Navegación principal', language:'Idioma', menu:'Abrir menú'
  },
  de: {
    what:'Leistungen', all:'Alle Renovierungslösungen', examples:'Renovierungsbeispiele', how:'Unser Ablauf', why:'Warum EcoViva', technical:'Technische Bibliothek', guides:'Ratgeber', areas:'Regionen', work:'Mit uns arbeiten', who:'Über uns', office:'Büro & Studio', contact:'Kontakt', cta:'Renovierung starten', nav:'Hauptnavigation', language:'Sprache', menu:'Menü öffnen'
  }
};

const defaultLangUrls = { en:'/en/', es:'/es/', de:'/de/' };
const guidePreviewUrls = {
  en:'/preview/guides/damp-moisture-mallorca/',
  es:'/preview/guides/problemas-humedad-mallorca/',
  de:'/preview/guides/feuchtigkeitsprobleme-mallorca/'
};

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

function headerHtml(lang, context, html){
  const c = copy[lang] || copy.en;
  const rootUrl = `/${lang}/`;
  const technicalUrl = `/technical-library/${lang}/`;
  const guideActive = context === 'guides';
  const technicalActive = context === 'technical';
  const langUrls = alternateUrls(html);
  if(guideActive) Object.assign(langUrls, guidePreviewUrls);
  const guidesAttrs = guideActive ? `href="#" aria-current="page"` : `href="#" class="nav-disabled" aria-disabled="true"`;
  return `<header class="site-header shared-site-header"><div class="scroll-progress" aria-hidden="true"><span></span></div><div class="nav-shell"><a class="brand" href="${rootUrl}" aria-label="EcoViva Mallorca"><img src="/assets/logos/ecoviva-horizontal-header.png" alt="EcoViva Mallorca"></a><nav class="main-nav" aria-label="${c.nav}"><div class="nav-dropdown"><button class="nav-dropdown-toggle" type="button" aria-expanded="false">${c.what} <span aria-hidden="true">⌄</span></button><div class="nav-dropdown-menu"><a href="${rootUrl}#what-we-do" data-section-link="what-we-do">${c.all}</a><a href="${rootUrl}#renovation-examples">${c.examples}</a></div></div><a href="${rootUrl}#how-we-work" data-section-link="how-we-work">${c.how}</a><a href="${rootUrl}#why-ecoviva" data-section-link="why-ecoviva">${c.why}</a><a href="${technicalUrl}"${technicalActive?' aria-current="page"':''}>${c.technical}</a><a ${guidesAttrs}>${c.guides}</a><a href="${rootUrl}#areas" data-section-link="areas">${c.areas}</a><a href="${rootUrl}#professionals" data-section-link="professionals">${c.work}</a><div class="nav-dropdown nav-dropdown-right"><button class="nav-dropdown-toggle" type="button" aria-expanded="false">${c.who} <span aria-hidden="true">⌄</span></button><div class="nav-dropdown-menu nav-dropdown-menu-right"><a href="${rootUrl}#about">Markus &amp; Maritza</a><a href="${rootUrl}#areas">${c.office}</a><a href="${rootUrl}#contact">${c.contact}</a></div></div><a class="button" href="${rootUrl}#renovation-request">${c.cta}</a></nav><nav class="language-nav" aria-label="${c.language}">${['en','es','de'].map(l=>`<a href="${langUrls[l]}" lang="${l}"${l===lang?' aria-current="page"':''}>${l.toUpperCase()}</a>`).join('')}</nav><button class="menu-toggle" type="button" aria-label="${c.menu}" aria-expanded="false"><span></span><span></span><span></span></button></div></header>`;
}

function contextFor(file){
  const p = file.replaceAll('\\','/');
  if(p.includes('/technical-library/')) return 'technical';
  if(p.includes('/guides/')) return 'guides';
  return 'main';
}

function shouldProcess(file, html){
  const p = file.replaceAll('\\','/');
  const inScope = /\/public\/(en|es|de)\//.test(p) || p.includes('/public/technical-library/') || p.includes('/public/preview/guides/') || p.includes('/public/guides/');
  return inScope && /<header\b[^>]*class=["'][^"']*(?:site-header|roof-site-header|shared-site-header)[^"']*["']/i.test(html);
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
  const context=contextFor(file);
  const nextHeader=headerHtml(lang,context,html);
  html = html.replace(/<header\b[^>]*class=["'][^"']*(?:shared-site-header|roof-site-header|site-header)[^"']*["'][^>]*>[\s\S]*?<\/header>/i,nextHeader);
  if(!html.includes('/assets/shared-header.css')) html=html.replace('</head>',`  <link rel="stylesheet" href="/assets/shared-header.css?v=${version}">\n</head>`);
  if(!html.includes('/assets/shared-header.js')) html=html.replace('</body>',`  <script src="/assets/shared-header.js?v=${version}" defer></script>\n</body>`);
  await writeFile(file,html,'utf8');
  changed++;
}
console.log(`Shared EcoViva header synchronized across ${changed} HTML files.`);
