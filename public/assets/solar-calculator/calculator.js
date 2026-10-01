import {estimateSolar} from './model.mjs?v=3';
const form=document.querySelector('#solar-calculator'),c=JSON.parse(document.querySelector('#sc-copy').textContent),lang=document.documentElement.lang;
const money=new Intl.NumberFormat(lang,{style:'currency',currency:'EUR',maximumFractionDigits:0}),number=new Intl.NumberFormat(lang,{maximumFractionDigits:0});
let data=null,last=null,step=0;
const valueInput=form.elements.consumption,calculate=document.querySelector('#sc-calculate'),error=document.querySelector('#sc-error');
calculate.disabled=true;calculate.textContent=c.loading;
fetch('/assets/solar-calculator/pvgis-data.json?v=2').then(r=>{if(!r.ok)throw new Error('data');return r.json()}).then(d=>{data=d;calculate.disabled=false;calculate.textContent=c.calculate+' →'}).catch(()=>{error.textContent=c.unavailable;calculate.textContent=c.calculate});
function show(n,scroll=true){step=n;document.querySelectorAll('[data-step]').forEach(el=>el.hidden=Number(el.dataset.step)!==n);document.querySelectorAll('[data-progress]').forEach(el=>{if(Number(el.dataset.progress)===n)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current')});if(n===2)document.querySelector('#result-title').focus();else if(scroll)document.querySelector('.sc-shell').scrollIntoView({behavior:'smooth',block:'start'});}
function read(){return {region:form.elements.region.value,roof:form.elements.roof.value,use:form.elements.use.value,shade:form.elements.shade.value,mode:form.elements.mode.value,value:Number(valueInput.value),tariff:Number(form.elements.tariff.value),fixed:Number(form.elements.fixed.value),panels:form.elements.panels.value,battery:form.elements.battery.value,vat:Number(form.elements.vat.value)/100,investment:form.elements.investment.value,exportRate:Number(form.elements.exportRate.value),support:Number(form.elements.support.value)};}
function roundRange(range,unit){return range.map((x,i)=>unit==='money'?money.format(i?Math.ceil(x/10)*10:Math.floor(x/10)*10):number.format(i?Math.ceil(x/100)*100:Math.floor(x/100)*100)).join(' – ')}
function selectedText(name){return form.querySelector(`input[name="${name}"]:checked`).closest('label').querySelector('span').textContent.replace(/[☀☾◐◒●?✓]/g,'').trim()||'Not sure'}
function handoff(input,r){
 const summary=['SOLAR CALCULATOR TEST',`Locale: ${lang}`,`Area: ${selectedText('region')}`,`Mounting: ${selectedText('roof')}`,`Input: ${input.value} ${input.mode==='bill'?'EUR/month':'kWh/year'}`,`Annual consumption: ${Math.round(r.consumption)} kWh (bill-derived when applicable)`,`Usage: ${selectedText('use')}`,`Shade: ${selectedText('shade')}`,`Model: ${r.panels} Bauer modules / ${r.kwp.toFixed(2)} kWp / suitable Solis / battery: ${r.battery}`,`Production: ${r.production.map(Math.round).join('-')} kWh/year`,`Savings reference: ${Math.round(r.centralSavings)} EUR/year; scenario range ${r.savings.map(Math.round).join('-')}`,`Investment: ${Math.round(r.investment)} EUR incl. VAT assumption ${r.vat*100}% (provisional test budget)`,`User-entered verified support scenario: ${r.support} EUR; net investment ${r.netInvestment} EUR; simple payback ${r.supportedPayback?.toFixed(1)||'not finite'} years (not an eligibility decision)`,`Simple payback: ${r.centralPayback?.toFixed(1)||'not finite'} years`,`Surplus credit: ${Math.round(r.exportCredit)} EUR/year at ${r.exportRate} EUR/kWh, capped monthly; no peak battery sales`, `Battery: ${r.battery==='yes'?`${r.batteryUnits} Marstek VENUS E / ${r.batteryNominalKwh} kWh nominal / 90% usable / 90% efficiency`:'none'}`,`Assumed tariff: ${r.tariff} EUR/kWh; fixed charges: ${r.fixed} EUR/month`,`Orientation unknown; low-pitch roof assumption 8.5 degrees (15%); flat mounting 10 degrees east-west (provisional); ground rack 30 degrees; regional PVGIS; no roof survey; no battery export arbitrage`].join('\n');
 const url=new URL('https://ecoviva-mallorca.fillout.com/t/oPbAk9vnPyus');
 const inbound=new URLSearchParams(location.search);
 const params={contact_type_code:'I have a property or project',request_type_code:'Solar and battery installation',solar_summary:summary,locale:lang,language_code:lang,source:'solar_calculator_test',source_page:location.pathname,form_variant:'solar-calculator-test',schema_version:'solar-v1',request_context:'solar_calculator',utm_source:inbound.get('utm_source')||'website',utm_medium:inbound.get('utm_medium')||'calculator',utm_campaign:inbound.get('utm_campaign')||'solar_test'};
 ['utm_content','utm_term'].forEach(k=>{if(inbound.get(k))params[k]=inbound.get(k)});
 Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,k.startsWith('utm_')?String(v).slice(0,100):v));
 document.querySelector('#solar-intake-link').href=url.toString();
}
form.addEventListener('submit',event=>{event.preventDefault();error.textContent='';if(!data){error.textContent=c.unavailable;return}try{const input=read(),r=estimateSolar(input,data);last={input,result:r};document.querySelector('#saving-central').textContent=money.format(Math.round(r.centralSavings/10)*10);
document.querySelector('#saving-range').textContent=c.rangeLabel+': '+roundRange(r.savings,'money');
document.querySelector('#monthly-range').textContent=money.format(Math.round(r.centralSavings/12))+' · '+c.month;
document.querySelector('#production-central').textContent=number.format(Math.round(r.centralProduction/100)*100);
document.querySelector('#production-range').textContent=c.rangeLabel+': '+roundRange(r.production,'energy');
document.querySelector('#investment-result').textContent=money.format(r.investment);
document.querySelector('#saving-breakdown').textContent=c.directLabel+': '+money.format(r.selfUseSaving)+' · '+c.exportResult+': '+money.format(r.exportCredit);
document.querySelector('#export-assumption').textContent=c.exportLabel+': '+new Intl.NumberFormat(lang,{maximumFractionDigits:2}).format(r.exportRate)+' €/kWh';
const years=x=>x===null?c.notRecovered:new Intl.NumberFormat(lang,{maximumFractionDigits:1}).format(x)+' '+c.years;
document.querySelector('#payback-central').textContent=years(r.centralPayback);
document.querySelector('#support-result').hidden=r.support===0;
document.querySelector('#net-investment').textContent=money.format(r.netInvestment);
document.querySelector('#support-payback').textContent=c.aidPayback+': '+years(r.supportedPayback);
document.querySelector('#payback-range').textContent=c.rangeLabel+': '+(r.payback[0]===null?c.notRecovered:r.payback[1]===null?years(r.payback[0])+' – '+c.notRecovered:years(r.payback[0])+' – '+years(r.payback[1]));
document.querySelector('#system-description').textContent=r.panels+' '+c.systemLabel+' · '+new Intl.NumberFormat(lang,{maximumFractionDigits:2}).format(r.kwp)+' kWp · '+(r.battery==='yes'?c.withBattery+' · '+new Intl.NumberFormat(lang,{maximumFractionDigits:2}).format(r.batteryNominalKwh)+' kWh':c.withoutBattery);
document.querySelector('#shade-warning').hidden=input.shade!=='heavy';
document.querySelector('#assumption-summary').textContent=`${c.assumptionLabels[0]}: ${number.format(r.consumption)} kWh · ${c.tariff}: ${r.tariff} €/kWh · ${c.assumptionLabels[1]}: ${r.fixed} € · ${c.vatLabel}: ${(r.vat*100).toFixed(0)}%`;
handoff(input,r);show(2)}catch(e){error.textContent=e.message==='bill'?c.badBill:c.error;valueInput.focus()}});
form.addEventListener('click',event=>{const b=event.target.closest('[data-next]');if(b)show(Number(b.dataset.next))});
form.addEventListener('change',event=>{if(event.target.name==='mode'){const isKwh=form.elements.mode.value==='kwh';valueInput.min=isKwh?'500':'25';valueInput.max=isKwh?'40000':'1000';valueInput.value=isKwh?'6000':'125';document.querySelector('#value-label').textContent=isKwh?c.annual:c.value;document.querySelector('#value-unit').textContent=isKwh?c.units:c.billUnit;error.textContent='';} if(step===2){document.querySelector('#solar-intake-link').removeAttribute('href');show(1)}});
document.querySelector('#solar-intake-link').addEventListener('click',event=>{if(!last)event.preventDefault()});
document.querySelectorAll('a[href*="/solar-calculator/"],a[href*="/calculadora-solar/"],a[href*="/solar-rechner/"]').forEach(a=>{const u=new URL(a.href);for(const [k,v] of new URLSearchParams(location.search))if(k.startsWith('utm_'))u.searchParams.set(k,v.slice(0,100));a.href=u.toString()});
show(0,false);
