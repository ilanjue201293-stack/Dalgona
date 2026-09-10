(()=>{'use strict';
const files=['data-titles.js','data-colors.js','data-fonts.js','data-v4.js','engine-v4.js'];
const load=src=>new Promise((ok,fail)=>{const s=document.createElement('script');s.src=src+'?v=6';s.onload=ok;s.onerror=()=>fail(new Error('Failed to load '+src));document.head.appendChild(s)});
(async()=>{try{for(const f of files)await load(f)}catch(e){console.error(e);const t=document.getElementById('toast');if(t){t.textContent='Game files failed to load. Refresh the page.';t.classList.add('show')}}})();
})();