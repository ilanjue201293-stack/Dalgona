(()=>{
'use strict';
const $=id=>document.getElementById(id);
const cookieCanvas=$('cookieCanvas'),traceCanvas=$('traceCanvas'),crackCanvas=$('crackCanvas');
const bg=cookieCanvas.getContext('2d',{alpha:true}),tg=traceCanvas.getContext('2d',{alpha:true}),cg=crackCanvas.getContext('2d',{alpha:true});
const needle=$('needle'),camera=$('camera');
let W=0,H=0,DPR=1,CX=0,CY=0,R=0,state='menu',cookie='Triangle';
let paths=[],samples=[],sampleDone=null,grid=new Map(),gridSize=24,total=0,done=0;
let timeLeft=120,timerId=null,lastClock=0,cracks=0,maxCracks=5,fear=0,maxFear=0,fearId=null,nearbyId=null;
let pointer={x:0,y:0,down:false,inside:false,id:null},outsideLatch=false,lastCarve={x:0,y:0};
let qte=null,qteFrame=0,breathing=false,qteCooldown=0,audio=null,lastScrape=0;
const ordinary=['Triangle','Circle','Star','Umbrella','Pig','Adjute','Blahaj','Fusion','Peabert','Rogue Lineage','Troll Face','Silly & Locked-In','67','I GOT A SQUID','Squid','Mona Lisa'];
const rare=['Sackboy','Mona Lisa Figure'];
const norm=(x,y)=>[x,y];

function seg(...p){return p}
function line(a,b,n=18){const out=[];for(let i=0;i<=n;i++){const t=i/n;out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}return out}
function arc(cx,cy,r,a0,a1,n=48){const out=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;out.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}return out}
function ellipse(cx,cy,rx,ry,a0=0,a1=Math.PI*2,n=64){const out=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;out.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry])}return out}
function poly(points,closed=true,steps=12){const out=[];for(let i=0;i<points.length-(closed?0:1);i++){const a=points[i],b=points[(i+1)%points.length],z=line(a,b,Math.max(2,steps));if(out.length)z.shift();out.push(...z)}return out}
function starPath(cx,cy,ro=.82,ri=.38){const pts=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?ri:ro;pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}return poly(pts,true,10)}
function sierpinski(cx,cy,size,depth,out=[]){const top=[cx,cy-size],bl=[cx-size*.866,cy+size*.5],br=[cx+size*.866,cy+size*.5];out.push(poly([top,bl,br],true,7));if(depth>0){const s=size*.5;sierpinski(cx,cy-size*.5,s,depth-1,out);sierpinski(cx-size*.433,cy+size*.25,s,depth-1,out);sierpinski(cx+size*.433,cy+size*.25,s,depth-1,out)}return out}

function shapeData(name){
  switch(name){
    case 'Triangle': return [poly([[-.02,-.75],[-.70,.56],[.70,.56]],true,24)];
    case 'Circle': return [ellipse(0,0,.69,.69,0,Math.PI*2,90)];
    case 'Star': return [starPath(0,0,.78,.34)];
    case 'Umbrella': return [
      arc(0,-.08,.72,Math.PI,Math.PI*2,72),
      poly([[-.72,-.08],[-.48,-.08],[-.33,-.19],[-.17,-.08],[0,-.19],[.17,-.08],[.33,-.19],[.48,-.08],[.72,-.08]],false,8),
      poly([[0,-.09],[0,.50],[.05,.66],[.18,.72],[.31,.67],[.37,.56]],false,8)
    ];
    case 'Sackboy': return [
      ellipse(0,-.42,.25,.27,0,Math.PI*2,54),
      poly([[-.22,-.18],[-.35,-.04],[-.50,.20],[-.39,.31],[-.23,.12],[-.18,.31],[-.16,.68],[-.02,.68],[0,.33],[.02,.68],[.16,.68],[.18,.31],[.23,.12],[.39,.31],[.50,.20],[.35,-.04],[.22,-.18]],false,9),
      arc(-.085,-.45,.018,0,Math.PI*2,10),arc(.085,-.45,.018,0,Math.PI*2,10),
      arc(0,-.36,.09,.10*Math.PI,.90*Math.PI,18)
    ];
    case 'Mona Lisa': return sierpinski(0,.04,.78,3,[]);
    case 'Pig': return [
      ellipse(0,.02,.57,.53,0,Math.PI*2,70),
      poly([[-.43,-.34],[-.52,-.67],[-.22,-.49]],true,10),poly([[.43,-.34],[.52,-.67],[.22,-.49]],true,10),
      ellipse(0,.17,.24,.18,0,Math.PI*2,30),arc(-.08,.18,.025,0,Math.PI*2,10),arc(.08,.18,.025,0,Math.PI*2,10),
      arc(-.19,-.08,.036,0,Math.PI*2,12),arc(.19,-.08,.036,0,Math.PI*2,12)
    ];
    case 'Adjute': return [
      ellipse(0,-.33,.31,.29,0,Math.PI*2,54),
      poly([[-.27,-.13],[-.45,.08],[-.35,.26],[-.22,.17],[-.19,.67],[-.04,.67],[0,.34],[.04,.67],[.19,.67],[.22,.17],[.35,.26],[.45,.08],[.27,-.13]],false,8),
      poly([[-.28,-.50],[-.12,-.68],[.05,-.55],[.25,-.65],[.31,-.43]],false,7),
      arc(-.10,-.34,.025,0,Math.PI*2,10),arc(.10,-.34,.025,0,Math.PI*2,10)
    ];
    case 'Blahaj': return [
      poly([[-.80,.08],[-.58,-.12],[-.31,-.25],[-.05,-.33],[.24,-.26],[.55,-.43],[.48,-.13],[.78,-.02],[.52,.10],[.33,.31],[.06,.39],[-.25,.34],[-.50,.23]],true,8),
      poly([[-.08,-.30],[-.01,-.55],[.16,-.30]],true,8),poly([[-.12,.35],[-.04,.58],[.13,.39]],true,8),
      arc(.28,-.15,.025,0,Math.PI*2,10)
    ];
    case 'Fusion': return [
      arc(-.38,-.31,.22,0,Math.PI*2,32),
      poly([[.20,-.54],[-.02,-.12],[.43,-.12]],true,12),
      starPath(-.35,.35,.25,.11),
      arc(.30,.25,.28,Math.PI,Math.PI*2,28),poly([[.02,.25],[.58,.25]],false,14),poly([[.30,.25],[.30,.58],[.40,.63],[.49,.57]],false,10)
    ];
    case 'Peabert': return [
      ellipse(0,-.07,.47,.55,0,Math.PI*2,66),
      poly([[-.30,-.47],[-.18,-.67],[-.04,-.51],[.10,-.67],[.29,-.45]],false,9),
      arc(-.15,-.16,.03,0,Math.PI*2,10),arc(.15,-.16,.03,0,Math.PI*2,10),
      arc(0,.03,.18,.08*Math.PI,.92*Math.PI,22),
      poly([[-.31,.31],[-.43,.56],[-.26,.64],[-.12,.43]],false,8),poly([[.31,.31],[.43,.56],[.26,.64],[.12,.43]],false,8)
    ];
    case 'Rogue Lineage': return [
      poly([[0,-.73],[-.35,-.48],[-.45,-.12],[-.29,.29],[0,.64],[.29,.29],[.45,-.12],[.35,-.48]],true,10),
      poly([[-.26,-.22],[0,-.38],[.26,-.22],[.17,.02],[0,.12],[-.17,.02]],true,8),
      poly([[0,.12],[0,.46]],false,12),poly([[-.13,.30],[0,.46],[.13,.30]],false,8)
    ];
    case 'Troll Face': return [
      poly([[-.64,-.23],[-.50,-.48],[-.18,-.62],[.17,-.58],[.53,-.42],[.66,-.11],[.55,.20],[.32,.44],[-.04,.57],[-.37,.48],[-.60,.24]],true,8),
      arc(-.23,-.19,.12,.08*Math.PI,.92*Math.PI,18),arc(.22,-.18,.11,.08*Math.PI,.92*Math.PI,18),
      poly([[-.45,.08],[-.30,.26],[-.06,.34],[.20,.30],[.43,.12],[.31,.40],[.03,.53],[-.29,.44],[-.52,.22]],false,7),
      poly([[-.34,.20],[-.20,.31],[-.04,.36],[.13,.34],[.31,.21]],false,7)
    ];
    case 'Silly & Locked-In': return [
      poly([[-.68,-.58],[-.10,-.58],[-.10,.59],[-.68,.59]],true,12),
      poly([[.10,-.58],[.68,-.58],[.68,.59],[.10,.59]],true,12),
      ellipse(-.39,-.12,.21,.24,0,Math.PI*2,32),arc(-.46,-.13,.023,0,Math.PI*2,8),arc(-.31,-.13,.023,0,Math.PI*2,8),arc(-.39,.00,.11,.08*Math.PI,.92*Math.PI,14),
      ellipse(.39,-.12,.21,.24,0,Math.PI*2,32),poly([[.24,-.18],[.34,-.24],[.42,-.17]],false,6),poly([[.36,-.17],[.47,-.24],[.55,-.16]],false,6),poly([[.27,.04],[.40,-.01],[.53,.04]],false,6)
    ];
    case '67': return [
      poly([[-.08,-.52],[-.27,-.58],[-.45,-.46],[-.52,-.13],[-.50,.24],[-.31,.50],[-.05,.48],[.10,.30],[.06,.08],[-.11,-.02],[-.34,.02],[-.50,.18]],false,7),
      poly([[.13,-.55],[.53,-.55],[.32,-.15],[.13,.52]],false,14)
    ];
    case 'I GOT A SQUID': return [
      ellipse(0,-.16,.35,.28,Math.PI,Math.PI*2,28),
      poly([[-.35,-.16],[-.27,.06],[-.17,.02],[-.10,.39],[0,.12],[.10,.39],[.17,.02],[.27,.06],[.35,-.16]],false,8),
      arc(-.11,-.16,.022,0,Math.PI*2,8),arc(.11,-.16,.022,0,Math.PI*2,8)
    ];
    case 'Squid': return [
      poly([[0,-.67],[-.36,-.27],[-.30,.02],[-.20,.13],[-.23,.45],[-.10,.31],[-.05,.63],[.05,.63],[.10,.31],[.23,.45],[.20,.13],[.30,.02],[.36,-.27]],true,8),
      arc(-.11,-.17,.025,0,Math.PI*2,8),arc(.11,-.17,.025,0,Math.PI*2,8)
    ];
    case 'Mona Lisa Figure': return [
      poly([[-.48,-.67],[.48,-.67],[.48,.66],[-.48,.66]],true,16),
      ellipse(0,-.31,.18,.22,0,Math.PI*2,30),
      poly([[-.18,-.10],[-.31,.05],[-.35,.44],[-.18,.55],[0,.39],[.18,.55],[.35,.44],[.31,.05],[.18,-.10]],true,8),
      poly([[-.14,-.36],[-.05,-.41],[.06,-.39],[.14,-.34]],false,6),
      arc(-.07,-.31,.018,0,Math.PI*2,8),arc(.07,-.31,.018,0,Math.PI*2,8),
      arc(0,-.23,.08,.08*Math.PI,.92*Math.PI,14)
    ];
    default:return [starPath(0,0,.72,.34)];
  }
}

function resize(){
  const rect=cookieCanvas.getBoundingClientRect(); W=Math.max(1,rect.width||innerWidth); H=Math.max(1,rect.height||innerHeight); DPR=Math.min(devicePixelRatio||1,2);
  for(const cv of [cookieCanvas,traceCanvas,crackCanvas]){cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);cv.style.width=W+'px';cv.style.height=H+'px'}
  for(const ctx of [bg,tg,cg])ctx.setTransform(DPR,0,0,DPR,0,0);
  CX=W*.5;CY=H*.505;R=Math.min(W*.33,H*.42,345);
  if(state==='play'){buildShape(cookie);drawStatic();redrawTrace();redrawCracks()}
}
addEventListener('resize',()=>{clearTimeout(resize.t);resize.t=setTimeout(resize,80)});

function toWorld(p){return [CX+p[0]*R,CY+p[1]*R]}
function buildShape(name){
  paths=shapeData(name).map(s=>s.map(toWorld));samples=[];grid.clear();
  for(let pi=0;pi<paths.length;pi++){
    const p=paths[pi];
    for(let i=0;i<p.length-1;i++){
      const a=p[i],b=p[i+1],dist=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(dist/5));
      for(let k=0;k<n;k++){
        const t=k/n,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t,idx=samples.length;
        samples.push({x,y,pi});
        const gx=Math.floor(x/gridSize),gy=Math.floor(y/gridSize),key=gx+','+gy;
        let arr=grid.get(key);if(!arr)grid.set(key,arr=[]);arr.push(idx);
      }
    }
  }
  total=samples.length;sampleDone=new Uint8Array(total);done=0;updateProgress();
}

function drawStatic(){
  bg.clearRect(0,0,W,H);
  bg.save();
  bg.beginPath();bg.ellipse(CX+6,CY+13,R*1.08,R*1.04,0,0,Math.PI*2);bg.fillStyle='rgba(52,31,15,.26)';bg.fill();
  let tin=bg.createRadialGradient(CX-R*.27,CY-R*.29,R*.12,CX,CY,R*1.08);tin.addColorStop(0,'#d7dcda');tin.addColorStop(.55,'#8f9693');tin.addColorStop(.76,'#4d5552');tin.addColorStop(1,'#b4b9b5');
  bg.beginPath();bg.arc(CX,CY,R*1.045,0,Math.PI*2);bg.fillStyle=tin;bg.fill();
  let grad=bg.createRadialGradient(CX-R*.28,CY-R*.31,R*.12,CX,CY,R*.95);grad.addColorStop(0,'#d6af5e');grad.addColorStop(.46,'#bb8130');grad.addColorStop(.76,'#9b6122');grad.addColorStop(1,'#6d3d17');
  bg.beginPath();bg.arc(CX,CY,R*.94,0,Math.PI*2);bg.fillStyle=grad;bg.fill();
  bg.save();bg.beginPath();bg.arc(CX,CY,R*.935,0,Math.PI*2);bg.clip();
  for(let i=0;i<95;i++){
    const a=i*2.399963,rr=((i*47)%100)/100*R*.86,x=CX+Math.cos(a)*rr,y=CY+Math.sin(a)*rr,r=1.2+((i*13)%9)/3;
    bg.globalAlpha=.06+((i*17)%11)/100;bg.fillStyle=i%3?'#4c2b11':'#f5ce80';bg.beginPath();bg.arc(x,y,r,0,Math.PI*2);bg.fill();
  }
  bg.globalAlpha=.14;for(let i=0;i<14;i++){const y=CY-R*.75+i*R*.11;bg.beginPath();bg.moveTo(CX-R*.8,y);bg.bezierCurveTo(CX-R*.3,y-8,CX+R*.3,y+8,CX+R*.8,y);bg.strokeStyle='#704317';bg.lineWidth=1;bg.stroke()}
  bg.restore();bg.globalAlpha=1;
  bg.lineCap='round';bg.lineJoin='round';
  for(const p of paths){bg.beginPath();p.forEach((v,i)=>i?bg.lineTo(v[0],v[1]):bg.moveTo(v[0],v[1]));bg.strokeStyle='#4c2b13';bg.lineWidth=Math.max(5.5,R*.021);bg.shadowColor='rgba(38,17,5,.35)';bg.shadowBlur=3;bg.shadowOffsetY=2;bg.stroke()}
  bg.restore();
}

function nearestSample(x,y){
  const gx=Math.floor(x/gridSize),gy=Math.floor(y/gridSize);let best=-1,bd=1e9;
  for(let ox=-1;ox<=1;ox++)for(let oy=-1;oy<=1;oy++){
    const arr=grid.get((gx+ox)+','+(gy+oy));if(!arr)continue;
    for(const idx of arr){const s=samples[idx],d=(s.x-x)*(s.x-x)+(s.y-y)*(s.y-y);if(d<bd){bd=d;best=idx}}
  }
  return {idx:best,d:Math.sqrt(bd)};
}

function markAround(idx,radius=4){
  if(idx<0)return;let added=0;const start=Math.max(0,idx-radius),end=Math.min(total-1,idx+radius);
  for(let i=start;i<=end;i++){
    if(!sampleDone[i] && Math.abs(samples[i].pi-samples[idx].pi)<.1){sampleDone[i]=1;done++;added++;drawTraceDot(samples[i].x,samples[i].y)}
  }
  if(added)updateProgress();
}
function drawTraceDot(x,y){tg.save();tg.fillStyle='#17ff2c';tg.shadowColor='#00ff34';tg.shadowBlur=6;tg.beginPath();tg.arc(x,y,Math.max(2.9,R*.0105),0,Math.PI*2);tg.fill();tg.restore()}
function redrawTrace(){tg.clearRect(0,0,W,H);if(!sampleDone)return;for(let i=0;i<samples.length;i++)if(sampleDone[i])drawTraceDot(samples[i].x,samples[i].y)}
function updateProgress(){const p=total?Math.min(100,Math.round(done/total*100)):0;$('progressFill').style.width=p+'%';$('progressPct').textContent=p+'%';if(p>=99&&state==='play')win()}

function canvasPos(e){
  const r=traceCanvas.getBoundingClientRect();
  return {x:(e.clientX-r.left)*(W/r.width),y:(e.clientY-r.top)*(H/r.height)};
}
function moveNeedle(p){pointer.x=p.x;pointer.y=p.y;needle.style.transform=`translate3d(${p.x-12}px,${p.y-105}px,0)`;needle.style.opacity=state==='play'?'1':'0'}
function setPointer(e){const p=canvasPos(e);moveNeedle(p);return p}

function carveAt(x,y){
  if(state!=='play')return;
  const n=nearestSample(x,y),tol=Math.max(5.8,12.8-fear*.055);
  if(n.idx>=0&&n.d<=tol){outsideLatch=false;markAround(n.idx,Math.max(3,Math.round(4-fear/55)));scrape();}
  else if(pointer.down&&!outsideLatch){outsideLatch=true;chip(x,y)}
}
function carveLine(a,b){const dist=Math.hypot(b.x-a.x,b.y-a.y),n=Math.max(1,Math.ceil(dist/6));for(let i=1;i<=n;i++){const t=i/n;carveAt(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t)}}

traceCanvas.addEventListener('pointerdown',e=>{if(state!=='play')return;e.preventDefault();const p=setPointer(e);pointer.down=true;pointer.inside=true;pointer.id=e.pointerId;outsideLatch=false;lastCarve=p;traceCanvas.setPointerCapture?.(e.pointerId);carveAt(p.x,p.y)});
traceCanvas.addEventListener('pointermove',e=>{const p=setPointer(e);pointer.inside=true;if(pointer.down&&state==='play'){carveLine(lastCarve,p);lastCarve=p}});
traceCanvas.addEventListener('pointerup',e=>{pointer.down=false;outsideLatch=false;try{traceCanvas.releasePointerCapture?.(e.pointerId)}catch{}});
traceCanvas.addEventListener('pointercancel',()=>{pointer.down=false;outsideLatch=false});
traceCanvas.addEventListener('pointerleave',()=>{pointer.inside=false;if(!pointer.down)needle.style.opacity='0'});
traceCanvas.addEventListener('pointerenter',e=>{pointer.inside=true;setPointer(e)});

const crackSeeds=[[-.69,-.40],[-.75,.19],[.61,-.47],[.72,.15],[-.16,.78],[.26,.79]];
let crackHistory=[];
function makeCrack(seedIndex,level,origin){
  const seed=origin?[(origin.x-CX)/R,(origin.y-CY)/R]:crackSeeds[seedIndex%crackSeeds.length];
  const sx=CX+seed[0]*R,sy=CY+seed[1]*R,ang=Math.atan2(CY-sy,CX-sx)+(Math.random()-.5)*.35;
  const main=[];let x=sx,y=sy,a=ang;const steps=4+level*2;
  for(let i=0;i<steps;i++){const len=R*(.045+.017*level)*(0.8+Math.random()*.35);a+=(Math.random()-.5)*.55;x+=Math.cos(a)*len;y+=Math.sin(a)*len;main.push([x,y])}
  const branches=[];for(let i=1;i<main.length-1;i+=2){let [bx,by]=main[i],ba=a+(Math.random()<.5?-1:1)*(1.05+Math.random()*.55),arr=[];for(let j=0;j<1+Math.floor(level/2);j++){const len=R*(.035+.01*level);ba+=(Math.random()-.5)*.5;bx+=Math.cos(ba)*len;by+=Math.sin(ba)*len;arr.push([bx,by])}branches.push({start:main[i],pts:arr})}
  return {start:[sx,sy],main,branches,level};
}
function renderCrack(cr,progress=1){
  cg.save();cg.lineCap='round';cg.lineJoin='round';cg.strokeStyle='rgba(53,27,10,.95)';cg.shadowColor='rgba(255,216,150,.18)';cg.shadowBlur=1;cg.lineWidth=Math.max(1.6,R*.006);
  const all=[cr.start,...cr.main],count=Math.max(2,Math.ceil(all.length*progress));cg.beginPath();cg.moveTo(all[0][0],all[0][1]);for(let i=1;i<count;i++)cg.lineTo(all[i][0],all[i][1]);cg.stroke();
  if(progress>.45){for(const b of cr.branches){cg.beginPath();cg.moveTo(b.start[0],b.start[1]);const c=Math.max(1,Math.ceil(b.pts.length*((progress-.45)/.55)));for(let i=0;i<c;i++)cg.lineTo(b.pts[i][0],b.pts[i][1]);cg.stroke()}}
  cg.restore();
}
function redrawCracks(){cg.clearRect(0,0,W,H);for(const cr of crackHistory)renderCrack(cr,1)}
function animateCrack(cr){const t0=performance.now(),dur=190;const step=now=>{redrawCracks();renderCrack(cr,Math.min(1,(now-t0)/dur));if(now-t0<dur)requestAnimationFrame(step);else{crackHistory.push(cr);redrawCracks()}};requestAnimationFrame(step)}

function chip(x,y){
  if(state!=='play')return;cracks++;fear=Math.min(100,fear+16+Math.random()*5);maxFear=Math.max(maxFear,fear);updateFear();updateCrackPips();
  const cr=makeCrack(cracks-1,cracks,{x,y});animateCrack(cr);hitShake(false);crackSound(false);toast('COOKIE CRACKED');
  if(cracks>=maxCracks)setTimeout(()=>lose('THE COOKIE BROKE'),120);
}
function updateCrackPips(){$('crackPips').innerHTML=Array.from({length:maxCracks},(_,i)=>`<i class="pip ${i<cracks?'on':''}"></i>`).join('')}
function updateFear(){fear=Math.max(0,Math.min(100,fear));maxFear=Math.max(maxFear,fear);$('fearFill').style.width=fear+'%';$('fearPct').textContent=Math.round(fear)+'%';$('fearHud').classList.toggle('fearDanger',fear>=70);$('screenTint').style.opacity=String(Math.max(0,(fear-55)/90));needle.style.filter=`drop-shadow(3px 5px 3px rgba(0,0,0,.45)) ${fear>55?`blur(${(fear-55)/120}px)`:''}`;if(fear>=100&&state==='play')lose('FEAR REACHED 100%')}

function hitShake(big){camera.classList.remove(big?'breaking':'hit');void camera.offsetWidth;camera.classList.add(big?'breaking':'hit');setTimeout(()=>camera.classList.remove(big?'breaking':'hit'),big?700:290)}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>$('toast').classList.remove('show'),780)}
function fmt(s){s=Math.max(0,s);return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')}
function show(id,on){$(id).classList.toggle('show',!!on)}
function weightedCookie(){const pool=[...ordinary.map(n=>[n,5.79]),...rare.map(n=>[n,3.7])];let sum=pool.reduce((a,b)=>a+b[1],0),r=Math.random()*sum;for(const [n,w] of pool){r-=w;if(r<=0)return n}return'Triangle'}

function startGame(){
  initAudio();cookie=$('cookieSelect').value==='random'?weightedCookie():$('cookieSelect').value;maxCracks=$('hardcore').checked?3:5;cracks=0;fear=0;maxFear=0;timeLeft=120;crackHistory=[];pointer.down=false;outsideLatch=false;breathing=false;qte=null;
  resize();buildShape(cookie);drawStatic();tg.clearRect(0,0,W,H);cg.clearRect(0,0,W,H);updateProgress();updateCrackPips();updateFear();$('timer').textContent='2:00';$('cookieName').textContent=cookie.toUpperCase();$('revealName').textContent=cookie.toUpperCase();
  show('startScreen',false);show('endScreen',false);show('revealScreen',true);$('tin').classList.remove('open');state='reveal';needle.style.opacity='0';
  setTimeout(()=>$('tin').classList.add('open'),100);setTimeout(()=>{show('revealScreen',false);state='play';lastClock=performance.now();startTimers()},1050);
}
function startTimers(){stopTimers();timerId=setInterval(()=>{if(state!=='play')return;const now=performance.now(),dt=Math.min(.25,(now-lastClock)/1000);lastClock=now;timeLeft-=dt;$('timer').textContent=fmt(timeLeft);if(timeLeft<=0)lose('TIME RAN OUT')},50);fearId=setInterval(()=>{if(state==='play'&&fear>0&&!breathing){fear=Math.min(100,fear+.1);updateFear()}},100);scheduleNearby()}
function stopTimers(){clearInterval(timerId);clearInterval(fearId);clearTimeout(nearbyId);timerId=fearId=nearbyId=null}
function scheduleNearby(){clearTimeout(nearbyId);nearbyId=setTimeout(()=>{if(state==='play'&&$('nearby').checked){gunSound();fear=Math.min(100,fear+7+Math.random()*7);updateFear();hitShake(false);toast('A PLAYER WAS ELIMINATED')}scheduleNearby()},9000+Math.random()*14000)}

function win(){if(state!=='play')return;state='win';stopTimers();pointer.down=false;needle.style.opacity='0';tone(630,.08,.07);setTimeout(()=>tone(850,.11,.05),70);setTimeout(()=>result(true),420)}
function lose(reason){if(state!=='play')return;state='lose';stopTimers();pointer.down=false;needle.style.opacity='0';breathing=false;cancelAnimationFrame(qteFrame);qte=null;$('qte').classList.remove('show');
  const finalCr=makeCrack(cracks+3,Math.max(5,maxCracks+2),null);crackHistory.push(finalCr);redrawCracks();hitShake(true);crackSound(true);$('flash').classList.remove('go');void $('flash').offsetWidth;$('flash').classList.add('go');setTimeout(gunSound,90);setTimeout(()=>result(false,reason),700)}
function result(ok,reason=''){$('resultTitle').textContent=ok?'SUCCESS':'ELIMINATED';$('resultTitle').className=ok?'good':'bad';$('resultKicker').textContent=ok?'COOKIE COMPLETE':'ROUND FAILED';$('resultMessage').textContent=ok?`You carved ${cookie}.`:reason;$('statTime').textContent=fmt(120-timeLeft);$('statCracks').textContent=`${cracks}/${maxCracks}`;$('statFear').textContent=Math.round(maxFear)+'%';show('endScreen',true)}

function startBreathing(){if(state!=='play'||breathing||fear<=0||performance.now()<qteCooldown)return;breathing=true;startQTE()}
function stopBreathing(){breathing=false}
function startQTE(){if(!breathing||fear<=0||state!=='play')return;const keys=['Q','E','R','F','T'];qte={key:keys[Math.floor(Math.random()*5)],start:performance.now(),dur:1150+Math.random()*350};$('qteKey').textContent=qte.key;$('qte').classList.add('show');qteLoop()}
function qteLoop(){if(!qte)return;const t=(performance.now()-qte.start)/qte.dur,scale=1.65-1.02*t;$('qte').style.setProperty('--q',scale);if(t>=1){qteMiss();return}qteFrame=requestAnimationFrame(qteLoop)}
function qteHit(key){if(!qte)return;const scale=1.65-1.02*((performance.now()-qte.start)/qte.dur),good=key===qte.key&&scale>=.81&&scale<=1.16;if(good){fear=Math.max(0,fear-23);tone(450,.07,.045);toast('BREATHE')}else{fear=Math.min(100,fear+7);tone(120,.1,.04,'square');toast('MISSED QTE')}updateFear();finishQTE()}
function qteMiss(){fear=Math.min(100,fear+7);updateFear();toast('MISSED QTE');finishQTE()}
function finishQTE(){cancelAnimationFrame(qteFrame);qte=null;$('qte').classList.remove('show');qteCooldown=performance.now()+360;if(breathing&&fear>0)setTimeout(()=>{if(breathing&&fear>0&&!qte)startQTE()},390)}
addEventListener('keydown',e=>{if(state!=='play')return;if(e.code==='Space'){e.preventDefault();startBreathing()}else if(qte)qteHit(e.key.toUpperCase())});
addEventListener('keyup',e=>{if(e.code==='Space')stopBreathing()});
$('breatheBtn').addEventListener('pointerdown',e=>{e.preventDefault();startBreathing()});$('breatheBtn').addEventListener('pointerup',stopBreathing);$('breatheBtn').addEventListener('pointercancel',stopBreathing);$('qte').addEventListener('pointerdown',()=>qte&&qteHit(qte.key));

function initAudio(){if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();audio.resume?.()}
function tone(freq,d=.06,vol=.03,type='sine'){if(!audio)return;const o=audio.createOscillator(),a=audio.createGain();o.type=type;o.frequency.value=freq;a.gain.setValueAtTime(vol,audio.currentTime);a.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+d);o.connect(a).connect(audio.destination);o.start();o.stop(audio.currentTime+d)}
function scrape(){const n=performance.now();if(n-lastScrape<55)return;lastScrape=n;tone(920+Math.random()*420,.026,.012,'sawtooth')}
function crackSound(big){tone(big?70:105,big?.19:.12,big?.13:.055,'square');setTimeout(()=>tone(big?43:75,.12,big?.07:.025,'sawtooth'),20)}
function gunSound(){tone(58,.15,.19,'square');setTimeout(()=>tone(33,.28,.085,'sawtooth'),25)}

$('playBtn').onclick=startGame;$('againBtn').onclick=startGame;$('menuBtn').onclick=()=>{stopTimers();state='menu';needle.style.opacity='0';show('endScreen',false);show('startScreen',true)};
resize();buildShape('Triangle');drawStatic();updateCrackPips();
})();