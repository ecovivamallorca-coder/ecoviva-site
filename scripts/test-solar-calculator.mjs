import assert from 'node:assert/strict';
import fs from 'node:fs';
import {estimateSolar} from '../public/assets/solar-calculator/model.mjs';
import {panelSizes,getPackage,batteryExample} from '../public/assets/solar-calculator/packages.mjs';
const data=JSON.parse(fs.readFileSync('public/assets/solar-calculator/pvgis-data.json'));
const base={region:'palma',roof:'pitched',shade:'sun',use:'mixed',mode:'kwh',value:6000,tariff:.25,fixed:20,panels:'12',battery:'no',vat:.21,exportRate:.05};
let count=0;
for(const region of ['palma','calvia','andratx','north','east','unknown'])for(const roof of ['pitched','flat','ground','unknown'])for(const shade of ['sun','some','heavy','unknown'])for(const use of ['day','evening','mixed','unknown'])for(const panels of ['auto',...panelSizes.map(String)])for(const battery of ['no','yes']){
 const r=estimateSolar({...base,region,roof,shade,use,panels,battery},data);count++;
 assert(r.production[0]>=0&&r.production[1]>=r.production[0]);
 assert(r.savings[0]>=0&&r.savings[1]>=r.savings[0]);
 assert(r.savings[1]<=r.consumption*r.tariff+1e-6);
 assert(r.centralSavings>=r.savings[0]-1e-6&&r.centralSavings<=r.savings[1]+1e-6);
 assert(r.centralProduction>=r.production[0]-1e-6&&r.centralProduction<=r.production[1]+1e-6);
 assert(r.batteryEnergy<=r.batteryUnits*5.12*.9*.9*365+1e-6);
 if(battery==='no')assert.equal(r.batteryEnergy,0);
 if(shade==='heavy'){assert.equal(r.savings[0],0);assert.equal(r.payback[1],null);}
 assert(Math.abs(r.centralPayback*r.centralSavings-r.investment)<1e-5);
}
const no=estimateSolar(base,data),yes=estimateSolar({...base,battery:'yes'},data);
assert(yes.centralSavings>=no.centralSavings);
const zeroExport=estimateSolar({...base,exportRate:0},data);
assert.equal(zeroExport.exportCredit,0);assert(no.centralSavings>=zeroExport.centralSavings);
assert(Math.abs(no.centralSavings-no.selfUseSaving-no.exportCredit)<1e-6);
assert.equal(no.investment,getPackage(12,base.roof).net*1.21);assert.equal(yes.investment,(getPackage(12,base.roof).net+batteryExample.netAllowance)*1.21);
assert.equal(estimateSolar({...base,investment:'12000'},data).investment,12000);
assert.equal(estimateSolar({...base,mode:'bill',value:145},data).consumption,6000);
assert.equal(estimateSolar({...base,panels:'32'},data).kwp,14.88);
assert(estimateSolar({...base,use:'day'},data).centralSavings>estimateSolar({...base,use:'evening'},data).centralSavings);
const sunny=estimateSolar(base,data),unknownShade=estimateSolar({...base,shade:'unknown'},data),unknownUse=estimateSolar({...base,use:'unknown'},data);
assert(sunny.production[1]-sunny.production[0]<unknownShade.production[1]-unknownShade.production[0]);
assert(sunny.savings[1]-sunny.savings[0]<unknownUse.savings[1]-unknownUse.savings[0]);
assert(Math.abs(sunny.production[0]-Math.min(...['8.5:-90','8.5:0','8.5:90','8.5:180'].map(k=>data.places.palma.scenarios[k].yield))*5.58*.9)<1);
assert.equal(estimateSolar({...base,panels:'16',battery:'yes'},data).batteryUnits,2);
assert.equal(estimateSolar({...base,panels:'32',battery:'yes'},data).batteryNominalKwh,10.24);
for(const input of [{value:NaN},{mode:'bill',value:25,fixed:30},{region:'invalid'},{tariff:0},{roof:'invalid'},{panels:'20'},{battery:'invalid'},{vat:1},{investment:'100'},{exportRate:-1},{exportRate:1}])assert.throws(()=>estimateSolar({...base,...input},data));
const supported=estimateSolar({...base,support:3000},data);
assert.equal(supported.netInvestment,sunny.investment-3000);
assert.equal(supported.centralSavings,sunny.centralSavings);
assert(Math.abs(supported.supportedPayback*supported.centralSavings-supported.netInvestment)<1e-6);
for(const support of [-1,NaN,sunny.investment,sunny.investment+1])assert.throws(()=>estimateSolar({...base,support},data));
console.log(`${count} scenarios passed: demand/energy caps, battery losses and capacity, all sizes, investment/VAT, payback, unknown-input ranges and invalid inputs.`);
for(const battery of ['no','yes']){
 const r=estimateSolar({...base,battery},data);
 console.log(JSON.stringify({battery,investment:r.investment,saving:Math.round(r.centralSavings),range:r.savings.map(Math.round),payback:r.centralPayback.toFixed(1)}));
}
const conditional={...base,aidConfirmed:true,supportYear:2};
assert.equal(estimateSolar({...conditional,aidScheme:'balearic',taxAvailable:2000},data).support,2000);
assert.equal(estimateSolar({...conditional,aidScheme:'balearic',taxAvailable:10000},data).support,Math.min(5000,no.investment*.5));
assert.equal(estimateSolar({...conditional,aidScheme:'state40',taxAvailable:10000},data).support,3000);
assert.equal(estimateSolar({...conditional,aidScheme:'state10',taxAvailable:10000},data).support,500);
for(const [panels,ceiling] of [['12',1361.25],['16',2722.5]]){
 const r=estimateSolar({...conditional,panels,battery:'yes',aidScheme:'factor',grantTax:.2},data);
 assert(Math.abs(r.aidCeiling-ceiling)<1e-8);assert(Math.abs(r.support-ceiling*.8)<1e-8);
}
assert.throws(()=>estimateSolar({...conditional,aidScheme:'factor',grantTax:0},data));
assert.throws(()=>estimateSolar({...conditional,aidScheme:'balearic'},data));
assert.throws(()=>estimateSolar({...conditional,aidScheme:'state40',taxAvailable:10000,aidConfirmed:false},data));
assert.throws(()=>estimateSolar({...conditional,aidScheme:'state40',taxAvailable:10000,support:100},data));
const delayed=estimateSolar({...base,support:7000,supportYear:8},data);
assert.equal(delayed.supportedPayback,8);
console.log('Support ceilings, usable tax caps, no stacking, grant taxation and receipt timing checks passed.');
for(const occupancy of ['year','summer','occasional'])for(const use of ['day','evening','mixed','unknown']){
 const input={...base,occupancy,use,panels:'auto',battery:'auto'};
 const r=estimateSolar(input,data);
 assert(Math.abs(r.demandWeights.reduce((a,b)=>a+b,0)-1)<1e-10);
 if(occupancy==='summer')assert(Math.abs(r.demandWeights.slice(4,10).reduce((a,b)=>a+b,0)-.8)<1e-10);
 const options=panelSizes.flatMap(panels=>['no','yes'].map(battery=>estimateSolar({...input,panels,battery},data)));
 const fastest=Math.min(...options.map(x=>x.centralPayback));
 assert(r.centralPayback<=fastest*1.05+1e-10);
 assert.equal(r.investment,Math.min(...options.filter(x=>x.centralPayback<=fastest*1.05).map(x=>x.investment)));
 assert(r.centralSavings<=r.consumption*r.tariff+1e-8);
}
const darkAuto=estimateSolar({...base,panels:'auto',battery:'auto',shade:'heavy'},data);
assert(panelSizes.includes(darkAuto.panels));
assert.throws(()=>estimateSolar({...base,occupancy:'invalid'},data));
console.log('Seasonal demand conservation and automatic economic suggestions passed.');
