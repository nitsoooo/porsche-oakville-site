
(()=>{
 const COUNT=96,FPS=12,stage=document.getElementById('stage'),image=document.getElementById('spinImage'),play=document.getElementById('play'),reverse=document.getElementById('reverse'),range=document.getElementById('timeline'),counter=document.getElementById('counter'),hint=document.getElementById('hint');
 const file=i=>'viewer/frames/frame_'+String(((i%COUNT)+COUNT)%COUNT+1).padStart(3,'0')+'.webp';
 let frame=0,drag=false,lastX=0,pixels=0,playing=false,direction=1,raf=0,then=0;
 function show(i){frame=((Math.round(i)%COUNT)+COUNT)%COUNT;const requested=frame;load(frame).then(()=>{if(frame===requested)image.src=file(requested);}).catch(()=>{});range.value=String(frame);range.setAttribute('aria-valuetext',Math.round(frame/COUNT*360)+' degrees');counter.textContent=String(Math.round(frame/COUNT*360)).padStart(3,'0')+'° / 360°';}
 function stop(){playing=false;play.textContent='Auto rotate';play.setAttribute('aria-pressed','false');cancelAnimationFrame(raf);}
 function tick(t){if(!playing)return;if(t-then>=1000/FPS){show(frame+direction);then=t;}raf=requestAnimationFrame(tick);}
 function toggle(){if(playing){stop();return;}playing=true;play.textContent='Pause';play.setAttribute('aria-pressed','true');then=performance.now();raf=requestAnimationFrame(tick);}
 function movement(dx){pixels+=dx;const steps=Math.trunc(pixels/8);if(steps){show(frame-steps);pixels-=steps*8;}}
 stage.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType==='mouse')return;stop();drag=true;lastX=e.clientX;pixels=0;stage.classList.add('dragging');stage.setPointerCapture(e.pointerId);hint.hidden=true;});
 stage.addEventListener('pointermove',e=>{if(!drag)return;movement(e.clientX-lastX);lastX=e.clientX;});
 const end=()=>{drag=false;stage.classList.remove('dragging');};stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);stage.addEventListener('lostpointercapture',end);
 stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();stop();show(frame+(e.key==='ArrowRight'?1:-1));}});
 play.addEventListener('click',toggle);reverse.addEventListener('click',()=>{direction*=-1;if(!playing)show(frame+direction);});range.addEventListener('input',()=>{stop();show(Number(range.value));});
 // Load only near the section; cap concurrent requests and retain decoded frames.
 const cache=new Map(),loading=document.getElementById('spinLoading');
 function load(i){if(cache.has(i))return cache.get(i);const promise=new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>{cache.delete(i);loading.textContent='Some views could not load. Drag or scrub to retry.';reject(new Error('Frame unavailable'));};im.src=file(i);});cache.set(i,promise);return promise;}
 let started=false,next=0;
 async function worker(){while(next<COUNT){const i=next++;try{await load(i);}catch{}}}
 function preload(){if(started)return;started=true;Promise.all(Array.from({length:4},worker)).then(()=>{if(cache.size===COUNT)loading.textContent='';});}
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)preload();else stop();}},{rootMargin:'200px'});observer.observe(stage);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});

})();
