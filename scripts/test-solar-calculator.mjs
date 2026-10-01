import assert from 'node:assert/strict';
import fs from 'node:fs';
import {estimateSolar} from '../public/assets/solar-calculator/model.mjs';
const data=JSON.parse(fs.readFileSync('public/assets/solar-calculator/pvgis-data.json'));
const base={region:'palma',roof:'pitched',shade:'sun',use:'mixed',mode:'kwh',value:6000,tariff:.25,fixed:20};
for(const region of ['palma','calvia','andratx','north','east','unknown'])for(const roof of ['pitched','flat','ground','unknown'])for(const shade of ['sun','some','heavy','unknown'])for(const use of ['day','evening','mixed','unknown']){
 const r=estimateSolar({...base,region,roof,shade,use},data);
 assert(r.production[0]>=0&&r.production[1]>=r.production[0]);
 assert(r.savings[0]>=0&&r.savings[1]>=r.savings[0]);
 assert(r.savings[1]<=r.consumption*r.tariff+1e-6);
 if(shade==='heavy')assert.equal(r.savings[0],0);
}
const bill=estimateSolar({...base,mode:'bill',value:145},data);
assert.equal(bill.consumption,6000);
assert.deepEqual(bill.savings,estimateSolar(base,data).savings);
const low=estimateSolar({...base,value:1000},data),high=estimateSolar({...base,value:12000},data);
assert(high.savings[0]>=low.savings[0]&&high.savings[1]>=low.savings[1]);
assert(estimateSolar({...base,use:'day'},data).savings[0]>=estimateSolar({...base,use:'evening'},data).savings[1]);
assert.throws(()=>estimateSolar({...base,value:NaN},data));
assert.throws(()=>estimateSolar({...base,mode:'bill',value:25,fixed:30},data));
assert.throws(()=>estimateSolar({...base,region:'invalid'},data));
assert.throws(()=>estimateSolar({...base,tariff:0},data));
console.log('384 scenarios, demand caps, bill conversion, profile comparison and invalid inputs passed.');
