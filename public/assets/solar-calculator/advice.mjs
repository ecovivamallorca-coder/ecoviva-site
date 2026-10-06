import {estimateSolar} from './model.mjs?v=7';
import {panelSizes} from './packages.mjs?v=5';

export const adviceVersion='solar-advice-v2';
export function compareSolar(input,data){
 const selected=estimateSolar(input,data);
 // Same demand, tariff, roof, location and VAT for every option. Compare before support.
 const options=panelSizes.flatMap(panels=>['no','yes'].map(battery=>estimateSolar({...input,panels,battery,investment:'',aidScheme:'none',support:0,supportYear:0},data)));
 const finite=options.filter(r=>Number.isFinite(r.centralPayback)&&r.centralPayback>0);
 const fastest=finite.length?Math.min(...finite.map(r=>r.centralPayback)):null;
 // Avoid spending more for an immaterial improvement in payback.
 const shortlist=fastest===null?options:finite.filter(r=>r.centralPayback<=fastest*1.05);
 const recommended=shortlist.sort((a,b)=>a.net-b.net||a.panels-b.panels)[0];
 const sameSystem=selected.panels===recommended.panels&&selected.battery===recommended.battery;
 const customBudget=input.investment!==undefined&&input.investment!=='';
 const selectedExVat=customBudget?selected.investment/(1+selected.vat):selected.net;
 const investmentDifference=recommended.net-selectedExVat;
 const savingDifference=recommended.centralSavings-selected.centralSavings;
 const paybackDifference=selected.centralPayback===null||recommended.centralPayback===null?null:selected.centralPayback-recommended.centralPayback;
 const provisional=['unknown'].includes(input.shade)||input.shade==='heavy'||input.roof==='unknown'||input.use==='unknown'||input.ev==='soon';
 const improvesPayback=!customBudget&&!provisional&&paybackDifference!==null&&paybackDifference>.05;
 return {version:adviceVersion,selected,recommended,options,sameSystem,customBudget,provisional,selectedExVat,investmentDifference,savingDifference,paybackDifference,improvesPayback};
}

export function scenarioRecord(r,exVat=r.net){
 return {panels:r.panels,kwp:r.kwp,battery:r.battery,battery_units:r.batteryUnits,battery_kwh:r.batteryNominalKwh,investment_ex_vat:exVat,investment_with_assumed_vat:r.investment,vat_assumption:r.vat,annual_consumption_kwh:r.consumption,production_kwh:r.centralProduction,production_range_kwh:r.production,savings_eur:r.centralSavings,savings_range_eur:r.savings,payback_years:r.centralPayback,self_use_saving_eur:r.selfUseSaving,surplus_credit_eur:r.exportCredit,support_eur:r.support,price_basis:r.packageBudget.priceSnapshot,inverter_units:r.packageBudget.inverterUnits,inverter_kw_per_unit:r.packageBudget.inverterKw,supply_assumption:r.packageBudget.phaseAssumption};
}
