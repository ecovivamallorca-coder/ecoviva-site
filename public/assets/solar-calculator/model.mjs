export function estimateSolar(input,data){
 const {region,roof,shade,use,mode,value,tariff,fixed}=input;
 if(!Number.isFinite(value)||!Number.isFinite(tariff)||!Number.isFinite(fixed)||tariff<.05||tariff>1||fixed<0||fixed>100||value<(mode==='bill'?25:500)||value>(mode==='bill'?1000:40000))throw new Error('invalid');
 if(mode==='bill'&&value<=fixed)throw new Error('bill');
 const consumption=mode==='bill'?(value-fixed)*12/tariff:value;
 const areas=region==='unknown'?Object.values(data.places):[data.places[region]];
 if(areas.some(a=>!a))throw new Error('invalid');
 const lowSlope=['8.5:-90','8.5:0','8.5:90','8.5:180'];
 const keys=roof==='pitched'?lowSlope:roof==='flat'?['10:-90','10:90']:roof==='ground'?['30:-90','30:0','30:90']:roof==='unknown'?[...lowSlope,'10:-90','10:90','30:-90','30:0','30:90']:null;
 if(!keys)throw new Error('invalid');
 const scenarios=areas.flatMap(a=>keys.map(k=>a.scenarios[k]));
 if(scenarios.some(s=>!s||!Number.isFinite(s.yield)||s.monthly.length!==12))throw new Error('data');
 const shadow={sun:[.9,1],some:[.65,.9],heavy:[0,.65],unknown:[.55,.95]}[shade];
 const selfUse={day:[.4,.65],evening:[.1,.25],mixed:[.25,.45],unknown:[.15,.5]}[use];
 if(!shadow||!selfUse)throw new Error('invalid');
 const kwp=5.58;
 const production=[Math.min(...scenarios.map(s=>s.yield))*kwp*shadow[0],Math.max(...scenarios.map(s=>s.yield))*kwp*shadow[1]];
 // Equal monthly demand is a screening assumption, not an hourly load simulation.
 const savings=shadow.map((factor,i)=>{
  const values=scenarios.map(s=>s.monthly.reduce((sum,m)=>sum+Math.min(consumption/12,m*kwp*factor*selfUse[i]),0)*tariff);
  return i?Math.max(...values):Math.min(...values);
 });
 return {production,savings,consumption,kwp,tariff,fixed,shadow,selfUse};
}
