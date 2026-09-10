(()=>{'use strict';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const STORE='roll_titles_v5', COST=250, INCOME=300, MIN=60000, START=1000;
const RS=['Common','Uncommon','Rare','Epic','Legendary','Mythic','Secret'];
const RC={Common:'#aeb7c4',Uncommon:'#62d894',Rare:'#58a9ff',Epic:'#aa72ff',Legendary:'#ffb34e',Mythic:'#ff5c9e',Secret:'#effdff'};
const SH={title:[45,25,14,8,4.5,2.5,1],color:[48,25,13,7,4,2,1],font:[40,25,15,9,6,3.5,1.5]};
const DUP=[50,80,125,225,400,750,1500];
const COMBO_BONUS=[0,25,50,100,175,275,450];
const H=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const M=(type,name,rarity,x={})=>({id:type[0]+'_'+H(type+name).toString(36),type,name,rarity,weight:.75+(H(name)%50)/100,...x});

const fixed={
  Legendary:['THE CHOSEN ONE','LAST SURVIVOR','KING OF NOTHING','FINAL WARNING','BORN LUCKY','NO SECOND PLACE','THE UNTOUCHABLE','END OF LINE','LIVING LEGEND','LAST ONE STANDING','CROWNLESS KING','THE ORIGINAL','PERFECT STORM','ONE ABOVE ALL','FINAL ANSWER','NO TURNING BACK','ETERNAL WINNER','THE MAIN EVENT','LAST WORD','NO CONTEST'],
  Mythic:['REALITY BREAKER','BEYOND LIMITS','THE UNFORGOTTEN','NOT FROM HERE','WORLD ENDER','TIMELESS','VOIDBORN','THE IMPOSSIBLE','ABSOLUTE ZERO','FATE DENIED','ETERNAL ECHO','THE ANOMALY','UNKNOWN ENTITY','OUTSIDE REALITY'],
  Secret:['NULL','404 : NOT FOUND','BEYOND','UNDEFINED','[ REDACTED ]','GODMODE','???','THE LAST TITLE','DO NOT ROLL','∞']
};
const A=['Rookie','Player','Wanderer','Scout','Runner','Chill','Regular','Night Owl','Quick Hands','Low Key','Solo Queue','Casual','Warmup','Side Quest','Locked In','Fresh Start','Main Menu','No Pressure','Easy Mode','First Try','Silent Type','Checkpoint','Lucky One','Second Wind','Steady','No Drama','Just Vibing','On Standby','Hot Streak','Lone Wolf','No Signal','Fast Learner','Cold Hands','Night Shift','Second Chance','One Tap','Full Focus','No Context','Plot Armor','Quiet Storm','Wild Card','Lucky Break','High Ground','After Hours','Main Character','Quick Reset','Zero Panic','Ghosted','Hidden Gem','Apex Hunter','Neon Ghost','Final Round','Zero Hour','Blue Flame','Dead Center','No Witness','Overclocked','Midnight Run','Unseen','Top Frag','Afterimage','Redline','Hard Reset','Untouchable','Ghost Signal','Prime Time','Dark Horse','Critical Hit','Endgame','Static Rush','Void Walker','Neon Phantom','Reality Check','Final Boss','Unchained','Blackout','Phase Shift','Limit Break','Perfect Chaos','No Mercy','Cold Eclipse','Zero Gravity','Last Light','Broken Halo','Ghost Protocol','Overdrive','Neon Saint','Glass Cannon','Phantom Mode'];
const tails=['',' II',' X',' PRIME',' //',' ZERO',' MODE',' CORE',' ARC',' V2'];
const titles=[];
A.forEach((n,i)=>{const r=i<28?'Common':i<50?'Uncommon':i<68?'Rare':'Epic';titles.push(M('title',n,r));});
for(let i=0;i<110;i++){
  const base=A[i%A.length];
  const name=base+tails[1+(i%9)]+' '+(i%7?['','NOVA','ALPHA','OMEGA','ECHO','VOID','NEON'][i%7]:'').trim();
  const r=i<46?'Common':i<76?'Uncommon':i<96?'Rare':'Epic';
  if(!titles.some(x=>x.name===name))titles.push(M('title',name,r));
}
for(const r of ['Legendary','Mythic','Secret'])fixed[r].forEach(n=>titles.push(M('title',n,r)));

const solid='White:#f4f7fb:Common,Silver:#b8c0cc:Common,Slate:#7f8a9d:Common,Charcoal:#555d6b:Common,Red:#ff5d67:Common,Blue:#5d9dff:Common,Green:#61d98c:Common,Orange:#ff9b54:Common,Yellow:#ffe16b:Common,Brown:#b58968:Common,Navy:#6680b5:Common,Teal:#4db6a7:Common,Purple:#a375ff:Uncommon,Pink:#ff6fab:Uncommon,Cyan:#66edff:Uncommon,Lime:#c6f45c:Uncommon,Amber:#ffc858:Uncommon,Ice Blue:#b9efff:Uncommon,Rose:#ff94a8:Uncommon,Mint:#86f4c3:Uncommon,Lavender:#c6a8ff:Uncommon,Coral:#ff8e7e:Uncommon,Aqua:#63ffe2:Uncommon,Crimson:#e9435f:Uncommon,Electric Blue:#4d71ff:Rare,Hot Pink:#ff4cb8:Rare,Neon Red:#ff4b5d:Rare,Neon Green:#62ff8b:Rare,Plasma Violet:#b46cff:Rare,Laser Cyan:#54f5ff:Rare,Acid Yellow:#eaff45:Rare,Deep Teal:#22d8c0:Rare';
const colors=solid.split(',').map(z=>{const[n,c,r]=z.split(':');return M('color',n,r,{solid:c,classes:r==='Rare'?'fx-pulse':''})});
[
  ['Toxic','Rare','fx-toxic'],['Frozen','Rare','fx-ice'],
  ['Sunset','Epic','fx-vapor'],['Deep Ocean','Epic','fx-cyber'],['Chrome','Epic','fx-chrome'],['Cotton Candy','Epic','fx-cotton'],['Forest Mist','Epic','fx-forest'],['Cosmic Dust','Epic','fx-cosmic'],['Vaporwave','Epic','fx-vapor'],['Blood Moon','Epic','fx-bloodmoon'],
  ['24K Gold','Legendary','fx-gold'],['Magma','Legendary','fx-magma'],['Aurora','Legendary','fx-aurora'],['Emerald Flame','Legendary','fx-emerald'],['Solar Flare','Legendary','fx-solar'],['Royal Amethyst','Legendary','fx-amethyst'],['Cyberpunk','Legendary','fx-cyber'],
  ['Void','Mythic','fx-void'],['Blacklight','Mythic','fx-blacklight'],['Hologram','Mythic','fx-aurora'],['Nebula','Mythic','fx-nebula'],['Singularity','Mythic','fx-singularity'],['Angelic','Mythic','fx-angelic'],['Inferno Core','Mythic','fx-inferno'],
  ['Prismatic','Secret','fx-rainbowbg fx-fast'],['Starlight','Secret','fx-starlight'],['Spectrum Shift','Secret','fx-rainbowbg'],['RGB Overdrive','Secret','fx-rgbover'],['Galaxy','Secret','fx-galaxy'],['Divine','Secret','fx-divine'],['Glitch Matrix','Secret','fx-glitchmatrix']
].forEach(([n,r,fx])=>colors.push(M('color',n,r,{classes:'text-gradient '+fx+' fx-shift'})));

const fd=`Space Grotesk|Space Grotesk|Common
Rajdhani|Rajdhani|Common
Exo 2|Exo 2|Common
Chakra Petch|Chakra Petch|Common
Teko|Teko|Common
Kanit|Kanit|Common
Jura|Jura|Common
Quantico|Quantico|Common
Tomorrow|Tomorrow|Common
Arial|Arial|Common
Bebas Neue|Bebas Neue|Uncommon
Oxanium|Oxanium|Uncommon
Syne|Syne|Uncommon
Anton|Anton|Uncommon
Russo One|Russo One|Uncommon
Fredoka|Fredoka|Uncommon
Graduate|Graduate|Uncommon
Iceberg|Iceberg|Uncommon
Share Tech Mono|Share Tech Mono|Uncommon
Poiret One|Poiret One|Uncommon
Righteous|Righteous|Rare
Cinzel|Cinzel|Rare
Orbitron|Orbitron|Rare
Audiowide|Audiowide|Rare
Bangers|Bangers|Rare
Archivo Black|Archivo Black|Rare
Syncopate|Syncopate|Rare
Special Elite|Special Elite|Rare
Georgia|Georgia|Rare
Black Ops One|Black Ops One|Epic
Bungee|Bungee|Epic
Unbounded|Unbounded|Epic
Permanent Marker|Permanent Marker|Epic
Alfa Slab One|Alfa Slab One|Epic
Rubik Mono One|Rubik Mono One|Epic
Wallpoet|Wallpoet|Epic
Metal Mania|Metal Mania|Epic
Notable|Notable|Epic
Michroma|Michroma|Legendary
Press Start 2P|Press Start 2P|Legendary
Krona One|Krona One|Legendary
Limelight|Limelight|Legendary
Major Mono Display|Major Mono Display|Legendary
Bowlby One SC|Bowlby One SC|Legendary
Notable Heavy|Notable|Legendary
Monoton|Monoton|Mythic
Orbitron Black|Orbitron|Mythic
Cinzel Black|Cinzel|Mythic
Creepster|Creepster|Mythic
Tilt Neon|Tilt Neon|Mythic
Mono Black|Major Mono Display|Mythic
Void Type|Unbounded|Secret
Arcade Core|Press Start 2P|Secret
Broken Signal|Share Tech Mono|Secret
Hyperwave|Audiowide|Secret
Ritual|Metal Mania|Secret`;
const fonts=fd.trim().split('\n').map(l=>{
  const[n,f,r]=l.split('|');
  let style='';
  if(/Black|Void Type|Broken Signal|Hyperwave|Ritual/.test(n))style='font-weight:900;letter-spacing:.1em';
  return M('font',n,r,{family:f,style});
});

const pools={title:titles,color:colors,font:fonts};
const get=(t,id)=>pools[t]?.find(x=>x.id===id);
const exact=x=>{const a=pools[x.type].filter(y=>y.rarity===x.rarity),sum=a.reduce((v,y)=>v+y.weight,0);return SH[x.type][RS.indexOf(x.rarity)]/100*x.weight/sum};
const pct=x=>{const p=exact(x)*100;return p>=1?p.toFixed(2)+'%':p>=.1?p.toFixed(3)+'%':p.toFixed(4)+'%'};
const one=x=>Math.max(1,Math.round(1/exact(x)));
function pick(t){
  let n=Math.random()*100,a=0,r=RS[0];
  for(let i=0;i<RS.length;i++){a+=SH[t][i];if(n<=a){r=RS[i];break}}
  const p=pools[t].filter(x=>x.rarity===r),sum=p.reduce((v,x)=>v+x.weight,0);
  let q=Math.random()*sum;
  for(const x of p){q-=x.weight;if(q<=0)return x}
  return p[p.length-1];
}

const fresh=()=>({inventory:{title:{},color:{},font:{}},equipped:{},rolls:0,history:[],coins:START,lastIncomeAt:Date.now()});
let s;
try{s=JSON.parse(localStorage.getItem(STORE))||fresh()}catch{s=fresh()}
s.inventory ||= {title:{},color:{},font:{}};
for(const t of ['title','color','font'])s.inventory[t] ||= {};
s.equipped ||= {}; s.history ||= []; s.rolls=+s.rolls||0;
s.coins=Number.isFinite(+s.coins)?+s.coins:START;
s.lastIncomeAt=+s.lastIncomeAt||Date.now();

const defs={
  title:titles.find(x=>x.name==='Player')||titles[0],
  color:colors.find(x=>x.name==='White')||colors[0],
  font:fonts.find(x=>x.name==='Space Grotesk')||fonts[0]
};
for(const t of ['title','color','font']){
  if(!get(t,s.equipped[t])){
    s.equipped[t]=defs[t].id;
    s.inventory[t][defs[t].id]=Math.max(1,s.inventory[t][defs[t].id]||0);
  }
}
const save=()=>localStorage.setItem(STORE,JSON.stringify(s));
let type='title', rolling=false, auto=false, filter='all';
let rollState=null;

function clear(e){
  if(!e)return;
  [...e.classList].filter(c=>c==='text-gradient'||c.startsWith('fx-')).forEach(c=>e.classList.remove(c));
  ['color','backgroundImage','fontFamily','fontWeight','letterSpacing','fontStyle','textTransform','filter'].forEach(p=>e.style[p]='');
}
function font(e,x){
  if(!e||!x)return;
  e.style.fontFamily=`"${x.family}",sans-serif`;
  if(x.style)for(const z of x.style.split(';').filter(Boolean)){
    const i=z.indexOf(':'); if(i>0)e.style.setProperty(z.slice(0,i),z.slice(i+1));
  }
}
function paint(e,x,text=x.name){
  clear(e); e.textContent=text;
  if(x.type==='color'){
    (x.classes||'').split(/\s+/).filter(Boolean).forEach(c=>e.classList.add(c));
    if(x.solid)e.style.color=x.solid;
  }else if(x.type==='font')font(e,x);
}
function paintRoll(e,x,text=x.name){
  paint(e,x,text);
  if(x.type!=='color')e.style.color=RC[x.rarity]||'#fff';
}
function toast(m){
  const e=$('#toast'); if(!e)return;
  e.textContent=m; e.classList.add('show');
  clearTimeout(toast.t); toast.t=setTimeout(()=>e.classList.remove('show'),1700);
}

let audioCtx=null;
function audio(){
  try{
    if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended')audioCtx.resume();
    return audioCtx;
  }catch{return null}
}
function tone(freq=440,dur=.06,vol=.025,type='sine',delay=0,slide=0){
  const a=audio(); if(!a)return;
  const o=a.createOscillator(),g=a.createGain(),now=a.currentTime+delay;
  o.type=type; o.frequency.setValueAtTime(freq,now);
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,freq+slide),now+dur);
  g.gain.setValueAtTime(.0001,now);
  g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),now+.008);
  g.gain.exponentialRampToValueAtTime(.0001,now+dur);
  o.connect(g); g.connect(a.destination); o.start(now); o.stop(now+dur+.02);
}
function noiseBurst(dur=.09,vol=.012){
  const a=audio(); if(!a)return;
  const len=Math.max(1,Math.floor(a.sampleRate*dur)),buf=a.createBuffer(1,len,a.sampleRate),data=buf.getChannelData(0);
  for(let i=0;i<len;i++)data[i]=(Math.random()*2-1)*(1-i/len);
  const src=a.createBufferSource(),g=a.createGain(),f=a.createBiquadFilter();
  f.type='highpass';f.frequency.value=900;g.gain.value=vol;src.buffer=buf;src.connect(f);f.connect(g);g.connect(a.destination);src.start();
}
function sfxStart(){tone(150,.12,.028,'sawtooth',0,120);noiseBurst(.12,.009)}
function sfxTick(progress=.5){const f=410+progress*140;tone(f,.028,.017,'square',0,35)}
function sfxReveal(x){
  const tier=RS.indexOf(x.rarity),root=320+tier*42;
  tone(root,.18,.035,'sine',0,120);tone(root*1.25,.24,.028,'sine',.075,80);tone(root*1.5,.32,.024,'triangle',.15,100);
  if(tier>=4)tone(root*2,.44,.017,'sine',.22,180);
  if(tier>=6){tone(root*2.5,.62,.014,'sine',.32,220);noiseBurst(.16,.012)}
}
function sfxDuplicate(){tone(220,.07,.022,'square');tone(330,.09,.018,'triangle',.06,45)}

function stats(){
  const n=t=>Object.keys(s.inventory[t]).filter(id=>get(t,id)).length;
  const a=n('title'),b=n('color'),c=n('font'),u=a+b+c;
  [['#rollCount',s.rolls.toLocaleString()],['#uniqueCount',u],['#invCount',u],['#invAllCount',u],['#invTitleCount',a],['#invColorCount',b],['#invFontCount',c],['#colTitles',`${a} / ${titles.length}`],['#colColors',`${b} / ${colors.length}`],['#colFonts',`${c} / ${fonts.length}`]].forEach(([q,v])=>{if($(q))$(q).textContent=v});
  if($('#barTitles'))$('#barTitles').style.width=a/titles.length*100+'%';
  if($('#barColors'))$('#barColors').style.width=b/colors.length*100+'%';
  if($('#barFonts'))$('#barFonts').style.width=c/fonts.length*100+'%';
}
function comboIncome(){
  let total=INCOME;
  for(const t of ['title','color','font']){
    const x=get(t,s.equipped[t])||defs[t];
    total+=COMBO_BONUS[Math.max(0,RS.indexOf(x.rarity))]||0;
  }
  return total;
}
function buttons(){
  const no=rolling||auto||s.coins<COST;
  if($('#rollBtn'))$('#rollBtn').disabled=no;
  if($('#autoBtn'))$('#autoBtn').disabled=no;
}
function wallet(){
  const rate=comboIncome();
  if($('#coinBalance'))$('#coinBalance').textContent=Math.floor(s.coins).toLocaleString();
  const timer=Math.max(0,Math.ceil((s.lastIncomeAt+MIN-Date.now())/1000));
  const oldTimer=$('#incomeTimer');
  if(oldTimer){
    const line=oldTimer.parentElement;
    if(line)line.innerHTML=`+${rate.toLocaleString()} /MIN · IN <strong id="incomeTimer">${timer}s</strong>`;
  }
  const w=$('.wallet');if(w)w.title=`Your equipped combo currently earns ${rate.toLocaleString()} coins per minute`;
  buttons();
}
function income(show=false){
  const now=Date.now(),m=Math.floor(Math.max(0,now-s.lastIncomeAt)/MIN);
  if(m){
    const rate=comboIncome(),gain=m*rate;
    s.coins+=gain; s.lastIncomeAt+=m*MIN; save();
    if(show)toast(`+${gain.toLocaleString()} coins · combo income`);
  }
  wallet();
}
function equipped(){
  const t=get('title',s.equipped.title)||defs.title,c=get('color',s.equipped.color)||defs.color,f=get('font',s.equipped.font)||defs.font,e=$('#equippedTitle');
  paint(e,c,t.name); font(e,f);
  $('#eqTitleName').textContent=t.name;$('#eqColorName').textContent=c.name.toUpperCase();$('#eqFontName').textContent=f.name.toUpperCase();font($('#eqFontName'),f);wallet();
}

function view(v){
  const e=$('#'+v+'View'); if(!e)return;
  $$('.view').forEach(x=>x.classList.remove('active')); e.classList.add('active');
  $$('.tab').forEach(x=>x.classList.toggle('active',x.dataset.view===v));
  if(v==='inventory')inventory();if(v==='collection')catalog();
}
function select(t){
  if(!pools[t]||rolling)return;
  type=t; $$('.case-card').forEach(x=>x.classList.toggle('selected',x.dataset.case===t));
  $('#machineEyebrow').textContent=t.toUpperCase()+' CASE';$('#machineTitle').textContent='ROLL A '+t.toUpperCase();idle();odds();
}

function row(x,c=false){
  const d=document.createElement('div');d.className='reel-item'+(c?' centerish':'');
  d.innerHTML=`<span class="rarity" style="color:${RC[x.rarity]}">${x.rarity.toUpperCase()}</span><span class="name"></span><span class="chance">${pct(x)}</span>`;
  paintRoll(d.querySelector('.name'),x);return d;
}
function focusRow(tr,index){[...tr.children].forEach((e,i)=>e.classList.toggle('roll-focus',i===index))}
function idle(){
  const tr=$('#reelTrack'); if(!tr)return;tr.innerHTML='';for(let i=0;i<7;i++)tr.appendChild(row(pick(type),i===3));
  tr.style.transition='none'; tr.style.transform='translateY(-266px)';
  $('#resultRarity').textContent='READY'; $('#resultRarity').style.color='#6e788d';clear($('#resultName')); $('#resultName').textContent='Press roll to start';$('#resultOdds').textContent='—';$('#skipRoll')?.classList.remove('show');
}
function add(x){
  const n=s.inventory[x.type][x.id]||0,dup=n>0,refund=dup?DUP[RS.indexOf(x.rarity)]:0;
  s.inventory[x.type][x.id]=n+1;s.rolls++;s.coins+=refund;s.history.unshift({type:x.type,id:x.id,dup,refund});s.history=s.history.slice(0,24);
  save();stats();wallet();history();return{dup,refund};
}
function animateReel(tr,n,duration){
  return new Promise(resolve=>{
    const target=-((n-1)*76)-38, started=performance.now();let last=-1;
    function frame(now){
      if(!rollState){resolve();return}
      let t=Math.min(1,(now-started)/duration);if(rollState.skip)t=1;
      const eased=1-Math.pow(1-t,2.7),y=target*eased;tr.style.transform=`translateY(${y}px)`;
      const idx=Math.max(0,Math.min(n-1,Math.round((-y-38)/76)));
      if(idx!==last){last=idx;focusRow(tr,idx);if(t>.035)sfxTick(idx/Math.max(1,n-1))}
      if(t<1)rollState.raf=requestAnimationFrame(frame);else resolve();
    }
    rollState.raf=requestAnimationFrame(frame);
  });
}
function revealVfx(x){
  const shell=$('#reelShell'); if(!shell)return;const layer=shell.querySelector('.roll-vfx-layer');if(!layer)return;layer.innerHTML='';
  const color=RC[x.rarity]||'#fff';
  const flash=document.createElement('div');flash.className='reveal-flash';flash.style.setProperty('--rarity',color);layer.appendChild(flash);
  const ring=document.createElement('div');ring.className='reveal-ring';ring.style.setProperty('--rarity',color);layer.appendChild(ring);
  const tier=RS.indexOf(x.rarity),count=16+tier*3;
  for(let i=0;i<count;i++){
    const p=document.createElement('i'),a=(Math.PI*2/count)*i+(Math.random()-.5)*.18,dist=80+Math.random()*(65+tier*9);
    p.className='reveal-particle';p.style.setProperty('--x',`${Math.cos(a)*dist}px`);p.style.setProperty('--y',`${Math.sin(a)*dist*.52}px`);p.style.setProperty('--rarity',i%4===0?'#ffffff':color);p.style.animationDelay=(Math.random()*.08)+'s';layer.appendChild(p);
  }
  const strip=$('#resultStrip');strip?.classList.remove('result-pop');void strip?.offsetWidth;strip?.classList.add('result-pop');document.body.classList.add('reveal-kick');
  setTimeout(()=>{layer.innerHTML='';strip?.classList.remove('result-pop');document.body.classList.remove('reveal-kick')},1100+tier*70);
}
async function roll(q=false){
  if(rolling)return null;income();if(s.coins<COST){toast('Not enough coins');return null}
  s.coins-=COST;rolling=true;save();wallet();buttons();audio();sfxStart();
  const x=pick(type),tr=$('#reelTrack'),n=q?18:42;tr.innerHTML='';for(let i=0;i<n-1;i++)tr.appendChild(row(pick(type)));tr.appendChild(row(x));
  tr.style.transition='none';tr.style.transform='translateY(0)';$('#resultRarity').textContent='ROLLING';$('#resultRarity').style.color='#ffffff';clear($('#resultName'));$('#resultName').textContent='Scanning drops…';$('#resultOdds').textContent='—';
  rollState={skip:false,raf:0};const skip=$('#skipRoll');if(skip){skip.textContent='SKIP ANIMATION';skip.classList.add('show')}
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));await animateReel(tr,n,q?2200:5200);
  if(rollState?.raf)cancelAnimationFrame(rollState.raf);rollState=null;if(skip){skip.classList.remove('show');skip.textContent='SKIP ANIMATION'}
  focusRow(tr,n-1);tr.lastElementChild?.classList.add('winner-glow');
  const d=add(x);$('#resultRarity').textContent=x.rarity.toUpperCase();$('#resultRarity').style.color=RC[x.rarity];paintRoll($('#resultName'),x);$('#resultOdds').textContent=d.dup?`DUPLICATE +${d.refund} ◈`:`${pct(x)} · 1/${one(x).toLocaleString()}`;
  revealVfx(x);sfxReveal(x);if(d.dup)setTimeout(sfxDuplicate,180);setTimeout(()=>tr.lastElementChild?.classList.remove('winner-glow'),1450);rolling=false;buttons();return x;
}
function skipAnimation(){
  if(!rolling||!rollState)return;rollState.skip=true;const b=$('#skipRoll');if(b){b.textContent='SKIPPING…';b.disabled=true;setTimeout(()=>{b.disabled=false;b.textContent='SKIP ANIMATION'},250)}
}

function history(){
  const g=$('#historyList');if(!g)return;g.innerHTML='';if(!s.history.length){g.innerHTML='<div class="empty-mini">No rolls yet.</div>';return}
  s.history.slice(0,6).forEach(h=>{const x=get(h.type,h.id);if(!x)return;const d=document.createElement('div');d.className='history-item';d.innerHTML=`<small style="color:${RC[x.rarity]}">${x.rarity.toUpperCase()} · ${x.type.toUpperCase()}</small><b></b><em>${pct(x)}</em>${h.dup?`<span class="dup-refund">DUP +${h.refund} ◈</span>`:''}`;paintRoll(d.querySelector('b'),x);g.appendChild(d)});
}
function card(x,inv=false,qty=0){
  const c=document.createElement('div'),owned=!!s.inventory[x.type][x.id];c.className=(inv?'inv-card':'col-card')+(inv?'':owned?' owned':' locked');
  c.innerHTML=`<div class="item-top"><span class="item-type">${x.type.toUpperCase()}</span><span class="item-rarity" style="color:${RC[x.rarity]}">${x.rarity.toUpperCase()}</span></div><div class="item-preview"></div><div class="item-name"></div><div class="item-sub">${pct(x)} · ~1 in ${one(x).toLocaleString()}</div>${inv?`<div class="item-actions"><button class="equip-btn">${s.equipped[x.type]===x.id?'EQUIPPED':'EQUIP'}</button><span class="qty">×${qty}</span></div>`:'<span class="owned-dot"></span>'}`;
  paint(c.querySelector('.item-preview'),x);c.querySelector('.item-name').textContent=x.name;if(x.type==='font')font(c.querySelector('.item-name'),x);
  if(inv)c.querySelector('button').onclick=()=>{s.equipped[x.type]=x.id;save();equipped();inventory();toast(`${x.name} equipped · ${comboIncome().toLocaleString()}/min`)};return c;
}
function inventory(){
  const g=$('#inventoryGrid');if(!g)return;const q=($('#invSearch')?.value||'').toLowerCase();let a=[];
  for(const t of ['title','color','font'])for(const[id,qty]of Object.entries(s.inventory[t])){const x=get(t,id);if(x)a.push({...x,qty})}
  a=a.filter(x=>(filter==='all'||x.type===filter)&&(!q||x.name.toLowerCase().includes(q)));g.innerHTML='';a.sort((x,y)=>RS.indexOf(y.rarity)-RS.indexOf(x.rarity)||x.name.localeCompare(y.name)).forEach(x=>g.appendChild(card(x,true,x.qty)));if(!a.length)g.innerHTML='<div class="empty-mini">Nothing here yet.</div>';
}
function catalog(){
  const g=$('#collectionGrid');if(!g)return;const t=$('#collectionType')?.value||'all',r=$('#collectionRarity')?.value||'all',q=($('#collectionSearch')?.value||'').toLowerCase();
  let a=t==='all'?[...titles,...colors,...fonts]:[...pools[t]];a=a.filter(x=>(r==='all'||x.rarity===r)&&(!q||x.name.toLowerCase().includes(q)));g.innerHTML='';a.sort((x,y)=>RS.indexOf(x.rarity)-RS.indexOf(y.rarity)||x.name.localeCompare(y.name)).forEach(x=>g.appendChild(card(x)));
}
function odds(){
  const g=$('#oddsRarities');if(!g)return;g.innerHTML='';$('#oddsTitle').textContent=type.toUpperCase()+' CASE ODDS';RS.forEach((r,i)=>{const d=document.createElement('div');d.className='odds-row';d.innerHTML=`<span style="color:${RC[r]}">${r.toUpperCase()}</span><b>${SH[type][i]}%</b>`;g.appendChild(d)});
  const d=$('#duplicateRewards');if(d){d.innerHTML='';RS.forEach((r,i)=>d.insertAdjacentHTML('beforeend',`<div class="duplicate-row"><span style="color:${RC[r]}">${r.toUpperCase()}</span><b>+${DUP[i]} ◈</b></div>`))}
}

function adminItems(){
  const t=$('#adminGrantType')?.value||'coins';$('#adminAmountWrap')?.classList.toggle('hidden',t!=='coins');$('#adminItemWrap')?.classList.toggle('hidden',!pools[t]);const e=$('#adminItem');
  if(e&&pools[t]){e.innerHTML='';[...pools[t]].sort((a,b)=>RS.indexOf(b.rarity)-RS.indexOf(a.rarity)||a.name.localeCompare(b.name)).forEach(x=>e.insertAdjacentHTML('beforeend',`<option value="${x.id}">${x.rarity.toUpperCase()} — ${x.name}</option>`))}
}
async function grant(){
  const st=$('#adminStatus');try{st.textContent='Checking…';const res=await fetch('/api/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:$('#adminCode').value})});const j=await res.json().catch(()=>({}));if(!res.ok||!j.ok)throw Error(j.error||'Invalid code');const t=$('#adminGrantType').value;
    if(t==='coins'){const n=Math.floor(+$('#adminAmount').value);if(!(n>0&&n<=1e9))throw Error('Invalid amount');s.coins+=n}else if(t==='all'){for(const k of ['title','color','font'])for(const x of pools[k])s.inventory[k][x.id]=Math.max(1,s.inventory[k][x.id]||0)}else{const x=get(t,$('#adminItem').value);if(!x)throw Error('Item not found');s.inventory[t][x.id]=Math.max(1,s.inventory[t][x.id]||0)}
    save();stats();wallet();inventory();catalog();st.className='admin-status good';st.textContent='Grant applied';toast('Admin grant applied');
  }catch(e){st.className='admin-status bad';st.textContent=e.message}
}

function particles(){
  const cv=$('#particles'),ctx=cv?.getContext('2d');if(!cv||!ctx)return;let W=0,H=0,D=1,pts=[];
  function resize(){D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;ctx.setTransform(D,0,0,D,0,0);pts=Array.from({length:Math.min(80,Math.floor(W*H/17000))},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+.25,v:Math.random()*.12+.025,a:Math.random()*.35+.07}))}
  function frame(){ctx.clearRect(0,0,W,H);for(const p of pts){p.y-=p.v;if(p.y<-4){p.y=H+4;p.x=Math.random()*W}ctx.globalAlpha=p.a;ctx.fillStyle='#bfefff';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(frame)}
  addEventListener('resize',resize);resize();frame();
}

function ensureRollFx(){
  if(!document.querySelector('link[href="rollfx.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='rollfx.css';document.head.appendChild(l)}
  const shell=$('#reelShell');if(shell&&!shell.querySelector('.roll-vfx-layer')){const layer=document.createElement('div');layer.className='roll-vfx-layer';shell.appendChild(layer)}
  if(shell&&!$('#skipRoll')){const b=document.createElement('button');b.id='skipRoll';b.className='skip-roll';b.type='button';b.textContent='SKIP ANIMATION';b.onclick=skipAnimation;shell.appendChild(b)}
}
function boot(){
  ensureRollFx();
  $$('.tab').forEach(b=>b.onclick=()=>view(b.dataset.view));$$('.case-card').forEach(b=>b.onclick=()=>select(b.dataset.case));$$('.load-chip').forEach(b=>b.onclick=()=>{filter=b.dataset.go;view('inventory');$$('#invTabs button').forEach(x=>x.classList.toggle('active',x.dataset.filter===filter));inventory()});$$('#invTabs button').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;$$('#invTabs button').forEach(x=>x.classList.toggle('active',x===b));inventory()});
  $('#invSearch').oninput=inventory;$('#collectionType').onchange=catalog;$('#collectionRarity').onchange=catalog;$('#collectionSearch').oninput=catalog;
  $('#rollBtn').onclick=()=>roll();$('#autoBtn').onclick=async()=>{if(auto||rolling)return;auto=true;buttons();let n=0;for(let i=0;i<10;i++){const x=await roll(true);if(!x)break;n++;await new Promise(r=>setTimeout(r,100))}auto=false;buttons();toast(`Auto finished: ${n}`)};
  $('#clearHistory').onclick=()=>{s.history=[];save();history()};$('#oddsBtn').onclick=()=>{odds();$('#oddsDialog').showModal()};$('#closeOdds').onclick=()=>$('#oddsDialog').close();
  $('#adminOpen').onclick=()=>{adminItems();$('#adminStatus').textContent='';$('#adminDialog').showModal()};$('#adminClose').onclick=()=>$('#adminDialog').close();$('#adminGrantType').onchange=adminItems;$('#adminGrant').onclick=grant;
  const l=$('#rarityLegend');if(l){l.innerHTML='';RS.forEach(r=>l.insertAdjacentHTML('beforeend',`<span class="rarity-pill"><b style="color:${RC[r]}">●</b>${r}</span>`))}const rr=$('#collectionRarity');if(rr.options.length===1)RS.forEach(r=>rr.insertAdjacentHTML('beforeend',`<option value="${r}">${r}</option>`));
  $('#titlePoolCount').textContent=titles.length;$('#colorPoolCount').textContent=colors.length;$('#fontPoolCount').textContent=fonts.length;const ct=$('#collectionType');ct.querySelector('[value="title"]').textContent=`Titles (${titles.length})`;ct.querySelector('[value="color"]').textContent=`Colors (${colors.length})`;ct.querySelector('[value="font"]').textContent=`Fonts (${fonts.length})`;
  income();setInterval(()=>income(true),1000);idle();equipped();stats();wallet();history();odds();adminItems();particles();save();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();

})();