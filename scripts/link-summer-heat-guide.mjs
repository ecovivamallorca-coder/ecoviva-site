import fs from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const markerStart='<!-- SUMMER-HEAT-BACKLINK:START -->';
const markerEnd='<!-- SUMMER-HEAT-BACKLINK:END -->';
const targets=[
  ['en','public/technical-library/en/traditional-mallorcan-roof/index.html','Heat, insulation and the building envelope','See why Mallorca’s hottest August puts roof and façade insulation in focus.','/guides/en/mallorca-hottest-august-home-insulation/','Read the Guide'],
  ['en','public/technical-library/en/etics-external-wall-insulation/index.html','Heat, insulation and the building envelope','See why Mallorca’s hottest August puts roof and façade insulation in focus.','/guides/en/mallorca-hottest-august-home-insulation/','Read the Guide'],
  ['es','public/technical-library/es/traditional-mallorcan-roof/index.html','Calor, aislamiento y envolvente','Descubre por qué el agosto más cálido de Mallorca pone el foco en cubiertas y fachadas.','/guides/es/agosto-mas-caluroso-mallorca-aislamiento-vivienda/','Leer la guía'],
  ['es','public/technical-library/es/sistema-sate-aislamiento-exterior/index.html','Calor, aislamiento y envolvente','Descubre por qué el agosto más cálido de Mallorca pone el foco en cubiertas y fachadas.','/guides/es/agosto-mas-caluroso-mallorca-aislamiento-vivienda/','Leer la guía'],
  ['de','public/technical-library/de/traditional-mallorcan-roof/index.html','Hitze, Dämmung und Gebäudehülle','Erfahren Sie, warum Mallorcas heißester August Dach- und Fassadendämmung in den Mittelpunkt rückt.','/guides/de/heissester-august-mallorca-waermedaemmung/','Ratgeber lesen'],
  ['de','public/technical-library/de/wdvs-aussendaemmung-putzfassade/index.html','Hitze, Dämmung und Gebäudehülle','Erfahren Sie, warum Mallorcas heißester August Dach- und Fassadendämmung in den Mittelpunkt rückt.','/guides/de/heissester-august-mallorca-waermedaemmung/','Ratgeber lesen']
];

for(const [,rel,heading,text,href,label] of targets){
  const file=path.join(root,rel);
  let html;
  try{html=await fs.readFile(file,'utf8')}catch{continue}
  html=html.replace(new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`,'g'),'');
  const block=`${markerStart}<section class="heat-guide-backlink" style="max-width:1120px;margin:42px auto;padding:30px;border-radius:16px;background:#f3f1e9"><p style="margin:0 0 8px;color:#477d38;font-size:.78rem;font-weight:800;letter-spacing:.13em;text-transform:uppercase">EcoViva Guide</p><h2 style="margin:0 0 10px">${heading}</h2><p>${text}</p><a href="${href}" style="color:#3e6b20;font-weight:800">${label} →</a></section>${markerEnd}`;
  html=html.replace('</main>',`${block}</main>`);
  await fs.writeFile(file,html,'utf8');
}
console.log('Added Summer Heat Guide backlinks to relevant Technical Library pages.');
