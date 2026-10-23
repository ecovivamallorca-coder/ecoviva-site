// A compact presentation of the existing calculator. All inputs, model results
// and the Fillout handoff stay owned by calculator.js.
export function installSocialFlow(form, copy, lang, show) {
  const text = {
    en: {question:'Question',of:'of',result:'Your solar estimate',answers:'Your answers',privacy:'See your result first. No contact details needed.',review:'Please choose an answer to continue.',settings:'Optional calculation settings',discuss:'Discuss my calculation'},
    es: {question:'Pregunta',of:'de',result:'Tu estimación solar',answers:'Tus respuestas',privacy:'Primero, tu resultado. Sin datos de contacto.',review:'Elige una respuesta para continuar.',settings:'Ajustes opcionales del cálculo',discuss:'Comentar mi cálculo'},
    de: {question:'Frage',of:'von',result:'Ihre Solareinschätzung',answers:'Ihre Antworten',privacy:'Erst Ihr Ergebnis. Ohne Kontaktdaten.',review:'Bitte wählen Sie eine Antwort.',settings:'Optionale Berechnungseinstellungen',discuss:'Meine Berechnung besprechen'}
  }[lang] || {question:'Question',of:'of',result:'Your solar estimate',answers:'Your answers',privacy:'See your result first. No contact details needed.',review:'Please choose an answer to continue.',settings:'Optional calculation settings',discuss:'Discuss my calculation'};
  const start = form.querySelector('[data-step="0"]');
  const electricity = form.querySelector('[data-step="1"]');
  const results = form.querySelector('[data-step="2"]');
  const progress = document.querySelector('.sc-progress');
  const calculate = document.querySelector('#sc-calculate');
  const error = document.querySelector('#sc-error');
  const originalSettings = [...electricity.querySelectorAll(':scope > details')];
  const group = name => form.querySelector(`input[name="${name}"]`).closest('fieldset');
  const help = message => { const p=document.createElement('p'); p.className='sc-help'; p.textContent=message; return p; };
  const billTitle = electricity.querySelector('h2');
  const panels = [
    {name:'region', nodes:[group('region'),document.querySelector('#solar-town-label'),help(copy.regionHelp)]},
    {name:'roof', nodes:[group('roof')]},
    {name:'consumption', nodes:[billTitle,help(copy.billHelp+' '+copy.occupancyHelp),electricity.querySelector('.sc-modes'),electricity.querySelector('.sc-number'),document.querySelector('#bill-slider')]},
    {name:'occupancy', nodes:[group('occupancy')]},
    {name:'ev', nodes:[group('ev'),help(copy.evHelp)]},
    {name:'use', nodes:[group('use')]},
    {name:'shade', nodes:[group('shade')]},
    {name:'battery', nodes:[group('battery'),help(copy.batteryHelp)]}
  ];
  // Move the real controls rather than cloning them or maintaining a second model.
  for (const panel of panels) {
    panel.element=document.createElement('div');
    panel.element.className='sc-social-panel';
    panel.element.append(...panel.nodes);
  }
  const settings=document.createElement('details');
  settings.className='sc-assumptions sc-social-settings';
  const settingsTitle=document.createElement('summary');
  settingsTitle.textContent=text.settings;
  settings.append(settingsTitle,...originalSettings);
  panels.at(-1).element.append(settings);
  const status=document.createElement('p');
  status.className='sc-social-status'; status.setAttribute('aria-live','polite');
  const track=document.createElement('div'); track.className='sc-social-track';
  track.setAttribute('role','progressbar'); track.setAttribute('aria-valuemin','0'); track.setAttribute('aria-valuemax',String(panels.length));
  const fill=document.createElement('span'); track.append(fill);
  progress.replaceChildren(status,track);
  const nav=document.createElement('div'); nav.className='sc-actions sc-social-actions';
  const back=document.createElement('button'); back.type='button'; back.className='sc-secondary'; back.textContent='← '+copy.back;
  const next=document.createElement('button'); next.type='button'; next.className='sc-primary'; next.textContent=copy.next+' →';
  nav.append(back,next,calculate);
  // Detach the new panels before removing the old section wrappers.
  const all=document.createDocumentFragment();
  all.append(...panels.map(p=>p.element),error,nav);
  start.replaceChildren(all);
  electricity.replaceChildren();
  let current=0;
  function render(index, focus=true) {
    current=index;
    show(0,false);
    panels.forEach((p,i)=>{p.element.hidden=i!==index});
    back.hidden=index===0;
    next.hidden=index===panels.length-1;
    calculate.hidden=index!==panels.length-1;
    error.textContent='';
    status.textContent=`${text.question} ${index+1} ${text.of} ${panels.length}`;
    track.setAttribute('aria-valuenow',String(index+1));
    track.setAttribute('aria-label',status.textContent);
    fill.style.width=`${(index+1)/panels.length*100}%`;
    if(focus) {
      const title=panels[index].element.querySelector('legend,h2');
      title.tabIndex=-1; title.focus({preventScroll:true});
      document.querySelector('.sc-shell').scrollIntoView({block:'start',behavior:'smooth'});
    }
  }
  function valid() {
    const name=panels[current].name;
    if(name==='consumption') {
      const value=form.elements.consumption;
      if(!value.value||!value.checkValidity()) {error.textContent=copy.error;value.focus();return false;}
    } else if(!form.elements[name].value) {error.textContent=text.review;return false;}
    return true;
  }
  next.addEventListener('click',()=>{if(valid())render(current+1)});
  back.addEventListener('click',()=>render(current-1));
  // Enter on the amount must not submit a partially answered calculator.
  form.addEventListener('submit',event=>{
    if(current<panels.length-1) {event.preventDefault();event.stopImmediatePropagation();if(valid())render(current+1);}
  },true);
  form.addEventListener('click',event=>{
    if(event.target.closest('[data-next]')) {event.preventDefault();event.stopImmediatePropagation();render(0);}
  },true);
  const brand=document.createElement('div'); brand.className='sc-social-brand';
  const logo=document.createElement('img'); logo.src='/assets/logos/ecoviva_mallorca_horizontal_darkgreen.svg';logo.alt='EcoViva Mallorca';logo.width=190;logo.height=48;
  const brandLabel=document.createElement('span');brandLabel.textContent='SOLAR & BATTERY';
  brand.append(logo,brandLabel);
  const main=document.querySelector('.sc-main');main.prepend(brand);
  const note=help(text.privacy);note.classList.add('sc-social-privacy');document.querySelector('.sc-intro').append(note);
  const footer=document.createElement('p');footer.className='sc-social-footer';
  const privacy=document.createElement('a');privacy.href=({en:'/en/privacy-policy/',es:'/es/politica-de-privacidad/',de:'/de/datenschutzerklaerung/'})[lang]||'/en/privacy-policy/';privacy.textContent=({en:'Privacy',es:'Privacidad',de:'Datenschutz'})[lang]||'Privacy';
  footer.append('EcoViva Mallorca SL · ',privacy);main.append(footer);
  render(0,false);
  return { onError(e) {if(['bill','invalid'].includes(e.message))render(2);}, onShow(n) {
    if(n!==2)return;
    status.textContent=text.result;track.setAttribute('aria-valuenow',String(panels.length));track.setAttribute('aria-label',text.result);fill.style.width='100%';
    const advice=document.querySelector('#solar-advice-results');
    const summary=advice.querySelector('.sc-input-summary');
    if(summary){const details=document.createElement('details');details.className='sc-assumptions';const title=document.createElement('summary');title.textContent=text.answers;details.append(title,summary);advice.append(details);}
    const chosen=advice.querySelector('[data-scenario="selected"]');
    const recommended=advice.querySelector('[data-scenario="recommended"]');
    if(chosen&&recommended&&chosen.querySelector('h3').textContent===recommended.querySelector('h3').textContent&&chosen.querySelector('dl').textContent===recommended.querySelector('dl').textContent)chosen.hidden=true;
    const lead=results.querySelector('.sc-lead');
    const conditions=results.querySelector('.sc-result-conditions');
    advice.after(conditions,lead);
    lead.querySelector('h3').textContent=text.discuss;
    document.querySelector('#solar-intake-link').textContent=text.discuss+' →';
  }};
}
