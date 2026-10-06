// Holded sale-price snapshot checked 6 October 2026. Indicative configuration;
// final supply, inverter arrangement and scope are confirmed after assessment.
export const panelSizes=[8,12,16,24,32,40,48];
export const priceSnapshot='holded-2026-10-06';
const panelPrices={pitched:[309.31,299.65,290.57,286.23,282.02,273.96,266.35],flat:[350.79,339.83,329.53,324.61,319.84,310.70,302.07],ground:[464.10,449.59,435.97,429.46,423.15,411.06,399.64]};
const inverterPrices=[2053.23,1989.06,3227.21,3179.04,3132.29,3042.80,2958.28];
// Planning, site preparation, commissioning, legalisation and team travel.
const fixedServices=215.63+287.50+468.75+390.63+234.38;
export function getPackage(panels,roof='pitched'){
 const i=panelSizes.indexOf(Number(panels));if(i<0)throw new Error('invalid');
 const mounting=roof==='unknown'?'pitched':roof;
 if(!panelPrices[mounting])throw new Error('invalid');
 const inverterUnits=panels>=40?2:1;
 const inverterKw=panels<=12?5:10;
 const panelSubtotal=panels*panelPrices[mounting][i],inverterSubtotal=inverterUnits*inverterPrices[i];
 return {net:Math.round((panelSubtotal+inverterSubtotal+fixedServices)*100)/100,panelSubtotal,inverterSubtotal,fixedServices,inverterUnits,inverterKw,priceSnapshot,mounting,phaseAssumption:panels<=12?'single':'three'};
}
export const packages=Object.fromEntries(panelSizes.map(n=>[n,getPackage(n)]));
export const batteryExample={model:'Marstek VENUS E',nominalKwh:5.12,usableFraction:.9,roundTripEfficiency:.9,powerKw:2.5,netAllowance:2500};
export const defaultVat=.21;
