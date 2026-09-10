import crypto from 'node:crypto';

function safeEqual(a,b){
  const aa=Buffer.from(String(a||''));
  const bb=Buffer.from(String(b||''));
  if(aa.length!==bb.length)return false;
  return crypto.timingSafeEqual(aa,bb);
}

export default function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'Method not allowed'});
  const secret=process.env.ADMIN_CODE;
  if(!secret)return res.status(503).json({ok:false,error:'ADMIN_CODE is not configured'});
  const code=req.body?.code;
  if(typeof code!=='string'||code.length>200||!safeEqual(code,secret))return res.status(401).json({ok:false,error:'Invalid admin code'});
  return res.status(200).json({ok:true});
}
