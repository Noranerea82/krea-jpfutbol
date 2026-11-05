/* ===== JP Fútbol · Hoja de sesión =====
   Documento de cada sesión: datos, estructura, asistencia y ejercicios con su campograma.
   Se ve en el móvil y se imprime o se guarda en PDF en formato A4. */
const HS_COL=['#E2B746','#130F05','#2F7D57','#B98A1E','#4A4A44','#5AA9F0','#C9573B','#8A8578'];
function hsHTML(k,day){const g=GROUPS[k],m=metaFor(k,day),pl=playersOn(k,day),names=planFor(k,day)||EXS[g.prog]||[],fix=[15,20,20,25];
  const ex=names.map((n,i)=>{const x=allLib().find(l=>l.n===n);return {n,x,min:x?x.m:(fix[i]||15)};}),tot=ex.reduce((a,e)=>a+e.min,0);
  return `<article class="hs"><header class="hs-h"><img src="assets/logo-round.webp" alt="JP Fútbol"><div><b>JP Fútbol</b><span>Hoja de sesión</span></div><div class="hs-d"><span>${day}</span><b>${fmtLong(dateOf(day))}</b></div></header>
  <div class="hs-g"><div><i>Grupo</i>${esc(g.name)}</div><div><i>Horario</i>${m.s} a ${m.e}</div><div><i>${m.ms.length>1?'Místers':'Míster'}</i>${esc(m.ms.join(' y '))}</div><div><i>Programa</i>${esc(g.prog)}</div><div><i>Ejercicios</i>${ex.length} · ${tot} min</div><div><i>Convocados</i>${pl.length}</div></div>
  <h3 class="hs-s">Estructura de la sesión</h3>
  <div class="hs-bar">${ex.map((e,i)=>`<span style="flex:${e.min};background:${HS_COL[i%HS_COL.length]};color:${i%HS_COL.length===0?'#130F05':'#fff'}">${i+1} · ${e.min}′</span>`).join('')}</div>
  <h3 class="hs-s">Asistencia <em>(marca a mano en el campo)</em></h3>
  <div class="hs-pl">${pl.map(p=>`<span><b></b>${esc(p.name)}</span>`).join('')||'<p>Nadie convocado todavía.</p>'}</div>
  <h3 class="hs-s">Ejercicios</h3>
  ${ex.map((e,i)=>{const x=e.x;return `<section class="hs-e"><h4><i>${i+1}</i><span>${esc(e.n)}</span><em>${e.min} min${x&&x.j?` · ${esc(x.j)} jug.`:''}${x&&x.e?` · ${esc(x.e)}`:''}</em></h4>${x?`<div class="hs-c"><div>${pzBoard(x)}</div><div>${x.o?`<p><b>Objetivo.</b> ${esc(x.o)}</p>`:''}${x.g?`<p><b>Organización.</b> ${esc(x.g)}</p>`:''}${x.x||x.d?`<p><b>Desarrollo.</b> ${esc(x.x||x.d)}</p>`:''}${(x.k||[]).length?`<p><b>Puntos clave.</b> ${x.k.map(esc).join(' · ')}</p>`:''}</div></div>`:''}</section>`;}).join('')}
  <section class="hs-o"><h3 class="hs-s">Observaciones del míster</h3><div></div><div></div><div></div></section>
  <footer>JP Fútbol · ${esc(g.name)} · ${day} ${fmtLong(dateOf(day))}</footer></article>`;}
function hsOpen(k,day){let o=document.getElementById('hsOv');if(o)o.remove();
  document.body.insertAdjacentHTML('beforeend',`<div id="hsOv" role="dialog" aria-modal="true" aria-label="Hoja de sesión"><div class="hs-top"><button type="button" class="btn" data-hs="x">${I('x',16)}Cerrar</button><button type="button" class="btn oro" data-hs="p">${I('dl',16)}Imprimir o guardar PDF</button></div>${hsHTML(k,day)}</div>`);
  document.body.classList.add('hs-on');}
document.addEventListener('click',e=>{const b=e.target.closest('[data-hs]');if(!b)return;if(b.dataset.hs==='p'){window.print();return;}document.getElementById('hsOv').remove();document.body.classList.remove('hs-on');});
document.head.insertAdjacentHTML('beforeend',`<style>
body.hs-on{overflow:hidden}
#hsOv{position:fixed;inset:0;z-index:90;overflow-y:auto;background:#2B2A26;padding:0 12px 24px}
.hs-top{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;gap:8px;padding:calc(10px + var(--st,0px)) 0 10px;background:#2B2A26}
.hs{max-width:794px;margin:0 auto;padding:24px;background:#fff;color:#1B1A16;border-radius:6px;font:13px/1.42 Manrope,system-ui,sans-serif}
.hs-h{display:flex;align-items:center;gap:12px;padding-bottom:10px;border-bottom:3px solid #E2B746}.hs-h img{width:52px;height:52px;border-radius:50%}.hs-h>div:nth-child(2){flex:1;min-width:0}.hs-h b{display:block;font-family:Oswald,sans-serif;font-size:22px;line-height:1.1;text-transform:uppercase}.hs-h span{color:#6B675C}
.hs-d{flex:none;padding:6px 12px;border-radius:8px;background:#130F05;color:#fff;text-align:center}.hs-d span{display:block;color:#E2B746;font-size:11px;font-weight:700;text-transform:uppercase}.hs-d b{font-family:inherit;font-size:13px;text-transform:none}
.hs-g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:12px;border:1px solid #D8D3C4;border-radius:6px;overflow:hidden}.hs-g>div{padding:6px 9px;border-right:1px solid #D8D3C4;border-bottom:1px solid #D8D3C4;font-weight:600}.hs-g i{display:block;font-style:normal;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#6B675C}
.hs-s{margin:16px 0 7px;padding-bottom:3px;border-bottom:1px solid #D8D3C4;font:800 12px/1.3 Manrope,system-ui,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:#130F05}.hs-s em{font-style:normal;font-weight:500;text-transform:none;letter-spacing:0;color:#6B675C}
.hs-bar{display:flex;gap:2px;height:24px;border-radius:6px;overflow:hidden}.hs-bar span{display:grid;place-items:center;min-width:0;overflow:hidden;white-space:nowrap;font-size:11px;font-weight:700}
.hs-pl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 14px}.hs-pl span{display:flex;align-items:center;gap:7px}.hs-pl b{flex:none;width:14px;height:14px;border:1.5px solid #130F05;border-radius:3px}
.hs-e{margin-bottom:12px;break-inside:avoid;page-break-inside:avoid}.hs-e h4{display:flex;align-items:center;gap:8px;margin:0 0 6px;font-size:14px}.hs-e h4 i{flex:none;width:24px;height:24px;display:grid;place-items:center;border-radius:6px;background:#E2B746;color:#130F05;font-style:normal}.hs-e h4 span{flex:1;min-width:0}.hs-e h4 em{flex:none;font-style:normal;font-size:12px;font-weight:600;color:#6B675C}
.hs-c{display:grid;grid-template-columns:minmax(0,1fr);gap:8px}.hs-c p{margin:0 0 4px}.hs .pz{border-radius:6px}
.hs-o div{height:24px;border-bottom:1px solid #D8D3C4}
.hs footer{margin-top:14px;font-size:11px;text-align:center;color:#6B675C}
@media(min-width:601px){.hs-c{grid-template-columns:minmax(0,46%) minmax(0,1fr);gap:12px}.hs-pl{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media print{@page{size:A4;margin:11mm}html,body{background:#fff!important}body.hs-on{overflow:visible}body.hs-on>*:not(#hsOv){display:none!important}body.hs-on::before,body.hs-on::after{display:none!important}#hsOv{position:static;overflow:visible;padding:0;background:#fff}.hs-top{display:none}.hs{max-width:none;padding:0;border-radius:0;font-size:11.5px}.hs-c{grid-template-columns:minmax(0,46%) minmax(0,1fr);gap:12px}.hs-pl{grid-template-columns:repeat(3,minmax(0,1fr))}.hs *{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>`);
