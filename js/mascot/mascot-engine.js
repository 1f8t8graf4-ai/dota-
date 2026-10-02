/* Mascot Engine 1.0
 * Event-driven mascot system. Characters are registered data, not hard-coded UI.
 * Supports optional .glb via <model-viewer>; PNG fallback keeps the app working without 3D assets.
 */
(function(){
  'use strict';
  const chars = new Map();
  const events = new Map();
  let active = true;
  let current = 'bateman';
  let seq = 0;

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function registerCharacter(c){
    if(!c || !c.id) throw new Error('Mascot character needs an id');
    chars.set(c.id, Object.assign({animations:{}, model:null, image:null}, c));
    return c;
  }
  function registerEvent(name, cfg){ events.set(name, Object.assign({duration:1400, className:name}, cfg||{})); }
  function setCharacter(id){ if(chars.has(id)) current=id; }
  function isEnabled(){ return active && document.body && !document.body.classList.contains('nofx'); }
  function remove(){ const x=document.querySelector('.mascot-event'); if(x) x.remove(); }

  function art(c, cls){
    const model = c.model ? `<model-viewer class="mascot-model ${cls||''}" src="${esc(c.model)}" camera-controls="false" disable-zoom interaction-prompt="none" shadow-intensity="1" exposure="1.05" aria-label="${esc(c.name||c.id)}"></model-viewer>` : '';
    const img = c.image ? `<img class="mascot-fallback ${model?'has-model':''}" src="${esc(c.image)}" alt="" draggable="false">` : '';
    return `<div class="mascot-art">${model}${img}</div>`;
  }

  function ensureStage(kind){
    remove();
    const c=chars.get(current)||{};
    const token=++seq;
    const stage=document.createElement('div');
    stage.className='mascot-event mascot-'+esc(kind||'idle');
    stage.dataset.token=token;
    stage.innerHTML=`<div class="mascot-backdrop"></div><div class="mascot-vignette"></div><div class="mascot-particles"></div><div class="mascot-scene-target" aria-hidden="true"><div class="mascot-card"><span></span><b>${esc('ЭПИЗОД')}</b><i></i></div><div class="mascot-bag"></div><div class="mascot-axe"></div><div class="mascot-shards"><i></i><i></i><i></i><i></i><i></i></div></div><div class="mascot-actor">${art(c, kind)}</div><div class="mascot-prop" aria-hidden="true"></div>`;
    const mv=stage.querySelector('model-viewer');
    if(mv){
      mv.addEventListener('load',()=>stage.classList.add('mascot-model-ready'),{once:true});
      mv.addEventListener('error',()=>stage.classList.add('mascot-model-failed'),{once:true});
    }
    stage.addEventListener('click', remove, {once:true});
    document.body.appendChild(stage);
    return stage;
  }

  function play(name, payload){
    if(!isEnabled()) return Promise.resolve(false);
    const cfg=events.get(name)||{duration:1400,className:name};
    const c=chars.get(current)||{};
    const stage=ensureStage(cfg.className||name);
    stage.dataset.character=current;
    stage.dataset.animation=(c.animations&&c.animations[name])||name;
    const mv=stage.querySelector('model-viewer');
    if(mv){
      const animName=stage.dataset.animation;
      const startAnim=()=>{ try{ if(animName && mv.availableAnimations && mv.availableAnimations.includes(animName)){ mv.animationName=animName; mv.autoplay=true; mv.play(); } }catch(_e){} };
      if(mv.loaded) startAnim(); else mv.addEventListener('load',startAnim,{once:true});
    }
    if(payload){
      stage.dataset.payload=String(payload.title||payload.text||'');
      const label=document.createElement('div');
      label.className='mascot-label';
      label.innerHTML=`<b>${esc(payload.title||'')}</b>${payload.text?`<small>${esc(payload.text)}</small>`:''}`;
      stage.appendChild(label);
    }
    const duration=Number(cfg.duration)||1400;
    const token=stage.dataset.token;
    return new Promise(resolve=>setTimeout(()=>{ if(stage.dataset.token==token) stage.remove(); resolve(true); },duration));
  }


  function mountPersistent(){
    if(document.getElementById('mascot-dock')) return;
    const c=chars.get(current)||{};
    const dock=document.createElement('div');
    dock.id='mascot-dock';
    dock.innerHTML=`<div class="mascot-dock-art"><model-viewer class="mascot-dock-model" src="${esc(c.model||'')}" camera-controls="false" disable-zoom interaction-prompt="none" shadow-intensity="1" exposure="1.05"></model-viewer><img class="mascot-dock-fallback" src="${esc(c.image||'')}" alt="" draggable="false"></div>`;
    document.body.appendChild(dock);
    const mv=dock.querySelector('model-viewer'), img=dock.querySelector('.mascot-dock-fallback');
    if(mv){
      mv.addEventListener('error',()=>{dock.classList.add('mascot-dock-failed');},{once:true});
      mv.addEventListener('load',()=>{dock.classList.add('mascot-dock-ready');},{once:true});
    }
    dock.addEventListener('click',()=>play('idle'));
  }

  registerCharacter({
    id:'bateman',
    name:'Patrick',
    model:'img/bateman.glb',
    image:'img/bateman.png',
    animations:{
      idle:'idle', sceneOpen:'scene_open', sceneComplete:'scene_complete', episodeComplete:'episode_complete',
      learned:'learned', reward:'reward', transition:'transition', special:'special'
    }
  });
  // Future characters can be added without changing the engine:
  // MASCOT.registerCharacter({id:'tony', model:'img/tony.glb', image:'img/tony.png', animations:{...}})

  registerEvent('idle',{duration:900});
  registerEvent('sceneOpen',{duration:1350});
  registerEvent('sceneComplete',{duration:2200});
  registerEvent('episodeComplete',{duration:2300});
  registerEvent('episodeBag',{duration:3600});
  registerEvent('episodeBurn',{duration:3000});
  registerEvent('learned',{duration:1450});
  registerEvent('reward',{duration:1550});
  registerEvent('transition',{duration:1250});
  registerEvent('special',{duration:2400});
  registerEvent('correct',{duration:950});
  registerEvent('wrong',{duration:850});
  registerEvent('streak',{duration:1100});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mountPersistent,{once:true}); else mountPersistent();

  window.MASCOT={
    registerCharacter, mountPersistent, registerEvent, setCharacter, play, remove,
    enable(){active=true}, disable(){active=false;remove()}, isEnabled,
    characters:chars, events
  };
})();
