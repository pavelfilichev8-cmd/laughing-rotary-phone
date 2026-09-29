
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SB_URL='https://lhquumfnuyjwzwcaskoi.supabase.co';
const SB_KEY='sb_publishable_gs7j4qJk0xnsS9VYGMMgHg_IH8TXoHo';
const sb=createClient(SB_URL,SB_KEY);
const $=s=>document.querySelector(s);
const esc2=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const toast2=m=>window.toast?window.toast(m):alert(m);
let me=null, admin=false, presenceChannel=null, msgChannel=null;

async function boot(){
  me=(await sb.auth.getSession()).data.session?.user||null;
  if(me){
    const ar=await sb.from('admin_roles').select('role').eq('user_id',me.id).maybeSingle();
    admin=!!ar.data;
    installAdminNav();
    setPresence('online');
  }
  window.addEventListener('beforeunload',()=>{ if(me) sb.from('user_presence').upsert({user_id:me.id,status:'offline',last_seen_at:new Date().toISOString()}); });
}
function installAdminNav(){
  if(!admin)return;
  const nav=$('#nav'); if(!nav||nav.querySelector('[data-tab="admin"]'))return;
  nav.insertAdjacentHTML('beforeend','<button data-tab="admin" onclick="window.showAdmin()"><i>🛡</i>Админка</button>');
}
async function setPresence(status='online',room=null){
  if(!me)return;
  await sb.from('user_presence').upsert({user_id:me.id,status,last_seen_at:new Date().toISOString(),current_room_id:room});
}
window.showAdmin=async()=>{
  if(!me)return window.authRequired?.();
  const ar=await sb.from('admin_roles').select('role').eq('user_id',me.id).maybeSingle();
  if(!ar.data)return toast2('Нет доступа');
  const [reports,cases,users,videos]=await Promise.all([
    sb.from('reports').select('*,videos(caption),profiles:reported_user_id(username)').order('created_at',{ascending:false}).limit(50),
    sb.from('moderation_cases').select('*,videos(caption),profiles:user_id(username)').order('created_at',{ascending:false}).limit(50),
    sb.from('profiles').select('id,username,display_name,verified,followers_count,videos_count,created_at').order('created_at',{ascending:false}).limit(50),
    sb.from('videos').select('id,user_id,caption,status,views_count,likes_count,comments_count,created_at,profiles(username)').order('created_at',{ascending:false}).limit(50)
  ]);
  $('#root').innerHTML='<section class="page"><div class="row"><div><h1>Админка</h1><p class="muted">Модерация, пользователи, контент и системная аналитика.</p></div><span class="pill">роль: '+esc2(ar.data.role)+'</span></div>'+
  '<div class="metrics"><div class="metric"><b>'+users.data?.length+'</b><span>Пользователи</span></div><div class="metric"><b>'+videos.data?.length+'</b><span>Видео</span></div><div class="metric"><b>'+reports.data?.filter(x=>x.status==="open").length+'</b><span>Открытые жалобы</span></div><div class="metric"><b>'+cases.data?.filter(x=>x.status==="pending").length+'</b><span>AI на проверке</span></div></div>'+
  '<div class="cards"><div class="card"><h2>Жалобы</h2>'+((reports.data||[]).map(x=>'<div class="comment"><b>'+esc2(x.reason)+'</b><div class="muted">'+esc2(x.videos?.caption||'Профиль')+'</div><span class="pill">'+esc2(x.status)+'</span></div>').join('')||'<div class="empty">Нет жалоб</div>')+'</div>'+
  '<div class="card"><h2>AI-модерация</h2>'+((cases.data||[]).map(x=>'<div class="comment"><b>'+esc2(x.kind)+'</b><div>'+esc2(x.videos?.caption||'Контент')+'</div><span class="pill">'+esc2(x.status)+' · '+(x.risk_score??'—')+'</span></div>').join('')||'<div class="empty">Нет кейсов</div>')+'</div>'+
  '<div class="card"><h2>Пользователи</h2>'+((users.data||[]).slice(0,15).map(x=>'<div class="comment"><b>@'+esc2(x.username)+'</b><div>'+esc2(x.display_name)+'</div><span class="pill">'+(x.verified?'verified':'user')+'</span></div>').join('')||'<div class="empty">Нет пользователей</div>')+'</div></div>'+
  '<h2 style="margin-top:30px">Контент</h2><div class="video-grid">'+((videos.data||[]).slice(0,24).map(x=>'<div class="video-tile"><div class="visual"></div><div class="veil"><b>'+esc2(x.caption||'Без названия')+'</b><div class="muted">@'+esc2(x.profiles?.username||'user')+' · '+(x.views_count||0)+' views</div><button class="danger" style="margin-top:8px" onclick="window.adminBlockVideo(\''+x.id+'\')">Заблокировать</button></div></div>').join('')||'<div class="empty">Нет контента</div>')+'</div></section>';
};
window.adminBlockVideo=async id=>{
 if(!admin)return;
 const r=await sb.from('videos').update({status:'blocked',updated_at:new Date().toISOString()}).eq('id',id);
 if(r.error)toast2(r.error.message);else{toast2('Видео заблокировано');window.showAdmin();}
};
window.adminResolveCase=async(id,status)=>{
 const r=await sb.rpc('admin_moderate_case',{p_case_id:id,p_status:status});
 if(r.error)toast2(r.error.message);else window.showAdmin();
};

async function openOrCreateDm(userId){
 if(!me||userId===me.id)return;
 const mine=await sb.from('conversation_members').select('conversation_id').eq('user_id',me.id);
 const theirs=await sb.from('conversation_members').select('conversation_id').eq('user_id',userId);
 const mineSet=new Set((mine.data||[]).map(x=>x.conversation_id));
 const cid=(theirs.data||[]).map(x=>x.conversation_id).find(x=>mineSet.has(x));
 if(cid)return cid;
 const c=await sb.from('conversations').insert({}).select().single(); if(c.error)throw c.error;
 await sb.from('conversation_members').insert([{conversation_id:c.data.id,user_id:me.id},{conversation_id:c.data.id,user_id:userId}]);
 return c.data.id;
}
async function renderMessagesPro(){
 if(!me)return window.authRequired?.();
 const mem=await sb.from('conversation_members').select('conversation_id,user_id,profiles(username,display_name,avatar_url)').eq('user_id',me.id);
 const ids=[...new Set((mem.data||[]).map(x=>x.conversation_id))];
 const convs=[];
 for(const id of ids){
   const members=await sb.from('conversation_members').select('user_id,profiles(username,display_name,avatar_url)').eq('conversation_id',id);
   const msgs=await sb.from('messages').select('*').eq('conversation_id',id).order('created_at',{ascending:false}).limit(1);
   convs.push({id,members:members.data||[],last:msgs.data?.[0]});
 }
 $('#root').innerHTML='<section class="page"><div class="row"><div><h1>Сообщения</h1><p class="muted">Личные и групповые чаты, realtime, прочитано, присутствие и медиа.</p></div><div class="grow"></div><button class="primary" onclick="window.newGroupChat()">＋ Группа</button></div><div class="cards">'+
 convs.map(c=>{const names=c.members.filter(m=>m.user_id!==me.id).map(m=>m.profiles?.display_name||m.profiles?.username).join(', ')||'Группа';return '<div class="card" onclick="window.openProChat(\''+c.id+'\')" style="cursor:pointer"><b>'+esc2(names)+'</b><p class="muted">'+esc2(c.last?.body||'Нет сообщений')+'</p><span class="pill">'+(c.members.length)+' участников</span></div>'}).join('')+
 '</div></section>';
 subscribeMessages();
}
window.openProChat=async cid=>{
 const m=await sb.from('messages').select('id,sender_id,body,created_at,read_at,profiles(username,display_name)').eq('conversation_id',cid).order('created_at',{ascending:true}).limit(200);
 const members=await sb.from('conversation_members').select('user_id,profiles(username,display_name)').eq('conversation_id',cid);
 $('#root').innerHTML='<section class="page"><button class="ghost" onclick="window.renderMessagesPro()">← Сообщения</button><div class="modal" style="margin:18px 0;width:100%;max-height:none"><h2>'+esc2((members.data||[]).filter(x=>x.user_id!==me.id).map(x=>x.profiles?.display_name||x.profiles?.username).join(', ')||'Группа')+'</h2><div id="proChatList" style="min-height:35vh;max-height:55vh;overflow:auto">'+(m.data||[]).map(x=>'<div class="comment"><b>'+esc2(x.profiles?.display_name||x.profiles?.username||'user')+'</b><div>'+esc2(x.body)+'</div><small class="muted">'+(x.read_at?'✓✓':'✓')+'</small></div>').join('')+'</div><div class="row"><input id="proChatText" class="grow" placeholder="Сообщение…"><input id="proChatFile" type="file" accept="image/*,video/*,audio/*" style="max-width:190px"><button class="primary" onclick="window.sendProMessage(\''+cid+'\')">Отправить</button></div></div></section>';
 subscribeMessages(cid);
};
window.sendProMessage=async cid=>{
 const input=$('#proChatText'),body=input.value.trim();if(!body&&!$('#proChatFile')?.files?.[0])return;
 const r=await sb.from('messages').insert({conversation_id:cid,sender_id:me.id,body:body||'📎 Медиа'}).select().single();
 if(r.error)return toast2(r.error.message);
 const f=$('#proChatFile')?.files?.[0];
 if(f){
   const path=me.id+'/messages/'+Date.now()+'-'+f.name.replace(/[^\w.\-]/g,'_');
   const u=await sb.storage.from('videos').upload(path,f,{contentType:f.type});
   if(!u.error){const url=sb.storage.from('videos').getPublicUrl(path).data.publicUrl;await sb.from('message_attachments').insert({message_id:r.data.id,kind:f.type.startsWith('image')?'image':f.type.startsWith('video')?'video':'file',url,mime_type:f.type,size_bytes:f.size});}
 }
 input.value='';if($('#proChatFile'))$('#proChatFile').value='';
};
window.newGroupChat=async()=>{
 const q=prompt('Введите username участников через запятую');if(!q)return;
 const names=q.split(',').map(x=>x.trim()).filter(Boolean);
 const pr=await sb.from('profiles').select('id,username').in('username',names);
 if(!pr.data?.length)return toast2('Участники не найдены');
 const c=await sb.from('conversations').insert({}).select().single();if(c.error)return toast2(c.error.message);
 await sb.from('conversation_members').insert([{conversation_id:c.data.id,user_id:me.id},...(pr.data||[]).filter(x=>x.id!==me.id).map(x=>({conversation_id:c.data.id,user_id:x.id}))]);
 toast2('Группа создана');window.openProChat(c.data.id);
};
function subscribeMessages(cid){
 if(msgChannel)sb.removeChannel(msgChannel).catch(()=>{});
 msgChannel=sb.channel('pro-messages-'+(cid||me.id)).on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},async p=>{
   if(cid&&p.new.conversation_id!==cid)return;
   if(cid){
     const list=$('#proChatList');if(list){const el=document.createElement('div');el.className='comment';el.innerHTML='<b>Новое сообщение</b><div>'+esc2(p.new.body)+'</div>';list.appendChild(el);list.scrollTop=list.scrollHeight;}
     if(p.new.sender_id!==me.id)await sb.rpc('mark_message_read',{p_message_id:p.new.id});
   }
 }).subscribe();
}
async function patchMessagesNav(){
 const old=window.renderMessages;
 window.renderMessagesPro=renderMessagesPro;
 if(window.show){
   const oldShow=window.show;
   window.show=async tab=>{if(tab==='messages')return renderMessagesPro();return oldShow(tab);};
 }
}
async function renderAnalyticsPro(){
 if(!me)return window.authRequired?.();
 const [events,stats]=await Promise.all([
   sb.from('analytics_events').select('event_name,created_at,video_id,properties').eq('user_id',me.id).order('created_at',{ascending:false}).limit(500),
   sb.from('creator_daily_analytics').select('*').eq('creator_id',me.id).order('day',{ascending:false}).limit(30)
 ]);
 const totalViews=(stats.data||[]).reduce((a,x)=>a+(x.views||0),0), watch=(stats.data||[]).reduce((a,x)=>a+(x.watch_seconds||0),0);
 $('#root').innerHTML='<section class="page"><h1>Creator Analytics</h1><p class="muted">Просмотры, watch time, реакции и динамика по дням.</p><div class="metrics"><div class="metric"><b>'+totalViews.toLocaleString()+'</b><span>Просмотры</span></div><div class="metric"><b>'+Math.round(watch/60)+' мин</b><span>Watch time</span></div><div class="metric"><b>'+events.data?.filter(x=>x.event_name==="like").length+'</b><span>Лайки</span></div><div class="metric"><b>'+events.data?.filter(x=>x.event_name==="share").length+'</b><span>Шеры</span></div></div><div class="card"><h2>Последние события</h2>'+((events.data||[]).slice(0,40).map(x=>'<div class="comment"><b>'+esc2(x.event_name)+'</b><span class="muted"> · '+new Date(x.created_at).toLocaleString()+'</span></div>').join('')||'<div class="empty">Событий пока нет</div>')+'</div></section>';
}
window.showAnalytics=renderAnalyticsPro;
async function logEvent(name,props={},videoId=null,roomId=null){if(!me)return;await sb.rpc('log_analytics',{p_event_name:name,p_video_id:videoId,p_live_room_id:roomId,p_session_id:sessionStorage.getItem('cliptok_sid')||crypto.randomUUID(),p_properties:props}).catch(()=>{});}
if(!sessionStorage.getItem('cliptok_sid'))sessionStorage.setItem('cliptok_sid',crypto.randomUUID());
window.logClipEvent=logEvent;

async function liveSpeechTranslate(target='en'){
 if(!me)return window.authRequired?.();
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR)return toast2('Браузер не поддерживает live-распознавание речи');
 const rec=new SR();rec.continuous=true;rec.interimResults=true;rec.lang=document.documentElement.lang||'ru-RU';
 let box=document.querySelector('#liveCaptions');
 if(!box){document.body.insertAdjacentHTML('beforeend','<div class="overlay" id="captionOverlay"><div class="modal"><button class="close" onclick="window.stopLiveSpeech()">×</button><h2>LIVE AI Subtitles</h2><div id="liveCaptions" class="translate-text">Говорите…</div><div class="row"><select id="capLang" class="translate-select"><option value="en">English</option><option value="zh">中文</option><option value="es">Español</option><option value="de">Deutsch</option><option value="fr">Français</option><option value="tr">Türkçe</option><option value="fi">Suomi</option></select><button class="primary" onclick="window.liveSpeechTranslate(document.querySelector('#capLang').value)">Переводить</button></div></div></div>');box=$('#liveCaptions')}
 rec.onresult=async e=>{
   const text=[...e.results].map(x=>x[0].transcript).join(' ');
   box.textContent=text;
   if(e.results[e.results.length-1].isFinal){
     const tr=await sb.functions.invoke('translate-text',{body:{text,target_language:target}});
     if(!tr.error&&tr.data?.text)box.textContent=tr.data.text;
   }
 };
 rec.onerror=e=>toast2('Распознавание: '+e.error);rec.onend=()=>{if(window.__speechRunning){try{rec.start()}catch{}}};
 window.__speechRunning=true;window.__speechRec=rec;try{rec.start()}catch(e){toast2(e.message)}
}
window.liveSpeechTranslate=liveSpeechTranslate;
window.stopLiveSpeech=()=>{window.__speechRunning=false;try{window.__speechRec?.stop()}catch{};$('#captionOverlay')?.remove()};

async function requestAiModeration(videoId,videoUrl){
 const job=await sb.from('ai_jobs').insert({job_type:'moderate_video',video_id:videoId,input_url:videoUrl,status:'queued'}).select().single();
 if(job.error)return;
 const r=await sb.functions.invoke('ai-moderate',{body:{video_id:videoId,video_url:videoUrl,job_id:job.data.id}});
 if(r.error)toast2('AI-модерация поставлена в очередь'); else toast2('AI-модерация: '+(r.data?.status||'готово'));
}
window.requestAiModeration=requestAiModeration;

async function connectSfu(roomId,role='viewer'){
 if(!me)return window.authRequired?.();
 const token=await sb.functions.invoke('livekit-token',{body:{room_id:roomId,role}});
 if(token.error||!token.data?.participant_token){toast2('SFU пока не настроен — используется WebRTC fallback');return false}
 if(!window.LivekitClient){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/livekit-client@2/dist/livekit-client.umd.min.js';s.onload=resolve;s.onerror=reject;document.head.appendChild(s)}).catch(()=>{})}
 if(!window.LivekitClient)return false;
 const Room=window.LivekitClient.Room,Track=window.LivekitClient.Track;
 const room=new Room({adaptiveStream:true,dynacast:true});
 await room.connect(token.data.server_url,token.data.participant_token);
 window.__cliptokSfu=room;
 room.on('trackSubscribed',(track)=>{const el=track.attach();const host=$('.live-player');if(host&&el)host.appendChild(el);});
 return true;
}
window.connectSfu=connectSfu;
window.__cliptokProd={sb,boot,renderAnalyticsPro,renderMessagesPro,connectSfu};
boot().then(patchMessagesNav);


function installAnalyticsNav(){
 const nav=$('#nav'); if(!nav||nav.querySelector('[data-tab="analytics"]'))return;
 nav.insertAdjacentHTML('beforeend','<button data-tab="analytics" onclick="window.showAnalytics()"><i>▥</i>Аналитика</button>');
}
const oldUpload=window.uploadVideo;
if(oldUpload){
 window.uploadVideo=async()=>{
   await oldUpload();
   if(!me)return;
   const latest=await sb.from('videos').select('id,video_url').eq('user_id',me.id).order('created_at',{ascending:false}).limit(1).maybeSingle();
   if(latest.data) requestAiModeration(latest.data.id,latest.data.video_url);
 };
}
const rootObserver=new MutationObserver(()=>{
 installAdminNav();installAnalyticsNav();
 const lp=$('.live-player');
 if(lp&&!lp.querySelector('.prod-live-tools')){
   const d=document.createElement('div');d.className='prod-live-tools live-controls';
   d.innerHTML='<span class="live-stat">AI LIVE</span><button class="ghost" onclick="window.liveSpeechTranslate(\'en\')">CC + перевод</button><button class="ghost" onclick="window.connectSfu(\''+(window.liveRoom?.id||'')+'\',\'viewer\')">⚡ SFU</button>';
   lp.parentElement?.appendChild(d);
 }
});
rootObserver.observe($('#root')||document.body,{childList:true,subtree:true});
installAnalyticsNav();
