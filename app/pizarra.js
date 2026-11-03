/* JP Fútbol · Campograma de cada ejercicio.
   x.f = tipo de campo (libre, medio, area, completo) y x.els = dibujo. Los ejercicios sin dibujo propio reciben uno según su concepto (pzAuto). */
const PZ_C={own:'#FE7654',riv:'#2E5BD6',gk:'#F4C430',p1:'#286A47',p2:'#245F40',ln:'rgba(255,255,255,.82)'};
const PZ_MAT={
 c:'<path d="M0 -2.2L2 1.6H-2Z" fill="#FFA51F" stroke="#fff" stroke-width=".3"/>',
 ch:'<ellipse rx="1.5" ry=".75" fill="#FFB020" stroke="#fff" stroke-width=".25"/><ellipse rx=".5" ry=".25" fill="rgba(0,0,0,.25)"/>',
 pk:'<ellipse cy="2" rx="1" ry=".4" fill="rgba(0,0,0,.25)"/><rect x="-.35" y="-3.4" width=".7" height="5.4" rx=".3" fill="#FFE14D" stroke="#7A5A00" stroke-width=".15"/><rect x="-.35" y="-1.6" width=".7" height=".9" fill="#E8412C"/>',
 b:'<circle r="1.35" fill="#fff" stroke="#123A32" stroke-width=".35"/><circle r=".5" fill="#123A32"/>',
 m:'<rect x="-.8" y="-3" width="1.6" height="6" fill="rgba(255,255,255,.18)" stroke="#fff" stroke-width=".6"/>',
 pg:'<rect x="-1.4" y="-5.5" width="2.8" height="11" fill="url(#pznet)" stroke="#fff" stroke-width=".8"/><line x1="1.4" y1="-5.5" x2="1.4" y2="5.5" stroke="#fff" stroke-width="1.1"/>',
 es:'<rect x="-6" y="-1.7" width="12" height="3.4" fill="none" stroke="#FFE14D" stroke-width=".35"/>'+[-4,-2,0,2,4].map(x=>`<line x1="${x}" y1="-1.7" x2="${x}" y2="1.7" stroke="#FFE14D" stroke-width=".35"/>`).join(''),
 va:'<path d="M-2.6 1.3V-1.2H2.6V1.3" fill="none" stroke="#fff" stroke-width=".55" stroke-linejoin="round"/><path d="M-2.6 -1.2H2.6" stroke="#E8412C" stroke-width=".7"/><path d="M-3.2 1.3H-2M2 1.3H3.2" stroke="#fff" stroke-width=".4"/>',
 ar:'<circle r="1.9" fill="none" stroke="#FE7654" stroke-width=".55"/>',
 mq:'<ellipse cy="2.4" rx="1.6" ry=".5" fill="rgba(0,0,0,.25)"/><rect x="-1.1" y="-1.6" width="2.2" height="4" rx=".9" fill="#2B3A38" stroke="#fff" stroke-width=".25"/><circle cy="-2.6" r=".95" fill="#2B3A38" stroke="#fff" stroke-width=".25"/>'};
function pzField(f){const L=`stroke="${PZ_C.ln}" stroke-width=".45" fill="none"`;let s=`<rect width="100" height="64" fill="${PZ_C.p1}"/>`;
  for(let i=0;i<10;i+=2)s+=`<rect x="${i*10}" width="10" height="64" fill="${PZ_C.p2}"/>`;
  if(f==='libre')return s+`<rect x="2" y="2" width="96" height="60" ${L} stroke-dasharray="1.2 1.2" opacity=".55"/>`;
  const k=60/68,n=v=>+v.toFixed(2),
   g=(z,x0)=>{const u=k*z,A=16.5*u,AW=40.32*u,C=5.5*u,CW=18.32*u,P=11*u,R=9.15*u,G=7.32*u,h=Math.sqrt(R*R-(A-P)*(A-P)),q=u;
    return `<rect x="${n(x0-A)}" y="${n(32-AW/2)}" width="${n(A)}" height="${n(AW)}" ${L}/><rect x="${n(x0-C)}" y="${n(32-CW/2)}" width="${n(C)}" height="${n(CW)}" ${L}/><path d="M${n(x0-A)} ${n(32-h)}A${n(R)} ${n(R)} 0 0 0 ${n(x0-A)} ${n(32+h)}" ${L}/><circle cx="${n(x0-P)}" cy="32" r="${n(.25*z+.35)}" fill="${PZ_C.ln}"/><rect x="${x0}" y="${n(32-G/2)}" width="${n(Math.max(1.4,1.2*u))}" height="${n(G)}" ${L}/><path d="M${n(x0-q)} 2A${n(q)} ${n(q)} 0 0 0 ${x0} ${n(2+q)}M${x0} ${n(62-q)}A${n(q)} ${n(q)} 0 0 0 ${n(x0-q)} 62" ${L}/>`;},
   mid=(z,cx,half)=>{const R=9.15*k*z;return half?`<path d="M${cx} ${n(32-R)}A${n(R)} ${n(R)} 0 0 1 ${cx} ${n(32+R)}" ${L}/>`:`<circle cx="${cx}" cy="32" r="${n(R)}" ${L}/><circle cx="${cx}" cy="32" r=".6" fill="${PZ_C.ln}"/>`;};
  if(f==='area')return s+`<path d="M2 2H98V62H2" ${L}/>${g(1.6,98)}`;
  if(f==='medio')return s+`<rect x="2" y="2" width="96" height="60" ${L}/>${mid(1.25,2,true)}${g(1.25,98)}`;
  return s+`<rect x="2" y="2" width="96" height="60" ${L}/><path d="M50 2v60" ${L}/>${mid(1,50)}${g(1,98)}<g transform="matrix(-1 0 0 1 100 0)">${g(1,98)}</g>`;}
function pzArrow(a){if(a.s!=='cond')return `M${a.x1} ${a.y1}L${a.x2} ${a.y2}`;
  const dx=a.x2-a.x1,dy=a.y2-a.y1,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,st=Math.max(6,Math.round(len/1.2));let d=`M${a.x1} ${a.y1}`;
  for(let i=1;i<=st;i++){const t=i/st,am=(t>.88?0:1.1)*Math.sin(t*len/2.6*Math.PI);d+=`L${(a.x1+dx*t+nx*am).toFixed(2)} ${(a.y1+dy*t+ny*am).toFixed(2)}`;}return d;}
function pzEls(E,psz=1){let n=0,o='';
  E.forEach(e=>{if(e.t==='sh'){const r=`stroke="${e.c||'#fff'}" stroke-width="${e.w||.45}" fill="none" stroke-linecap="round" ${e.d?'stroke-dasharray="1.6 1.1"':''}`,x=Math.min(e.x1,e.x2),y=Math.min(e.y1,e.y2),w=Math.abs(e.x2-e.x1),h=Math.abs(e.y2-e.y1);
      o+=e.k==='line'?`<line x1="${e.x1}" y1="${e.y1}" x2="${e.x2}" y2="${e.y2}" ${r}/>`:e.k==='rect'?`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".4" ${r}/>`:`<ellipse cx="${x+w/2}" cy="${y+h/2}" rx="${w/2}" ry="${h/2}" ${r}/>`;}
    else if(e.t==='z'){const zc=e.zc||'#fff';o+=`<rect x="${Math.min(e.x1,e.x2)}" y="${Math.min(e.y1,e.y2)}" width="${Math.abs(e.x2-e.x1)}" height="${Math.abs(e.y2-e.y1)}" rx="1" fill="${e.c||zc}" fill-opacity="${e.c?1:zc==='#fff'?.13:.2}" stroke="${zc}" stroke-width=".4" stroke-dasharray="1.4 .9"/>`;}});
  E.forEach(e=>{if(e.t==='a'){const col=e.s==='mov'?'#FFE08A':e.s==='tiro'?'#FF3B30':'#fff';o+=`<path d="${pzArrow(e)}" stroke="${col}" stroke-width="${e.s==='tiro'?1.15:.65}" fill="none" ${e.s==='pase'?'stroke-dasharray="1.6 1.1"':''} marker-end="url(#pz${e.s})"/>`;}});
  E.forEach(e=>{if(e.t==='a'||e.t==='z'||e.t==='sh')return;const sc=(e.sc||1)*('prk'.includes(e.t)?psz:1);
    if(e.t==='p'||e.t==='r'||e.t==='k'){const s=e.t==='p'?String((++n,e.l||n)):'';
      o+=`<g transform="translate(${e.x} ${e.y}) scale(${sc})">${e.hl?'<circle r="3.75" fill="none" stroke="#E53935" stroke-width=".6"/>':''}<circle r="2.7" fill="${e.t==='p'?PZ_C.own:e.t==='r'?PZ_C.riv:PZ_C.gk}" stroke="#fff" stroke-width=".55"/>${s?`<text y="${s.length>2?.7:.9}" text-anchor="middle" font-size="${s.length>2?1.55:s.length>1?2:2.6}" font-weight="700" fill="#fff">${esc(s)}</text>`:''}</g>`;}
    else if(PZ_MAT[e.t])o+=`<g transform="translate(${e.x} ${e.y})${e.rot?` rotate(${e.rot})`:''}${sc!==1?` scale(${sc})`:''}">${PZ_MAT[e.t]}</g>`;});
  return o;}
const PZ_DEFS=['pase','cond','mov','tiro'].map(s=>`<marker id="pz${s}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="${s==='tiro'?3.2:4}" markerHeight="${s==='tiro'?3.2:4}" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${s==='mov'?'#FFE08A':s==='tiro'?'#FF3B30':'#fff'}"/></marker>`).join('')+'<pattern id="pznet" width="1" height="1" patternUnits="userSpaceOnUse"><path d="M0 0L1 1M1 0L0 1" stroke="rgba(255,255,255,.55)" stroke-width=".12"/></pattern>';
/* Ningún campograma de la biblioteca se repite: si dos salen iguales, el segundo se voltea o se recoloca un poco */
const pzSig=d=>d.f+'|'+d.els.map(e=>[e.t,e.s||e.k||'',Math.round((e.x??e.x1)/4),Math.round((e.y??e.y1)/4),Math.round((e.x2||0)/4),Math.round((e.y2||0)/4)].join(',')).sort().join(';');
function pzVariant(d,v){const fx=(v&2)&&(d.f==='libre'||d.f==='completo'),fy=v&1,sh=v>3?v:0,r=k=>+k.toFixed(1),cl=(k,m)=>Math.max(3,Math.min(m-3,k));
  return {...d,els:d.els.map((e,i)=>{const o={...e};['x','x1','x2'].forEach(k=>{if(o[k]!==undefined){if(fx)o[k]=100-o[k];if(sh)o[k]=r(cl(o[k]+Math.sin(i*2.1+v)*4,100));}});['y','y1','y2'].forEach(k=>{if(o[k]!==undefined){if(fy)o[k]=64-o[k];if(sh)o[k]=r(cl(o[k]+Math.cos(i*1.7+v)*4,64));}});return o;})};}
let pzDone=null;
function pzPrep(){pzDone={};const seen=new Set();LIB.forEach(x=>{const b=x.els&&x.els.length?x:((window.JPDRAW||{})[x.n.toLowerCase()]||pzAuto(x));let d=b,v=0;while(seen.has(pzSig(d))&&v<40)d=pzVariant(b,++v);seen.add(pzSig(d));pzDone[x.n]=d;});}
function pzDraw(x){if(x.own)return x.els&&x.els.length?x:pzAuto(x);if(!pzDone)pzPrep();return pzDone[x.n]||pzAuto(x);}
function pzBoard(x){const d=pzDraw(x);return `<svg class="pz" viewBox="0 0 100 64" role="img" aria-label="Campograma de ${esc(x.n)}"><defs>${PZ_DEFS}</defs>${pzField(d.f)}${pzEls(d.els,d.psz)}</svg>`;}
function pzSVG(x){return `<div class="ex-pz">${pzBoard(x)}<p class="ex-pzl"><i style="background:${PZ_C.own}"></i>Equipo<i style="background:${PZ_C.riv}"></i>Rival<i style="background:${PZ_C.gk}"></i>Portero<span>Pase: línea discontinua · Movimiento: amarillo · Conducción: ondulada · Tiro: rojo</span></p></div>`;}

/* Dibujo por concepto para los ejercicios sin campograma propio. Lee del nombre los jugadores (4x2, 6 contra 6, +1) y cambia un poco según el ejercicio. */
const pzMemo={};
function pzAuto(x){if(pzMemo[x.n])return pzMemo[x.n];
  let h=7;for(const c of x.n)h=(h*31+c.charCodeAt(0))>>>0;const rnd=()=>(h=(h*1103515245+12345)>>>0)/4294967296,jit=v=>v+(rnd()-.5)*3,r1=v=>+v.toFixed(1);
  const E=[],add=(t,px,py,o)=>{const e={t,x:r1(px),y:r1(py),...o};E.push(e);return e;},A=(s,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1,c=3.4;E.push({t:'a',s,x1:r1(a.x+dx/l*c),y1:r1(a.y+dy/l*c),x2:r1(b.x-dx/l*c),y2:r1(b.y-dy/l*c)});},
   box=(a,b,c,d,ds)=>E.push({t:'sh',k:'rect',d:!!ds,x1:a,y1:b,x2:c,y2:d}),line=(a,b,c,d)=>E.push({t:'sh',k:'line',d:true,x1:a,y1:b,x2:c,y2:d}),
   grid=(n,a,b,c,d,t)=>{const w=c-a,hh=d-b,cols=Math.max(1,Math.round(Math.sqrt(n*w/hh))),rows=Math.ceil(n/cols),L=[];for(let i=0;i<n;i++){const r=Math.floor(i/cols),k=i%cols,inRow=r===rows-1?n-cols*(rows-1):cols;L.push(add(t,jit(a+w*(k+.5)/inRow),jit(b+hh*(r+.5)/rows)));}return L;},
   ring=(n,a,b,c,d,t)=>{const per=2*((c-a)+(d-b)),L=[];for(let i=0;i<n;i++){let s=per*(i+.5)/n;const w=c-a,hh=d-b;let px,py;if(s<w){px=a+s;py=b;}else if(s<w+hh){px=c;py=b+s-w;}else if(s<2*w+hh){px=c-(s-w-hh);py=d;}else{px=a;py=d-(s-2*w-hh);}L.push(add(t,px,py));}return L;};
  const m=/(\d+)\s*(?:x|×|vs|v|c|contra)\s*(\d+)/i.exec(x.n),cap=(v,d)=>Math.min(11,Math.max(1,v||d)),na=d=>cap(m&&+m[1],d),nb=d=>cap(m&&+m[2],d),com=(/\+\s*(\d)/.exec(x.n)||[])[1]?+/\+\s*(\d)/.exec(x.n)[1]:/comod/i.test(x.n)?1:0;
  const t=x.t||({Calentamiento:'Activación',Técnica:'Técnica individual','Técnico-táctica':'Posesión',Táctica:'Ataque organizado',Decisión:'Decisión',Partido:'Partido',Físico:'Resistencia',Porteros:'Porteros'}[x.a]||'Activación');
  let f='libre';
  const pass=L=>{for(let i=0;i<Math.min(3,L.length-1);i++)A('pase',L[i],L[i+1]);};
  const goal=()=>add('k',93,32),ball=p=>add('b',p.x+2.6,p.y+1.6);
  const s=(x.n+' '+(x.d||'')).toLowerCase(),has=r=>r.test(s),hv=h,pick=n=>hv%n;
  switch(t){
   case 'Rondo':{box(24,8,76,56);const L=ring(na(4),24,8,76,56,'p'),R=grid(nb(2),40,24,60,40,'r');ball(L[0]);pass(L);R.forEach(r=>A('mov',r,{x:r.x+(r.x<50?-6:6),y:r.y-6}));for(let i=0;i<com;i++)add('p',50,32,{l:'C'});break;}
   case 'Posesión':{box(12,6,88,58);const L=grid(na(5),16,10,84,54,'p'),R=grid(nb(4),22,16,78,48,'r');ball(L[0]);pass(L);if(com)add('p',50,32,{l:'C'});A('mov',R[0],L[0]);break;}
   case 'Juego de posición':{box(10,6,90,58);line(36.6,6,36.6,58);line(63.3,6,63.3,58);line(10,23.3,90,23.3);line(10,40.6,90,40.6);const L=grid(na(6),14,10,86,54,'p'),R=grid(nb(4),30,18,70,46,'r');ball(L[0]);pass(L);if(com)add('p',50,32,{l:'C'});A('mov',R[0],L[1]||L[0]);break;}
   case 'Progresión':{f='medio';line(34,2,34,62);line(66,2,66,62);const a=grid(na(4),8,14,30,50,'p'),b=grid(Math.max(2,nb(3)),40,16,60,48,'r');goal();ball(a[0]);A('pase',a[0],{x:50,y:a[0].y});A('mov',a[a.length-1],{x:72,y:a[a.length-1].y});A('mov',b[0],a[0]);break;}
   case 'Ataque organizado':{f='medio';const a=grid(na(6),22,10,66,54,'p'),b=grid(nb(4),68,14,84,50,'r');goal();ball(a[0]);pass(a);A('tiro',a[a.length-1],{x:96,y:32});break;}
   case 'Finalización':{f='medio';
    if(has(/centro|banda|lateral|extremo/)){const w=add('p',66,8),b=add('p',54,28),c=add('p',56,44);goal();add('r',80,32);ball(w);A('cond',w,{x:86,y:8});E.push({t:'a',s:'pase',x1:86,y1:11,x2:82,y2:26});A('mov',b,{x:78,y:24});A('mov',c,{x:80,y:38});break;}
    if(has(/pared|combin|tercer|apoyo/)){const a=add('p',44,44),b=add('p',60,24),c=add('p',66,46);goal();ball(a);A('pase',a,b);A('pase',b,c);A('mov',a,{x:70,y:34});A('tiro',c,{x:97,y:33});break;}
    const a=grid(Math.min(na(3),4),52,14,68,50,'p');goal();ball(a[0]);A('cond',a[0],{x:78,y:a[0].y*.5+16});A('tiro',{x:78,y:a[0].y*.5+16},{x:97,y:32});if(a[1])A('pase',a[1],{x:80,y:a[1].y});add('c',74,12);add('c',74,52);break;}
   case 'Defensa':{f='medio';const b=grid(na(4),62,10,70,54,'p'),a=grid(nb(4),36,12,52,52,'r');goal();ball(a[0]);A('pase',a[0],a[1]||b[0]);b.forEach(p=>A('mov',p,{x:p.x-7,y:p.y}));break;}
   case 'Transición ofensiva':{f='completo';const a=grid(na(4),34,14,48,50,'p'),b=grid(nb(3),52,16,66,48,'r');add('k',7,32);add('k',93,32);ball(a[0]);A('pase',a[0],{x:62,y:a[0].y});a.slice(1,3).forEach(p=>A('mov',p,{x:74,y:p.y}));A('mov',b[0],{x:40,y:b[0].y});break;}
   case 'Transición defensiva':{f='completo';const a=grid(na(4),56,14,70,50,'p'),b=grid(nb(3),40,16,52,48,'r');add('k',7,32);add('k',93,32);ball(b[0]);A('cond',b[0],{x:26,y:b[0].y});a.forEach(p=>A('mov',p,{x:p.x-14,y:p.y}));break;}
   case 'Técnica individual':{
    if(has(/1x1|1 ?contra ?1|regate|finta|pasillo/)){box(14,16,86,48);const p=add('p',20,32);ball(p);add('r',52,32);add('m',84,32);A('cond',p,{x:44,y:24});A('cond',{x:44,y:24},{x:78,y:30});A('mov',{x:52,y:32},{x:50,y:26});break;}
    if(has(/conduc|slalom|zigzag|ritmo/)){[30,44,58,72].forEach((v,i)=>{add('c',v,i%2?26:38);add('c',v,i%2?46:58);});const p=add('p',12,20),q=add('p',12,50);ball(p);ball(q);let a=p;[[30,14],[44,24],[58,14],[72,24],[88,18]].forEach(([u,w])=>{const b={x:u,y:w};A('cond',a,b);a=b;});A('cond',q,{x:88,y:50});break;}
    if(has(/tri[aá]ngulo|rombo|rueda|cuadrado/)){const P=[add('p',50,10),add('p',78,50),add('p',22,50)];ball(P[0]);A('pase',P[0],P[1]);A('pase',P[1],P[2]);A('pase',P[2],P[0]);P.forEach(p=>add('c',p.x+(p.x>50?7:p.x<50?-7:0),p.y+(p.x===50?-5:6)));break;}
    if(has(/control|recep|giro|orientad/)){const a=add('p',18,32),b=add('p',54,32),c=add('p',86,16);add('r',61,32);add('c',66,44);add('c',66,20);ball(a);A('pase',a,b);A('cond',b,{x:68,y:20});A('pase',{x:68,y:20},c);break;}
    const L=[];for(let i=0;i<3;i++){const y=14+i*18,p=add('p',22,y),q=add('p',78,y);L.push(p);add('c',50,y);ball(p);A(i===1?'cond':'pase',p,{x:46,y});A('pase',q,{x:54,y:y+1});}break;}
   case 'Decisión':{const p=add('p',16,32);ball(p);A('cond',p,{x:44,y:32});add('r',54,32);[[82,14],[82,50]].forEach(([a,b])=>{add('c',a,b-5);add('c',a,b+5);A('mov',{x:44,y:32},{x:a,y:b});});add('p',12,14);add('p',12,50);break;}
   case 'Balón parado':{f='medio';const k=add('p',95,5);add('b',93.5,5.5);goal();const a=grid(na(4),66,18,80,46,'p');grid(nb(3),76,22,88,44,'r');E.push({t:'a',s:'pase',x1:92,y1:7,x2:82,y2:30});a.slice(0,2).forEach(p=>A('mov',p,{x:p.x+7,y:30}));k.l='S';break;}
   case 'Partido':{f='completo';add('k',7,32);add('k',93,32);const a=grid(na(5),14,10,46,54,'p'),b=grid(nb(5),54,10,86,54,'r');ball(a[0]);pass(a);if(com)add('p',50,32,{l:'C'});break;}
   case 'Coordinación':{
    if(pick(2)){[22,30,38,46,54,62].forEach((v,i)=>add(i%2?'ar':'va',v,32));add('c',76,20);add('c',76,44);const p=add('p',8,32);A('mov',p,{x:70,y:32});A('mov',{x:70,y:32},{x:76,y:16});break;}
    add('es',24,14);add('es',24,50);[44,52,60].forEach(v=>add('va',v,14));[44,52,60].forEach(v=>add('ar',v,50));add('c',78,14);add('c',78,50);const p=add('p',8,14),q=add('p',8,50);A('mov',p,{x:82,y:14});A('mov',q,{x:82,y:50});break;}
   case 'Velocidad':{
    if(has(/reacc|señal|estímulo|color/)){const p=add('p',50,32);[[22,12],[78,12],[22,52],[78,52]].forEach(([a,b])=>{add('c',a,b);A('mov',p,{x:a,y:b});});break;}
    if(has(/zigzag|cambio|agilidad|slalom|direcci/)){[24,40,56,72].forEach((v,i)=>add('c',v,i%2?46:18));const p=add('p',10,32);let a=p;[[24,18],[40,46],[56,18],[72,46],[90,32]].forEach(([u,w])=>{const b={x:u,y:w};A('mov',a,b);a=b;});break;}
    if(has(/persecuci|pareja|duelo|relevo/)||pick(3)===1){[20,44].forEach(y=>{const a=add('p',26,y),b=add('r',14,y);add('c',84,y-5);add('c',84,y+5);A('mov',a,{x:82,y});A('mov',b,{x:22,y:y+1});});break;}
    [14,32,50].forEach(y=>{const p=add('p',12,y);add('c',20,y-5);add('c',20,y+5);add('c',84,y-5);add('c',84,y+5);A('mov',p,{x:88,y});});break;}
   case 'Fuerza':{
    if(has(/pareja|empuj|duelo|carga/)){[[30,20],[70,20],[30,44],[70,44]].forEach(([a,b])=>{add('p',a-4,b);add('r',a+4,b);});break;}
    if(has(/salto|pliom|valla/)){[26,38,50,62,74].forEach(v=>add('va',v,32));const p=add('p',10,32);A('mov',p,{x:88,y:32});break;}
    [[24,18],[50,18],[76,18],[24,46],[50,46],[76,46]].forEach(([a,b],i)=>{add('c',a-8,b-7);add('p',a,b);add(i%2?'va':'ar',a,b+8);});break;}
   case 'Resistencia':{box(14,8,86,56,true);[[14,8],[86,8],[86,56],[14,56]].forEach(([a,b])=>add('c',a,b));const L=[add('p',30,8),add('p',86,26),add('p',66,56),add('p',14,36)];A('mov',L[0],{x:70,y:8});A('mov',L[1],{x:86,y:48});A('mov',L[2],{x:26,y:56});A('mov',L[3],{x:14,y:16});break;}
   case 'Prevención':{[[28,18],[72,18],[28,46],[72,46]].forEach(([a,b],i)=>{const p=add('p',a-8,b);add(i%2?'ar':'c',a+6,b);A('mov',p,{x:a+2,y:b});});break;}
   case 'Porteros':{f='area';
    if(has(/centro|a[eé]re|blocaje alto|c[oó]rner/)){const k=add('k',90,32),p=add('p',70,6);add('b',72.6,7.6);E.push({t:'a',s:'pase',x1:72,y1:9,x2:84,y2:27});add('r',80,38);A('mov',k,{x:85,y:29});break;}
    if(has(/1x1|1 ?contra ?1|salida|mano a mano/)){const k=add('k',91,32),p=add('p',40,32);add('b',42.6,33.6);A('cond',p,{x:68,y:32});A('mov',k,{x:76,y:32});break;}
    if(has(/pies|saque|distribu|pase|juego con/)){const k=add('k',90,32);add('b',87.4,33.6);const a=add('p',56,12),b=add('p',56,52);A('pase',k,a);A('pase',k,b);break;}
    add('k',91,32);const L=[add('p',52,14),add('p',46,32),add('p',52,50)];add('b',49,33.6);L.forEach(p=>A('tiro',p,{x:96,y:p.y*.3+22}));A('mov',{x:91,y:32},{x:91,y:22});break;}
   default:{box(22,10,78,54,true);[[22,10],[78,10],[78,54],[22,54]].forEach(([a,b])=>add('c',a,b));const L=grid(cap(0,6),28,16,72,48,'p');ball(L[0]);L.slice(0,4).forEach(p=>A('mov',p,{x:p.x+(rnd()-.5)*18,y:p.y+(rnd()-.5)*18}));}
  }
  if(f==='libre'&&pick(2))E.forEach(e=>['y','y1','y2'].forEach(k=>{if(e[k]!==undefined)e[k]=r1(64-e[k]);}));
  return pzMemo[x.n]={f,els:E};}
