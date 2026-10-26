const host=document.querySelector('#professional-embed');
const language=document.documentElement.lang;
const tracking=new URLSearchParams(location.search);
const labels={en:'English',es:'Spanish',de:'German'};
let script;
document.querySelectorAll('[data-professional]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-professional]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
  const params={request_context:'social_professional',contact_type_code:button.dataset.professional==='contractor'?'I am a contractor or specialist':'I am a partner or real estate professional',locale:language,language_code:labels[language],source:'social_professional',form_variant:'social-professional',source_page:location.pathname};
  for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'])if(tracking.has(key))params[key]=tracking.get(key).slice(0,100);
  const url=new URL('https://ecoviva-mallorca.fillout.com/t/59qsbh9ckrus');
  for(const[key,value]of Object.entries(params))url.searchParams.set(key,value);
  const fallback=document.querySelector('#open-professional');fallback.href=url.toString();fallback.hidden=false;
  host.replaceChildren();
  const mount=document.createElement('div');mount.setAttribute('data-fillout-id','59qsbh9ckrus');mount.setAttribute('data-fillout-embed-type','standard');mount.setAttribute('data-fillout-dynamic-resize','');
  for(const[key,value]of Object.entries(params))mount.setAttribute('data-'+key,value);
  mount.style.minHeight='640px';host.append(mount);script?.remove();script=document.createElement('script');script.src='https://server.fillout.com/embed/v1/';script.async=true;document.body.append(script);
}));
for(const link of document.querySelectorAll('[data-language]')){
  const url=new URL(link.href);for(const[key,value]of tracking)if(key.startsWith('utm_'))url.searchParams.set(key,value.slice(0,100));link.href=url.toString();
}
