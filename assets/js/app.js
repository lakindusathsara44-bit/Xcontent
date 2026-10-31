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

  const searchForm=document.getElementById('videoSearch');
  const searchInput=document.getElementById('searchInput');
  let activeFilter='all';
  function filterVideos(){
    const term=(searchInput?.value||'').trim().toLowerCase();
    const cards=document.querySelectorAll('.video-card');
    const shown=window.XcontentCatalogue.filterCards(cards,term,activeFilter);
    const empty=document.getElementById('emptyResults');
    if(empty)empty.hidden=shown!==0;
  }
  if(searchForm)searchForm.addEventListener('submit',event=>{event.preventDefault();filterVideos();});
  if(searchInput)searchInput.addEventListener('input',filterVideos);
  document.addEventListener('xcontent:catalogue-updated',filterVideos);
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

  // Provider embed preview. Only provider-owned embed endpoints are accepted; arbitrary iframe hosts are rejected.
  const embedForm=document.getElementById('embedForm');
  if(embedForm)embedForm.addEventListener('submit',event=>{
    event.preventDefault();
    const input=document.getElementById('embedUrl').value.trim();
    let candidate=input;
    if(/<iframe\\b/i.test(input)){
      const match=input.match(/<iframe\\b[^>]*?\\bsrc\\s*=\\s*["']([^"']+)["']/i);
      if(!match){showToast('Could not find an iframe src. Paste the provider’s official embed code.');return;}
      candidate=match[1];
    }
    let url;
    try{url=new URL(candidate);}catch{showToast('Enter a valid video URL or official iframe code.');return;}
    if(url.protocol!=='https:'){showToast('Use a secure HTTPS video URL.');return;}
    const host=url.hostname.toLowerCase().replace(/^www\\./,'');
    let embedUrl=null,provider='',externalUrl=url.href;
    if(host==='pornhub.com'){
      provider='Pornhub';
      if(/^\\/embed\\/[A-Za-z0-9_-]+\\/?$/.test(url.pathname))embedUrl=url.href;
      else if((url.pathname==='/view_video.php'||url.pathname==='/video')&&url.searchParams.get('viewkey')){
        embedUrl='https://www.pornhub.com/embed/'+encodeURIComponent(url.searchParams.get('viewkey'));
      }
    }else if(host==='xvideos.com'){
      provider='XVideos';
      if(/^\\/embedframe\\/[A-Za-z0-9_-]+\\/?$/.test(url.pathname))embedUrl=url.href;
    }else if(host==='youtube.com'&&url.pathname==='/watch'&&url.searchParams.get('v')){
      provider='YouTube';embedUrl='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(url.searchParams.get('v'));
    }else if(host==='youtu.be'&&url.pathname.length>1){
      provider='YouTube';embedUrl='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(url.pathname.slice(1));
    }else if(host==='vimeo.com'&&/^\\/[0-9]+$/.test(url.pathname)){
      provider='Vimeo';embedUrl='https://player.vimeo.com/video/'+url.pathname.slice(1);
    }else if(host==='player.vimeo.com'&&/^\\/video\\/[0-9]+$/.test(url.pathname)){
      provider='Vimeo';embedUrl=url.href;
    }else if(host==='www.youtube-nocookie.com'&&/^\\/embed\\/[A-Za-z0-9_-]+$/.test(url.pathname)){
      provider='YouTube';embedUrl=url.href;
    }else{
      showToast('Supported sources: official Pornhub, XVideos, YouTube and Vimeo embed URLs.');return;
    }
    const frame=document.getElementById('embedFrame');
    const demo=document.getElementById('demoPlayer');
    const card=document.getElementById('providerLinkCard');
    const note=document.getElementById('embedProviderNote');
    if(demo){demo.pause();demo.hidden=true;}
    if(embedUrl){
      frame.src=embedUrl;frame.hidden=false;card.hidden=true;
      note.textContent=provider+' embed loaded. If playback is blocked, check the provider’s embed permissions or open the original page.';
    }else{
      frame.removeAttribute('src');frame.hidden=true;card.hidden=false;
      document.getElementById('providerName').textContent=provider+' video link detected';
      document.getElementById('providerStatusText').textContent='This page URL is not itself an embeddable player URL. Paste the official iframe embed code from the provider to preview it here.';
      const open=document.getElementById('providerOpenLink');open.href=externalUrl;
      note.textContent='Official embed code is required for this video.';
    }
    document.querySelector('.watch-main > .watch-layout h1').textContent=provider+' preview';
  });
});
function showToast(message){let toast=document.querySelector('.toast');if(!toast){toast=document.createElement('div');toast.className='toast';document.body.appendChild(toast);}toast.textContent=message;toast.style.display='block';clearTimeout(window.xToastTimer);window.xToastTimer=setTimeout(()=>toast.style.display='none',2600);}
