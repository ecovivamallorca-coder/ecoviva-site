import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const publicDir = join(process.cwd(), 'public');
const guideUrls = {
  en:'/guides/en/damp-moisture-mallorca/',
  es:'/guides/es/problemas-humedad-mallorca/',
  de:'/guides/de/feuchtigkeitsprobleme-mallorca/'
};
const labels = { en:'Guides', es:'Guías', de:'Ratgeber' };

function langFor(file, html){
  const p=file.replaceAll('\\','/');
  const m=p.match(/\/(?:guides|technical-library)\/(en|es|de)\//)||p.match(/\/public\/(en|es|de)\//);
  if(m) return m[1];
  const h=html.match(/<html[^>]+lang=["'](en|es|de)/i);
  return h?h[1].toLowerCase():'en';
}

async function walk(dir){
  const entries=await readdir(dir,{withFileTypes:true});
  const files=[];
  for(const e of entries){
    const full=join(dir,e.name);
    if(e.isDirectory()) files.push(...await walk(full));
    else if(e.isFile()&&e.name.endsWith('.html')) files.push(full);
  }
  return files;
}

let changed=0;
for(const file of await walk(publicDir)){
  let html=await readFile(file,'utf8');
  const lang=langFor(file,html);
  const url=guideUrls[lang];
  const label=labels[lang];
  let next=html;

  next=next.replace(new RegExp(`<a href="#" class="nav-disabled" aria-disabled="true">${label}<\\/a>`,'g'), `<a href="${url}">${label}</a>`);
  next=next.replace(new RegExp(`<span class="footer-disabled" aria-disabled="true">${label}<\\/span>`,'g'), `<a href="${url}">${label}</a>`);

  if(file.replaceAll('\\','/').includes('/public/guides/')){
    next=next.replaceAll('/preview/guides/damp-moisture-mallorca/', guideUrls.en)
             .replaceAll('/preview/guides/problemas-humedad-mallorca/', guideUrls.es)
             .replaceAll('/preview/guides/feuchtigkeitsprobleme-mallorca/', guideUrls.de);
  }

  if(next!==html){ await writeFile(file,next,'utf8'); changed++; }
}
console.log(`Activated public Guides links across ${changed} HTML files.`);
