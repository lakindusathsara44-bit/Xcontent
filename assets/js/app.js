document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.site-header nav');
  if(toggle&&nav)toggle.addEventListener('click',()=>nav.classList.toggle('open'));

  const gate=document.getElementById('ageGate');
  if(gate){
    const accepted=sessionStorage.getItem('xcontent_demo_age_confirmed')==='yes';
    if(!accepted){gate.classList.add('visible');document.body.classList.add('age-locked');}
    const confirm=document.getElementById('ageConfirm');
    if(confirm)confirm.addEventListener('click',()=>{
      sessionStorage.setItem('xcontent_demo_age_confirmed','yes');
      gate.classList.remove('visible');document.body.classList.remove('age-locked');
    });
  }

  const cards=[...document.querySelectorAll('.video-card')];
  const searchForm=document.getElementById('videoSearch');
  const searchInput=document.getElementById('searchInput');
  let activeFilter='all';
  function filterVideos(){
    const term=(searchInput?.value||'').trim().toLowerCase();
    let shown=0;
    cards.forEach(card=>{
      const matchesText=(card.dataset.title||'').toLowerCase().includes(term);
      const categories=(card.dataset.category||'').split(/\\s+/);
      const matchesCategory=activeFilter==='all'||categories.includes(activeFilter);
      const visible=matchesText&&matchesCategory;
      card.hidden=!visible;
      if(visible)shown++;
    });
    const empty=document.getElementById('emptyResults');
    if(empty)empty.hidden=shown!==0;
  }
  if(searchForm)searchForm.addEventListener('submit',event=>{event.preventDefault();filterVideos();});
  if(searchInput)searchInput.addEventListener('input',filterVideos);
  document.querySelectorAll('.category-chip').forEach(chip=>chip.addEventListener('click',()=>{
    document.querySelectorAll('.category-chip').forEach(item=>item.classList.remove('active'));
    chip.classList.add('active');activeFilter=chip.dataset.filter||'all';filterVideos();
  }));
});
function showToast(message){let toast=document.querySelector('.toast');if(!toast){toast=document.createElement('div');toast.className='toast';document.body.appendChild(toast);}toast.textContent=message;toast.style.display='block';clearTimeout(window.xToastTimer);window.xToastTimer=setTimeout(()=>toast.style.display='none',2600);}
