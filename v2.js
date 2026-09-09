(()=>{'use strict';
const A='assets/';
const skinMap={
 apex:{src:A+'key-skin.svg',f:'grayscale(1) brightness(.48) sepia(.25) hue-rotate(145deg) saturate(2.4)'},
 carbon:{src:A+'key-skin.svg',f:'grayscale(1) brightness(.34) contrast(1.35) sepia(.3) hue-rotate(155deg) saturate(3)'},
 arcline:{src:A+'void-skin.svg',f:'hue-rotate(318deg) saturate(1.25) brightness(.92)'},
 whiteout:{src:A+'candy-skin.svg',f:'grayscale(1) brightness(1.5) contrast(.82) sepia(.12) hue-rotate(155deg) saturate(2)'},
 nightglass:{src:A+'void-skin.svg',f:'brightness(.62) contrast(1.35) saturate(1.45) hue-rotate(12deg)'},
 keyframe:{src:A+'key-skin.svg',f:'none'},eventide:{src:A+'void-skin.svg',f:'none'},
 marker50:{src:A+'candy-skin.svg',f:'none'},leveler:{src:A+'key-skin.svg',f:'hue-rotate(48deg) saturate(.95) brightness(.95)'}
};
const names={'MARKER // 50':'CANDYCOIL','KEYFRAME':'KEYCORE'};
const finishFilters={'MATTE':'saturate(.92) contrast(1.02)','CHROME':'grayscale(.35) brightness(1.2) contrast(1.2)','CARBON WEAVE':'brightness(.62) contrast(1.35) saturate(.7)','PEARL':'brightness(1.28) saturate(.7)','HOLOGRAPHIC':'saturate(1.7) hue-rotate(20deg) contrast(1.05)','VOID COAT':'brightness(.68) saturate(1.45) hue-rotate(22deg) contrast(1.25)'};
const css=`
.case-icon .crate{display:none!important}.case-icon img.v2case{display:block;width:118px;height:88px;object-fit:contain;filter:drop-shadow(0 12px 13px #0009);transition:.2s}.case-card[data-case=finish] .v2case{filter:hue-rotate(54deg) saturate(1.15) drop-shadow(0 12px 13px #0009)}.case-card[data-case=charm] .v2case{filter:hue-rotate(300deg) saturate(1.35) drop-shadow(0 12px 13px #0009)}.case-card:hover .v2case,.case-card.active .v2case{transform:translateY(-2px) scale(1.045)}
.v2asset{display:block;width:100%;height:auto;object-fit:contain;filter:var(--v2f,none);filter-origin:center;user-select:none;-webkit-user-drag:none}.weapon-art .v2asset{max-height:360px}.weapon-wrap.big .v2asset{max-height:445px}.card-art .v2asset{max-height:148px}.roll-art .v2asset{max-height:108px}.drop-art .v2asset{max-height:310px}.v2asset-shell{width:100%;height:100%;display:grid;place-items:center;filter:drop-shadow(0 22px 18px #0009)}
@media(max-width:700px){.case-icon img.v2case{width:90px}.weapon-art .v2asset{max-height:265px}.weapon-wrap.big .v2asset{max-height:295px}.card-art .v2asset{max-height:112px}.drop-art .v2asset{max-height:220px}}
`;
const st=document.createElement('style');st.textContent=css;document.head.append(st);
function img(id,extra=''){const m=skinMap[id]||skinMap.apex,filters=[m.f,extra].filter(x=>x&&x!=='none').join(' ')||'none';return `<div class="v2asset-shell"><img class="v2asset" src="${m.src}" style="--v2f:${filters}" draggable="false" alt="sniper skin"></div>`}
function rename(root=document){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){for(const [a,b] of Object.entries(names))if(n.nodeValue.includes(a))n.nodeValue=n.nodeValue.replaceAll(a,b)}}
function idFromName(t=''){t=t.trim().toUpperCase();const m={'APEX-50':'apex','CARBON ZERO':'carbon','ARCLINE':'arcline','WHITEOUT':'whiteout','NIGHTGLASS':'nightglass','KEYFRAME':'keyframe','KEYCORE':'keyframe','EVENTIDE':'eventide','MARKER // 50':'marker50','CANDYCOIL':'marker50','LEVELER':'leveler'};return m[t]||null}
function casePass(){document.querySelectorAll('.case-card').forEach(c=>{const el=c.querySelector('.case-icon');if(el&&!el.querySelector('.v2case'))el.innerHTML=`<img class="v2case" src="${A}case-skin.svg" alt="case">`})}
function cardPass(){document.querySelectorAll('.item-card').forEach(c=>{const art=c.querySelector('.card-art');if(!art||art.querySelector('.v2asset'))return;const type=c.dataset.type,id=c.dataset.id;if(type==='skin'&&skinMap[id])art.innerHTML=img(id);else if(type==='finish'){const nm=c.querySelector('.card-copy b')?.textContent.trim().toUpperCase()||'MATTE';art.innerHTML=img('apex',finishFilters[nm]||'')}})}
function mainPass(){const nm=(document.querySelector('#miniSkin')?.textContent||'APEX-50').trim().toUpperCase(),id=idFromName(nm)||'apex';const fin=(document.querySelector('#miniFinish')?.textContent||'MATTE').trim().toUpperCase(),ff=finishFilters[fin]||'';for(const sel of ['#weaponArt','#loadoutWeaponArt']){const el=document.querySelector(sel);if(el&&!el.querySelector('.v2asset'))el.innerHTML=img(id,ff)}}
function rollPass(){document.querySelectorAll('.roll-card').forEach(c=>{const art=c.querySelector('.roll-art');if(!art||art.querySelector('.v2asset'))return;const nm=c.querySelector('b')?.textContent.trim().toUpperCase()||'',id=idFromName(nm);if(id)art.innerHTML=img(id);else if(finishFilters[nm])art.innerHTML=img('apex',finishFilters[nm])})}
function dropPass(){const art=document.querySelector('#dropArt');if(!art||art.querySelector('.v2asset'))return;const nm=(document.querySelector('#dropName')?.textContent||'').trim().toUpperCase(),id=idFromName(nm);if(id)art.innerHTML=img(id);else if(finishFilters[nm])art.innerHTML=img('apex',finishFilters[nm])}
let queued=false;function pass(){queued=false;rename();casePass();cardPass();mainPass();rollPass();dropPass()}
new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(pass)}}).observe(document.body,{subtree:true,childList:true,characterData:true});
pass();
})();