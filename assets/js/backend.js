document.addEventListener('DOMContentLoaded',()=>{
 const db=window.XcontentSupabase;if(!db)return;
 const toast=m=>{let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.append(t);}t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2800);};
 // Public catalogue: RLS only returns published rows to visitors.
 const grid=document.getElementById('videoGrid');
 if(grid) (async()=>{
  const {data,error}=await db.from('videos').select('id,title,description,provider,thumbnail_url').eq('status','published').order('published_at',{ascending:false});
  if(error){console.warn(error.message);return;}
  data.forEach(v=>{
   const a=document.createElement('a');a.className='video-card remote-video-card';a.href='watch.html?id='+encodeURIComponent(v.id);
   const thumb=document.createElement('div');thumb.className='thumb-wrap';
   if(v.thumbnail_url){const img=document.createElement('img');img.src=v.thumbnail_url;img.alt='';img.loading='lazy';thumb.append(img);}else{thumb.classList.add('video-placeholder');thumb.textContent='X';}
   const play=document.createElement('span');play.className='play-overlay';play.textContent='▶';thumb.append(play);
   const info=document.createElement('div');info.className='video-card-info';const h=document.createElement('h2');h.textContent=v.title;
   const p=document.createElement('p');p.textContent=v.provider.toUpperCase()+' · Xcontent';info.append(h,p);a.append(thumb,info);grid.append(a);
  });
 })();
 // Apply search and category filters to asynchronously loaded database cards too.
 const filterRemoteCards=()=>{
  const term=(document.getElementById('searchInput')?.value||'').trim().toLowerCase();
  document.querySelectorAll('.remote-video-card').forEach(card=>{
   const text=(card.textContent||'').toLowerCase();
   card.hidden=!text.includes(term);
  });
 };
 const remoteSearch=document.getElementById('searchInput');
 if(remoteSearch)remoteSearch.addEventListener('input',filterRemoteCards);
 // Resolve a published video detail by UUID.
 const videoId=new URLSearchParams(location.search).get('id');
 const remote=document.getElementById('remoteVideoPlayer');
 if(videoId&&remote)(async()=>{
  const {data,error}=await db.from('videos').select('title,description,provider,embed_url').eq('id',videoId).eq('status','published').maybeSingle();
  if(error||!data){toast('This video is unavailable.');return;}
  const demo=document.getElementById('demoPlayer');if(demo)demo.hidden=true;
  const frame=document.createElement('iframe');frame.src=data.embed_url;frame.title=data.title;frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';
  frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;remote.replaceChildren(frame);remote.hidden=false;
  const h=document.querySelector('.watch-layout h1');if(h)h.textContent=data.title;
  const d=document.querySelector('.watch-description');if(d)d.textContent=data.description||'';
  const m=document.querySelector('.watch-meta');if(m)m.textContent=data.provider.toUpperCase()+' · Xcontent';
 })();
 // Owner console: authenticated AND allowlisted status required; RLS independently enforces every write.
 const panel=document.getElementById('creatorAdminPanel');
 if(panel)(async()=>{
  const gate=document.getElementById('creatorAccessMessage');
  const {data:{session}}=await db.auth.getSession();
  if(!session){gate.hidden=false;gate.textContent='Please log in with the authorised owner account.';return;}
  const {data:isAdmin,error:roleError}=await db.rpc('is_site_admin');
  if(roleError||!isAdmin){gate.hidden=false;gate.textContent='This account is not authorised to manage Xcontent videos.';return;}
  gate.hidden=true;panel.hidden=false;const who=document.getElementById('creatorSignedInAs');if(who)who.textContent=session.user.email||'Owner account';
  const list=document.getElementById('adminVideoList');
  async function refresh(){
   list.replaceChildren();const {data,error}=await db.from('videos').select('id,title,provider,status').order('created_at',{ascending:false});
   if(error){list.textContent='Could not load: '+error.message;return;}if(!data.length){list.textContent='No video links yet.';return;}
   data.forEach(v=>{
    const item=document.createElement('article');item.className='admin-video-row';const info=document.createElement('div');
    const title=document.createElement('b');title.textContent=v.title;const meta=document.createElement('small');meta.textContent=v.provider.toUpperCase()+' · '+v.status;info.append(title,meta);
    const actions=document.createElement('div');actions.className='admin-video-actions';
    const toggle=document.createElement('button');toggle.type='button';toggle.className='button button-small button-ghost';toggle.textContent=v.status==='published'?'Unpublish':'Publish';
    toggle.addEventListener('click',async()=>{const {error}=await db.from('videos').update({status:v.status==='published'?'draft':'published'}).eq('id',v.id);if(error)toast(error.message);else{toast('Status updated.');refresh();}});
    const del=document.createElement('button');del.type='button';del.className='button button-small button-ghost';del.textContent='Delete';
    del.addEventListener('click',async()=>{if(!confirm('Delete this video link?'))return;const {error}=await db.from('videos').delete().eq('id',v.id);if(error)toast(error.message);else{toast('Video link deleted.');refresh();}});
    actions.append(toggle,del);item.append(info,actions);list.append(item);
   });
  }
  const form=document.getElementById('videoPublishForm');
  form.addEventListener('submit',async e=>{
   e.preventDefault();const title=document.getElementById('videoTitle').value.trim(),description=document.getElementById('videoDescription').value.trim();
   const raw=document.getElementById('videoSourceUrl').value.trim(),thumbnail=document.getElementById('videoThumbnail').value.trim(),status=document.getElementById('videoStatus').value;
   let u;try{u=new URL(raw);}catch{toast('Enter a valid video URL.');return;}if(u.protocol!=='https:'){toast('Only HTTPS links are accepted.');return;}
   const host=u.hostname.toLowerCase().replace(/^www\./,'');let id='',provider='',source='';
   if((host==='youtube.com'||host==='m.youtube.com')&&u.pathname==='/watch'){id=u.searchParams.get('v')||'';provider='youtube';source='https://www.youtube.com/watch?v='+encodeURIComponent(id);}
   else if(host==='youtu.be'){id=u.pathname.slice(1);provider='youtube';source='https://www.youtube.com/watch?v='+encodeURIComponent(id);}
   else if(host==='youtube.com'&&/^\/embed\/[A-Za-z0-9_-]+$/.test(u.pathname)){id=u.pathname.split('/')[2];provider='youtube';source='https://www.youtube.com/watch?v='+encodeURIComponent(id);}
   else if(host==='vimeo.com'&&/^\/[0-9]+$/.test(u.pathname)){id=u.pathname.slice(1);provider='vimeo';source='https://vimeo.com/'+id;}
   else if(host==='player.vimeo.com'&&/^\/video\/[0-9]+$/.test(u.pathname)){id=u.pathname.split('/')[2];provider='vimeo';source='https://vimeo.com/'+id;}
   else if(host==='pornhub.com'&&u.pathname==='/view_video.php'){id=u.searchParams.get('viewkey')||'';provider='pornhub';source='https://www.pornhub.com/view_video.php?viewkey='+encodeURIComponent(id);}
   else if(host==='pornhub.com'&&/^\/embed\/[A-Za-z0-9]+$/.test(u.pathname)){id=u.pathname.split('/')[2];provider='pornhub';source='https://www.pornhub.com/view_video.php?viewkey='+encodeURIComponent(id);}
   else if(host==='xvideos.com'&&/^\/video[0-9]+(?:\/[^/]+)?\/?$/.test(u.pathname)){id=(u.pathname.match(/^\/video([0-9]+)/)||[])[1]||'';provider='xvideos';source='https://www.xvideos.com/video'+id;}
   else if(host==='xvideos.com'&&/^\/embedframe\/[0-9]+$/.test(u.pathname)){id=u.pathname.split('/')[2];provider='xvideos';source='https://www.xvideos.com/embedframe/'+id;}
   if(!id||!provider){toast('Use an official YouTube, Vimeo, Pornhub or XVideos video/embed URL.');return;}
   if(provider==='youtube'&&!/^[A-Za-z0-9_-]{6,20}$/.test(id)){toast('Invalid YouTube video ID.');return;}
   if(provider==='vimeo'&&!/^[0-9]+$/.test(id)){toast('Invalid Vimeo video ID.');return;}
   if(provider==='pornhub'&&!/^[A-Za-z0-9]{5,40}$/.test(id)){toast('Invalid Pornhub video key.');return;}
   if(provider==='xvideos'&&!/^[0-9]{4,20}$/.test(id)){toast('Invalid XVideos video ID.');return;}
   const embed=provider==='youtube'?'https://www.youtube-nocookie.com/embed/'+id:provider==='vimeo'?'https://player.vimeo.com/video/'+id:provider==='pornhub'?'https://www.pornhub.com/embed/'+id:'https://www.xvideos.com/embedframe/'+id;
   const thumb=thumbnail&&/^https:\/\//i.test(thumbnail)?thumbnail:(provider==='youtube'?'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg':null);
   const {error}=await db.from('videos').insert({title,description,provider,source_url:source,embed_url:embed,thumbnail_url:thumb,status,created_by:session.user.id});
   if(error){toast(error.message);return;}form.reset();toast(status==='published'?'Published to public video feed.':'Draft saved.');refresh();
  });
  const signout=document.getElementById('creatorSignOut');if(signout)signout.addEventListener('click',async()=>{await db.auth.signOut();location.href='../auth/login.html';});
  refresh();
 })();
});