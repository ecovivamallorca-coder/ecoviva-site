(()=>{
  const header=document.querySelector('.shared-site-header');
  if(!header)return;
  const toggle=header.querySelector('.menu-toggle');
  const nav=header.querySelector('.main-nav');
  const state=header.querySelector('.menu-state');
  const setMenu=open=>{
    if(state)state.checked=open;
    document.body.classList.toggle('menu-open',open);
    nav?.classList.toggle('is-open',open);
    toggle?.setAttribute('aria-expanded',String(open));
  };
  if(state&&toggle&&nav){
    state.addEventListener('change',()=>setMenu(state.checked));
  }else if(toggle&&nav){
    toggle.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      setMenu(!nav.classList.contains('is-open'));
    });
    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
      setMenu(false);
      header.querySelectorAll('.nav-dropdown.is-open').forEach(item=>{
        item.classList.remove('is-open');
        item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded','false');
      });
    }));
  }
  header.querySelectorAll('.nav-dropdown-toggle').forEach(button=>button.addEventListener('click',event=>{
    event.stopPropagation();
    const dropdown=button.closest('.nav-dropdown');
    const open=!dropdown.classList.contains('is-open');
    header.querySelectorAll('.nav-dropdown.is-open').forEach(item=>{
      item.classList.remove('is-open');
      item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded','false');
    });
    dropdown.classList.toggle('is-open',open);
    button.setAttribute('aria-expanded',String(open));
  }));
  document.addEventListener('click',event=>{
    if(!header.contains(event.target))setMenu(false);
    header.querySelectorAll('.nav-dropdown.is-open').forEach(item=>{
      item.classList.remove('is-open');
      item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded','false');
    });
  });
  window.addEventListener('resize',()=>{if(window.innerWidth>1080)setMenu(false);},{passive:true});
  const progress=header.querySelector('.scroll-progress span');
  const updateProgress=()=>{
    if(!progress)return;
    const scrollable=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.width=`${Math.min(100,Math.max(0,(scrollable>0?window.scrollY/scrollable:0)*100))}%`;
  };
  updateProgress();
  window.addEventListener('scroll',updateProgress,{passive:true});
})();
