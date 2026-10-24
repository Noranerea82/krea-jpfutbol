/* JP Fútbol · service worker básico (instalable, red primero) y notificaciones */
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||/\.php(\?|$)/.test(new URL(e.request.url).pathname))return;e.respondWith(fetch(e.request).then(r=>{if(r.ok&&new URL(e.request.url).origin===location.origin){const c=r.clone();caches.open('jp-v1').then(x=>x.put(e.request,c));}return r;}).catch(()=>caches.match(e.request)));});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(L=>{const w=L.find(c=>'focus' in c);return w?w.focus():self.clients.openWindow('./');}));});
