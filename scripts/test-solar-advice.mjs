import assert from 'node:assert/strict';
import fs from 'node:fs';
import {compareSolar,scenarioRecord} from '../public/assets/solar-calculator/advice.mjs';
import {estimateSolar} from '../public/assets/solar-calculator/model.mjs?v=6';
const data=JSON.parse(fs.readFileSync('public/assets/solar-calculator/pvgis-data.json'));
const base={region:'calvia',roof:'pitched',shade:'sun',use:'day',occupancy:'year',mode:'kwh',value:3500,tariff:.25,fixed:20,panels:'8',battery:'yes',vat:.21,exportRate:0};
const rob=compareSolar(base,data);
assert.deepEqual(rob.selected,estimateSolar(base,data));
assert.equal(rob.selected.battery,'yes');
assert.equal(rob.recommended.battery,'no');
assert(rob.recommended.centralPayback<=rob.selected.centralPayback*1.05);
assert(rob.investmentDifference<0);
assert(rob.savingDifference<0); // Storage saves more annually, but costs more.
assert.equal(rob.selectedExVat,8500);
const larger=compareSolar({...base,value:15000},data);
assert(larger.recommended.panels>larger.selected.panels);
assert([16,32].includes(larger.recommended.panels));
assert(larger.savingDifference>0);
assert(compareSolar({...base,shade:'unknown'},data).provisional);
const custom=compareSolar({...base,investment:'12000'},data);
assert(custom.customBudget);
assert.equal(custom.selectedExVat,12000/1.21);
assert.equal(custom.improvesPayback,false);
const same=compareSolar({...base,battery:'no'},data);
assert(same.sameSystem);
for(const use of ['day','mixed','evening'])for(const value of [2000,6000,15000,40000])for(const battery of ['auto','no','yes']){
 const c=compareSolar({...base,use,value,battery},data);
 assert.equal(c.options.length,8);
 const fastest=Math.min(...c.options.map(x=>x.centralPayback));
 assert(c.recommended.centralPayback<=fastest*1.05+1e-9);
 const record=JSON.parse(JSON.stringify({selected:scenarioRecord(c.selected,c.selectedExVat),recommended:scenarioRecord(c.recommended)}));
 assert.equal(record.selected.annual_consumption_kwh,value);
 assert.equal(record.recommended.annual_consumption_kwh,value);
 assert.equal(record.selected.investment_with_assumed_vat,c.selected.investment);
 assert.equal(record.recommended.investment_ex_vat,c.recommended.net);
}
console.log('Solar advice: customer choice, larger sizing, battery tradeoff, unknown inputs, custom budgets and 36 scenario comparisons passed.');
