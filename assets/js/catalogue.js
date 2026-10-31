(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.XcontentCatalogue=api;
})(typeof globalThis!=='undefined'?globalThis:window,function(){
 function filterCards(cards,term='',activeFilter='all'){
  const needle=String(term||'').trim().toLowerCase();
  let visibleCount=0;
  Array.from(cards||[]).forEach(card=>{
   const text=String(card.dataset?.title||card.textContent||'').toLowerCase();
   const categories=String(card.dataset?.category||'').split(/\s+/).filter(Boolean);
   const matchesText=text.includes(needle);
   const matchesCategory=activeFilter==='all'||categories.includes(activeFilter);
   const visible=matchesText&&matchesCategory;
   card.hidden=!visible;
   if(visible)visibleCount++;
  });
  return visibleCount;
 }
 return {filterCards};
});