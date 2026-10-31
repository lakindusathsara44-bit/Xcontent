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
      const categories=(card.dataset.category||'').split(/\s+/);
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

  // Browser-local reactions, comments and reports for this single demo video.
  const videoKey='xcontent_demo_video_nature_motion_v1';
  const readState=()=>{try{return JSON.parse(localStorage.getItem(videoKey))||{reaction:null,comments:[],reports:[]};}catch{return {reaction:null,comments:[],reports:[]};}};
  const saveState=state=>{try{localStorage.setItem(videoKey,JSON.stringify(state));return true;}catch{showToast('Browser storage is unavailable.');return false;}};
  const like=document.getElementById('likeButton'),dislike=document.getElementById('dislikeButton');
  const likeCount=document.getElementById('likeCount'),dislikeCount=document.getElementById('dislikeCount');
  const commentsList=document.getElementById('commentsList'),commentCount=document.getElementById('commentCount');
  function renderInteractions(){
    const state=readState();
    if(like){like.setAttribute('aria-pressed',String(state.reaction==='like'));like.classList.toggle('selected',state.reaction==='like');}
    if(dislike){dislike.setAttribute('aria-pressed',String(state.reaction==='dislike'));dislike.classList.toggle('selected',state.reaction==='dislike');}
    if(likeCount)likeCount.textContent=state.reaction==='like'?'1':'0';
    if(dislikeCount)dislikeCount.textContent=state.reaction==='dislike'?'1':'0';
    if(commentCount)commentCount.textContent=String(state.comments.length);
    if(commentsList){
      commentsList.replaceChildren();
      if(!state.comments.length){const p=document.createElement('p');p.className='empty-state';p.textContent='No comments yet. Be the first to comment.';commentsList.append(p);}
      state.comments.slice().reverse().forEach(comment=>{
        const article=document.createElement('article');article.className='comment-item';
        const head=document.createElement('div');head.className='comment-head';
        const author=document.createElement('b');author.textContent='Demo visitor';
        const time=document.createElement('small');time.textContent=new Date(comment.time).toLocaleString();
        const body=document.createElement('p');body.textContent=comment.text;
        head.append(author,time);article.append(head,body);commentsList.append(article);
      });
    }
  }
  if(like)like.addEventListener('click',()=>{const s=readState();s.reaction=s.reaction==='like'?null:'like';saveState(s);renderInteractions();});
  if(dislike)dislike.addEventListener('click',()=>{const s=readState();s.reaction=s.reaction==='dislike'?null:'dislike';saveState(s);renderInteractions();});
  const commentForm=document.getElementById('commentForm');
  if(commentForm)commentForm.addEventListener('submit',event=>{
    event.preventDefault();const input=document.getElementById('commentInput');const value=input.value.trim();
    if(!value)return;const s=readState();s.comments.push({text:value,time:Date.now()});
    if(saveState(s)){input.value='';renderInteractions();showToast('Demo comment added on this device.');}
  });
  const reportToggle=document.getElementById('reportToggle'),reportForm=document.getElementById('reportForm');
  if(reportToggle&&reportForm)reportToggle.addEventListener('click',()=>{reportForm.hidden=!reportForm.hidden;});
  if(reportForm)reportForm.addEventListener('submit',event=>{
    event.preventDefault();const reason=document.getElementById('reportReason').value;
    if(!reason)return;const s=readState();s.reports.push({reason,details:document.getElementById('reportDetails').value.trim(),time:Date.now()});
    if(saveState(s)){reportForm.reset();reportForm.hidden=true;showToast('Demo report recorded locally; it was not sent to a moderation team.');}
  });
  renderInteractions();

  // Local-only video preview: no upload request and no file persistence.
  const localForm=document.getElementById('localVideoForm');
  let previewUrl=null;
  const clearPreview=()=>{
    const box=document.getElementById('localVideoPreview'),player=document.getElementById('localPreviewPlayer');
    if(player){player.pause();player.removeAttribute('src');player.load();}
    if(previewUrl){URL.revokeObjectURL(previewUrl);previewUrl=null;}
    if(box)box.hidden=true;
    if(localForm)localForm.reset();
  };
  if(localForm)localForm.addEventListener('submit',event=>{
    event.preventDefault();const file=document.getElementById('localVideoFile').files[0];
    const title=document.getElementById('localVideoTitle').value.trim();
    if(!file||!title)return;
    if(!['video/mp4','video/webm','video/ogg'].includes(file.type)){showToast('Choose an MP4, WebM or Ogg video.');return;}
    if(file.size>100*1024*1024){showToast('Demo preview limit is 100 MB.');return;}
    if(previewUrl)URL.revokeObjectURL(previewUrl);
    previewUrl=URL.createObjectURL(file);
    const player=document.getElementById('localPreviewPlayer');
    player.src=previewUrl;document.getElementById('localPreviewTitle').textContent=title;
    document.getElementById('localVideoPreview').hidden=false;player.load();
    showToast('Local preview ready. Nothing was uploaded.');
  });
  const clearButton=document.getElementById('clearLocalPreview');
  if(clearButton)clearButton.addEventListener('click',clearPreview);
  window.addEventListener('beforeunload',()=>{if(previewUrl)URL.revokeObjectURL(previewUrl);});

  // Provider-aware URL checker. Adult-site players are deliberately not loaded in this non-explicit prototype.
  const embedForm=document.getElementById('embedForm');
  if(embedForm)embedForm.addEventListener('submit',event=>{
    event.preventDefault();
    let url;
    try{url=new URL(document.getElementById('embedUrl').value.trim());}catch{showToast('Enter a valid video URL.');return;}
    if(url.protocol!=='https:'){showToast('Use a secure HTTPS video URL.');return;}
    const host=url.hostname.toLowerCase().replace(/^www\./,'');
    let embedUrl=null,provider='',adultProvider=false;
    if(host==='youtube.com'&&url.pathname==='/watch'&&url.searchParams.get('v')){
      embedUrl='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(url.searchParams.get('v'));provider='YouTube';
    }else if(host==='youtu.be'&&url.pathname.length>1){
      embedUrl='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(url.pathname.slice(1));provider='YouTube';
    }else if(host==='vimeo.com'&&/^\/[0-9]+$/.test(url.pathname)){
      embedUrl='https://player.vimeo.com/video/'+url.pathname.slice(1);provider='Vimeo';
    }else if(['pornhub.com','xvideos.com','redtube.com','xnxx.com'].includes(host)){
      const validPath={
        'pornhub.com':/^\/(view_video\.php|video\/)[^/]+/i,
        'xvideos.com':/^\/video[^/]+/i,
        'redtube.com':/^\/[^/]*video[^/]*\/[0-9]+/i,
        'xnxx.com':/^\/video-[^/]+/i
      };
      if(!validPath[host].test(url.pathname)){showToast('The link host is recognised, but this does not look like a supported video page URL.');return;}
      provider=host==='pornhub.com'?'Pornhub':host==='xvideos.com'?'XVideos':host==='redtube.com'?'RedTube':'XNXX';
      adultProvider=true;
    }else{showToast('Supported providers: YouTube, Vimeo, Pornhub, XVideos, RedTube and XNXX.');return;}
    const preview=document.getElementById('embedPreview');
    const frame=document.getElementById('embedFrame');
    const note=document.getElementById('embedProviderNote');
    const linkCard=document.getElementById('providerLinkCard');
    if(frame){frame.hidden=adultProvider;frame.src=adultProvider?'about:blank':embedUrl;}
    if(linkCard){
      linkCard.hidden=!adultProvider;
      if(adultProvider){
        document.getElementById('providerName').textContent=provider+' link recognised';
        document.getElementById('providerStatusText').textContent='External player disabled in this prototype. The original page can be opened directly; embedding must use the provider’s official embed code and comply with its current rules.';
        const open=document.getElementById('providerOpenLink');open.href=url.href;
      }
    }
    note.textContent=adultProvider?'Provider detected. No adult-site player or media has been loaded.':' '+provider+' demo embed preview. Share only videos you own or are authorised to embed.';
    preview.hidden=false;
  });
});
function showToast(message){let toast=document.querySelector('.toast');if(!toast){toast=document.createElement('div');toast.className='toast';document.body.appendChild(toast);}toast.textContent=message;toast.style.display='block';clearTimeout(window.xToastTimer);window.xToastTimer=setTimeout(()=>toast.style.display='none',2600);}
