window.ROLL_DATA=(()=>{
const RS=['Common','Uncommon','Rare','Epic','Legendary','Mythic','Secret'];
const RC={Common:'#aeb7c4',Uncommon:'#62d894',Rare:'#58a9ff',Epic:'#aa72ff',Legendary:'#ffb34e',Mythic:'#ff5c9e',Secret:'#effdff'};
const SH={title:[45,25,14,8,4.5,2.5,1],color:[48,25,13,7,4,2,1],font:[40,25,15,9,6,3.5,1.5]};
const DUP=[50,80,125,225,400,750,1500],TITLE_INCOME_BONUS=[0,75,150,300,550,900,1500],COLOR_LUCK=[0,.08,.18,.35,.60,1.00,1.60],FONT_TIME_REDUCTION=[0,3000,6000,10000,15000,22000,30000];
const H=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const M=(type,name,rarity,x={})=>({id:type[0]+'_'+H(type+name).toString(36),type,name,rarity,weight:.75+(H(name)%50)/100,...x});
const titles=[];for(const r of RS)for(const n of (window.ROLL_TITLES?.[r]||[]))titles.push(M('title',n,r));
const c=window.ROLL_COLORS||{solid:[],effects:[]};
const colors=[...c.solid.map(x=>M('color',x.name,x.rarity,{solid:x.solid})),...c.effects.map(x=>M('color',x.name,x.rarity,{gradient:x.gradient,classes:x.classes}))];
const fonts=(window.ROLL_FONTS||[]).map(x=>M('font',x.name,x.rarity,{family:x.family,style:x.style}));
return{RS,RC,SH,DUP,TITLE_INCOME_BONUS,COLOR_LUCK,FONT_TIME_REDUCTION,titles,colors,fonts};
})();