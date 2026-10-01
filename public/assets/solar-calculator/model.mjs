import {packages,batteryExample,defaultVat} from './packages.mjs?v=4';
const days=[31,28,31,30,31,30,31,31,30,31,30,31];
export function estimateSolar(input,data){
 const {region,roof,shade,use,mode,value,tariff,fixed}=input;
 if(!['bill','kwh'].includes(mode)||!Number.isFinite(value)||!Number.isFinite(tariff)||!Number.isFinite(fixed)||tariff<.05||tariff>1||fixed<0||fixed>100||value<(mode==='bill'?25:500)||value>(mode==='bill'?1000:40000))throw new Error('invalid');
 if(mode==='bill'&&value<=fixed)throw new Error('bill');
 const consumption=mode==='bill'?(value-fixed)*12/tariff:value;
 const areas=region==='unknown'?Object.values(data.places):[data.places[region]];
 if(areas.some(a=>!a))throw new Error('invalid');
 const lowSlope=['8.5:-90','8.5:0','8.5:90','8.5:180'];
 const keys=roof==='pitched'?lowSlope:roof==='flat'?['10:-90','10:90']:roof==='ground'?['30:-90','30:0','30:90']:roof==='unknown'?[...lowSlope,'10:-90','10:90','30:-90','30:0','30:90']:null;
 if(!keys)throw new Error('invalid');
 const scenarios=areas.flatMap(a=>keys.map(k=>a.scenarios[k]));
 if(scenarios.some(s=>!s||!Number.isFinite(s.yield)||s.monthly.length!==12||s.monthly.some(m=>!Number.isFinite(m)||m<0)))throw new Error('data');
 const shadow={sun:[.9,1],some:[.65,.9],heavy:[0,.65],unknown:[.55,.95]}[shade];
 // Share of household demand in the solar window, not share of PV production consumed.
 // These are explicit screening profiles, not empirically calibrated confidence intervals.
 const daytimeShare={day:[.60,.70],evening:[.25,.35],mixed:[.45,.55],unknown:[.25,.70]}[use];
 if(!shadow||!daytimeShare)throw new Error('invalid');
 const meanMonthly=days.map((_,i)=>scenarios.reduce((sum,s)=>sum+s.monthly[i],0)/scenarios.length);
 const shadeMid=(shadow[0]+shadow[1])/2,dayMid=(daytimeShare[0]+daytimeShare[1])/2;
 const yieldMid=meanMonthly.reduce((a,b)=>a+b,0)*shadeMid;
 const suggestedPanels=[8,12,16,32].find(n=>n*.465*yieldMid>=consumption)||32;
 const panels=input.panels===undefined||input.panels==='auto'?suggestedPanels:Number(input.panels);
 if(!packages[panels])throw new Error('invalid');
 const battery=input.battery===undefined?'no':input.battery;
 if(!['yes','no'].includes(battery))throw new Error('invalid');
 const vat=input.vat===undefined?defaultVat:Number(input.vat);
 if(!Number.isFinite(vat)||vat<0||vat>.3)throw new Error('invalid');
 const exportRate=input.exportRate===undefined?.05:Number(input.exportRate);
 if(!Number.isFinite(exportRate)||exportRate<0||exportRate>.5)throw new Error('invalid');
 const kwp=panels*.465;
 const batteryUnits=battery==='yes'?(panels>=16?2:1):0;
 const usableBattery=batteryUnits*batteryExample.nominalKwh*batteryExample.usableFraction;
 function simulation(monthly,shadeFactor,dayShare,capture){
  let production=0,direct=0,stored=0,exported=0,exportCredit=0;
  monthly.forEach((m,i)=>{
   const pv=m*kwp*shadeFactor,demand=consumption*days[i]/365,pvDaily=pv/days[i],dayDemand=demand*dayShare/days[i],nightDemand=demand*(1-dayShare)/days[i];
   const usedDirect=Math.min(pvDaily*capture,dayDemand);
   const charge=Math.min(Math.max(0,pvDaily-usedDirect),usableBattery,batteryUnits*batteryExample.powerKw*2,nightDemand/batteryExample.roundTripEfficiency);
   const used=(usedDirect+charge*batteryExample.roundTripEfficiency)*days[i];
   const surplus=Math.max(0,pv-(usedDirect+charge)*days[i]);
   exported+=surplus;exportCredit+=Math.min(surplus*exportRate,Math.max(0,demand-used)*tariff);
   direct+=usedDirect*days[i];stored+=charge*batteryExample.roundTripEfficiency*days[i];production+=pv;
  });
  return {production,direct,stored,exported,exportCredit,selfUseSaving:(direct+stored)*tariff,savings:(direct+stored)*tariff+exportCredit};
 }
 const center=simulation(meanMonthly,shadeMid,dayMid,.85);
 const variants=scenarios.flatMap(s=>shadow.flatMap(factor=>daytimeShare.flatMap(share=>[.8,.9].map(capture=>simulation(s.monthly,factor,share,capture)))));
 const range=key=>[Math.min(...variants.map(v=>v[key])),Math.max(...variants.map(v=>v[key]))];
 const net=packages[panels].net+batteryUnits*batteryExample.netAllowance;
 const defaultInvestment=net*(1+vat);
 const investment=input.investment===undefined||input.investment===''?defaultInvestment:Number(input.investment);
 if(!Number.isFinite(investment)||investment<1000||investment>100000)throw new Error('invalid');
 const scheme=input.aidScheme||'none';
 if(!['none','factor','balearic','state40','state10'].includes(scheme))throw new Error('invalid');
 let support=input.support===undefined||input.support===''?0:Number(input.support);
 let aidCeiling=0;
 if(scheme!=='none'){
  if(!input.aidConfirmed)throw new Error('aidconditions');
  if(support!==0)throw new Error('aidcombine');
  if(scheme==='factor'){
   if(!batteryUnits)throw new Error('aidbattery');
   const capacity=batteryUnits*batteryExample.nominalKwh;
   aidCeiling=.45*Math.min(batteryUnits*batteryExample.netAllowance*(1+vat),capacity*(capacity<=10?910:650));
   const grantTax=input.grantTax===''||input.grantTax===undefined?NaN:Number(input.grantTax);
   if(!Number.isFinite(grantTax)||grantTax<0||grantTax>.6)throw new Error('aidtax');
   support=aidCeiling*(1-grantTax);
  }else{
   aidCeiling=scheme==='balearic'?.5*Math.min(investment,10000):scheme==='state40'?.4*Math.min(investment,7500):.1*Math.min(investment,5000);
   const quota=input.taxAvailable===''||input.taxAvailable===undefined?NaN:Number(input.taxAvailable);
   if(!Number.isFinite(quota)||quota<0||quota>100000)throw new Error('aidquota');
   support=Math.min(aidCeiling,quota);
  }
 }
 const supportYear=input.supportYear===undefined?0:Number(input.supportYear);
 if(!Number.isFinite(supportYear)||supportYear<0||supportYear>10)throw new Error('invalid');
 if(!Number.isFinite(support)||support<0||support>=investment)throw new Error('invalid');
 const netInvestment=investment-support;
 const supportedPayback=center.savings>0?(investment/center.savings<=supportYear?investment/center.savings:Math.max(supportYear,netInvestment/center.savings)):null;
 const savings=range('savings');
 const payback=[savings[1]>0?investment/savings[1]:null,savings[0]>0?investment/savings[0]:null];
 return {aidScheme:scheme,aidCeiling,supportYear,support,netInvestment,supportedPayback,production:range('production'),savings,centralSavings:center.savings,centralProduction:center.production,batteryEnergy:center.stored,exportCredit:center.exportCredit,exported:center.exported,selfUseSaving:center.selfUseSaving,exportRate,consumption,kwp,panels,suggestedPanels,battery,tariff,fixed,shadow,daytimeShare,investment,defaultInvestment,net,vat,payback,centralPayback:center.savings>0?investment/center.savings:null,usableBattery,batteryUnits,batteryNominalKwh:batteryUnits*batteryExample.nominalKwh};
}
