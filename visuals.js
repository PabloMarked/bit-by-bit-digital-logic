(function(root){
'use strict';
const registry=new Map(),active=new Set();let serial=0;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mapping={
 'fractions-1/place-values':['place-value','multiply-fraction'],
 'fractions-1/decimal-to-base':['multiply-fraction','place-value'],
 'fractions-1/grouping':['grouping','place-value'],
 'fractions-1/repeating':['multiply-fraction','place-value'],
 'fractions-1/precision':['multiply-fraction','place-value'],
 'fractions-2/fraction-add-subtract':['binary-arithmetic','place-value'],
 'fractions-2/multiply-divide':['binary-multiplication','binary-arithmetic','place-value'],
 'fractions-2/fixed-point':['fixed-point','complement-flip'],
 'fractions-2/complements':['complement-flip','fixed-point'],
 'fractions-2/subtraction-overflow':['binary-arithmetic','complement-flip','fixed-point'],
 'logic-gates/gate-basics':['gate-signal','circuit-trace'],
 'logic-gates/gate-truth-tables':['gate-signal','circuit-trace'],
 'logic-gates/trace-circuits':['circuit-trace','gate-signal'],
 'logic-gates/useful-circuits':['half-adder','circuit-trace'],
 'logic-gates/universal-gates':['gate-signal','demorgan'],
 'binary-codes/code-meaning':['digit-encoding','binary-gray'],
 'binary-codes/bcd':['digit-encoding'],
 'binary-codes/aiken-excess':['digit-encoding'],
 'binary-codes/ascii':['digit-encoding'],
 'binary-codes/parity':['parity-check'],
 'boolean-algebra/boolean-laws':['boolean-absorption','demorgan'],
 'boolean-algebra/simplification':['boolean-absorption','demorgan'],
 'boolean-algebra/demorgan':['demorgan','boolean-absorption'],
 'boolean-algebra/canonical-forms':['kmap-group','boolean-absorption'],
 'boolean-algebra/karnaugh':['kmap-group'],
 'gray-code/gray-purpose':['gray-encoder','gray-reflection'],
 'gray-code/reflection':['gray-reflection','gray-encoder'],
 'gray-code/binary-to-gray':['binary-gray','gray-encoder'],
 'gray-code/gray-to-binary':['binary-gray','gray-reflection'],
 'gray-code/gray-circuits-applications':['binary-gray','gray-encoder']
};
const moduleDefault={'fractions-1':'place-value','fractions-2':'binary-arithmetic','logic-gates':'circuit-trace','binary-codes':'digit-encoding','boolean-algebra':'boolean-absorption','gray-code':'binary-gray'};
function register(spec){if(!spec?.id||typeof spec.build!=='function')throw new Error('Invalid visual walkthrough definition.');registry.set(spec.id,spec);}
function defaults(spec){return Object.fromEntries((spec.inputs||[]).map(x=>[x.key,String(x.value??'')]));}
function list(){const order=['fractions-1','fractions-2','logic-gates','binary-codes','boolean-algebra','gray-code'];return [...registry.values()].sort((a,b)=>order.indexOf(moduleFor(a.id))-order.indexOf(moduleFor(b.id)));}
function forLesson(moduleId,lessonId){return (mapping[moduleId+'/'+lessonId]||[moduleDefault[moduleId]]).filter(x=>registry.has(x));}
function moduleFor(id){if(['boolean-absorption','demorgan','kmap-group'].includes(id))return 'boolean-algebra';if(['binary-gray','gray-reflection','gray-encoder'].includes(id))return 'gray-code';for(const [key,ids] of Object.entries(mapping))if(ids.includes(id))return key.split('/')[0];return 'fractions-2';}
function disposeAll(){for(const dispose of [...active])dispose();}
function mount(host,id,initial={}){
 const spec=registry.get(id);if(!host||!spec)return ()=>{};
 const uid='visual-'+(++serial),values={...defaults(spec),...initial};let model=null,index=0,playing=false,handle=null,disposed=false,zoomDialog=null;
 const fields=(spec.inputs||[]).map(x=>{const inputId=uid+'-'+x.key,hint=x.hint?` aria-describedby="${inputId}-hint"`:'';return `<div class="vw-field"><label for="${inputId}">${esc(x.label)}</label>${x.type==='select'?`<select id="${inputId}" name="${esc(x.key)}"${hint}>${(x.options||[]).map(o=>{const v=typeof o==='string'?o:o.value,label=typeof o==='string'?o:o.label;return `<option value="${esc(v)}" ${String(v)===String(values[x.key])?'selected':''}>${esc(label)}</option>`;}).join('')}</select>`:`<input id="${inputId}" name="${esc(x.key)}" type="${x.type||'text'}" value="${esc(values[x.key])}" maxlength="${x.maxLength||128}"${x.min!==undefined?' min="'+x.min+'"':''}${x.max!==undefined?' max="'+x.max+'"':''} ${x.step!==undefined?'step="'+x.step+'"':''} spellcheck="false" autocomplete="off"${hint}>`}${x.hint?`<small id="${inputId}-hint">${esc(x.hint)}</small>`:''}</div>`;}).join('');
 host.innerHTML=`<section class="vw-player" aria-labelledby="${uid}-title"><div class="vw-player-head"><span class="vw-watch-icon" aria-hidden="true">▷</span><div><h2 id="${uid}-title">${esc(spec.title)}</h2><p>${esc(spec.lead)}</p></div></div><form class="vw-inputs" novalidate>${fields}${fields?'<button class="button small vw-update" type="submit">Update example</button>':''}</form>${spec.presets?.length?`<div class="vw-presets" role="group" aria-label="Example presets">${spec.presets.map((p,i)=>`<button class="sample" type="button" data-preset="${i}">${esc(p.label)}</button>`).join('')}</div>`:''}<div class="vw-error" role="alert"></div><div class="vw-step-heading"><strong class="vw-frame-title"></strong><span class="vw-step-counter"></span></div><div class="vw-stage" tabindex="0" role="region" aria-label="Visual demonstration. Use the controls below to advance."></div><div class="vw-narration" role="status" aria-live="polite" aria-atomic="true"></div><div class="vw-playbar"><button class="button secondary small" type="button" data-action="previous" aria-label="Back: previous visual step">‹ Back</button><button class="button small vw-play" type="button" data-action="play">▶ Play steps</button><button class="button secondary small" type="button" data-action="next" aria-label="Next visual step">Next ›</button><button class="vw-restart" type="button" data-action="restart" aria-label="Restart visual example">↺ Restart</button></div><div class="vw-scrub-row"><label for="${uid}-step" class="sr-only">Walkthrough step</label><input class="vw-scrub" id="${uid}-step" type="range" min="0" max="1" value="0"><label class="vw-speed-label" for="${uid}-speed">Pace<select id="${uid}-speed" class="vw-speed"><option value="4000">Slow</option><option value="2500" selected>Normal</option><option value="1400">Fast</option></select></label></div><div class="vw-takeaway"></div><p class="vw-source-note">Independent visual teaching example. Step through it with the controls or use Left/Right while the diagram is focused.</p></section>`;
 const player=host.querySelector('.vw-player');const $=s=>player.querySelector(s),$$=s=>[...player.querySelectorAll(s)];
 $('.vw-stage').id=uid+'-scene';$('.vw-stage').setAttribute('aria-label','Visual demonstration. Use the playback controls to advance.');$('.vw-stage').before($('.vw-playbar'));$$('[data-action]').forEach(b=>b.setAttribute('aria-controls',uid+'-scene'));
 const tools=document.createElement('div');tools.className='vw-tools';const settings=document.createElement('details');settings.className='vw-settings';settings.innerHTML='<summary>Change example</summary>';settings.append($('.vw-inputs'));if($('.vw-presets'))settings.append($('.vw-presets'));if((spec.inputs||[]).length||spec.presets?.length)tools.append(settings);const enlarge=document.createElement('button');enlarge.className='vw-enlarge';enlarge.type='button';enlarge.textContent='⛶ Enlarge diagram';enlarge.setAttribute('aria-haspopup','dialog');tools.append(enlarge);$('.vw-step-heading').before(tools);
 function enlargeView(){if(zoomDialog?.open){zoomDialog.close();return;}zoomDialog=document.createElement('dialog');zoomDialog.className='vw-zoom-dialog';zoomDialog.setAttribute('aria-label','Enlarged visual example: '+spec.title);document.body.append(zoomDialog);zoomDialog.append(player);enlarge.textContent='✕ Close enlarged view';zoomDialog.addEventListener('close',()=>{host.append(player);zoomDialog.remove();zoomDialog=null;enlarge.textContent='⛶ Enlarge diagram';if(!disposed)enlarge.focus();},{once:true});zoomDialog.showModal();enlarge.focus();}enlarge.onclick=enlargeView;
 function pause(){playing=false;clearInterval(handle);handle=null;const button=$('[data-action="play"]');if(button){button.textContent=index===model?.frames.length-1?'▶ Play again':'▶ Play steps';button.setAttribute('aria-pressed','false');}}
 function render(){if(disposed||!model)return;const f=model.frames[index];$('.vw-frame-title').textContent=f.title||'Follow this step';$('.vw-step-counter').textContent='Step '+(index+1)+' / '+model.frames.length;$('.vw-stage').innerHTML=f.html;$('.vw-narration').textContent=f.explain||'';$('.vw-scrub').value=index;$('.vw-scrub').max=model.frames.length-1;$('.vw-scrub').setAttribute('aria-valuetext','Step '+(index+1)+': '+(f.title||''));$('[data-action="previous"]').disabled=index===0;$('[data-action="next"]').disabled=index===model.frames.length-1;$('.vw-takeaway').innerHTML=model.takeaway?'<strong>Keep this idea</strong><span>'+esc(model.takeaway)+'</span>':'';if(index===model.frames.length-1)pause();}
 function go(next){pause();index=Math.max(0,Math.min(model.frames.length-1,next));render();}
 function play(){if(!model)return;if(playing){pause();return;}if(index===model.frames.length-1){index=0;render();}playing=true;$('[data-action="play"]').textContent='Ⅱ Pause';$('[data-action="play"]').setAttribute('aria-pressed','true');handle=setInterval(()=>{if(disposed||!model){pause();return;}if(index<model.frames.length-1){index++;render();}else pause();},+$('.vw-speed').value);}
 function build(){pause();try{const next=spec.build({...values});if(!next?.frames?.length||next.frames.some(f=>typeof f.html!=='string'))throw new Error('This example could not be built. Try another preset.');model=next;index=0;$('.vw-error').innerHTML='';$('.vw-playbar').hidden=false;$('.vw-scrub-row').hidden=false;$('.vw-takeaway').hidden=false;render();}catch(error){model=null;$('.vw-error').innerHTML='<div class="error">'+esc(error.message)+'</div>';$('.vw-stage').innerHTML='<div class="vw-empty-visual" aria-hidden="true">0 ↔ 1</div>';$('.vw-frame-title').textContent='Adjust the input';$('.vw-step-counter').textContent='';$('.vw-narration').textContent='Use a preset, or correct the input and select Update example.';$('.vw-playbar').hidden=true;$('.vw-scrub-row').hidden=true;$('.vw-takeaway').hidden=true;}}
 if($('.vw-inputs'))$('.vw-inputs').onsubmit=e=>{e.preventDefault();for(const input of $$('[name]'))values[input.name]=input.value;build();};
 $$('.vw-inputs select').forEach(select=>select.onchange=()=>{for(const input of $$('[name]'))values[input.name]=input.value;build();});
 $$('[data-preset]').forEach(btn=>btn.onclick=()=>{Object.assign(values,spec.presets[+btn.dataset.preset].values);for(const input of $$('[name]'))input.value=values[input.name];build();});
 $('[data-action="previous"]').onclick=()=>model&&go(index-1);$('[data-action="next"]').onclick=()=>model&&go(index+1);$('[data-action="restart"]').onclick=()=>model&&go(0);$('[data-action="play"]').onclick=play;$('.vw-scrub').oninput=e=>model&&go(+e.target.value);$('.vw-speed').onchange=()=>{if(playing){pause();play();}};
 function keydown(e){if(!model||e.target!==$('.vw-stage')||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight'){e.preventDefault();go(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(index-1);}if(e.key===' '){e.preventDefault();play();}}
 function visibility(){if(document.hidden)pause();}player.addEventListener('keydown',keydown);document.addEventListener('visibilitychange',visibility);
 function dispose(){if(disposed)return;pause();disposed=true;zoomDialog?.close();player.removeEventListener('keydown',keydown);document.removeEventListener('visibilitychange',visibility);active.delete(dispose);}
 active.add(dispose);build();return dispose;
}
root.VisualWalkthroughs={register,list,get:id=>registry.get(id),defaults,mount,disposeAll,forLesson,moduleFor,moduleDefault,escape:esc};

register({id:'complement-flip',title:'Flip the bits. Add one. See the negative.',lead:'Watch eight-bit two’s-complement negation, including the carry that moves through the rightmost bits.',inputs:[{key:'value',label:'Positive integer',type:'number',value:'13',min:0,max:127,hint:'0–127, represented in a signed eight-bit word.'}],presets:[{label:'Negate 13',values:{value:'13'}},{label:'Carry through zeros: 8',values:{value:'8'}},{label:'Zero wraps back to zero',values:{value:'0'}}],build(v){
 if(!/^\d+$/.test(v.value)||+v.value>127)throw new Error('Enter a whole number from 0 to 127.');const n=+v.value,bits=n.toString(2).padStart(8,'0'),flipped=[...bits].map(b=>b==='1'?'0':'1').join(''),neg=((256-n)%256).toString(2).padStart(8,'0');
 const row=(label,str,activeAt=-1)=>`<div class="vc-word-row"><strong>${esc(label)}</strong><div class="vc-word-bits">${[...str].map((b,i)=>`<span class="vw-bit ${i===activeAt?'vw-active':''}">${b}</span>`).join('')}</div></div>`;
 const frame=(stage,idx=-1)=>'<div class="vc-complement">'+row('Original +'+n,bits)+(stage>=1?row('Flip every bit',flipped):'<div class="vw-placeholder">First, represent the positive value.</div>')+(stage>=2?'<div class="vw-equation">+ 00000001</div>':'')+(stage>=3?row('Result',idx<0?neg:[...neg].map((b,i)=>i<idx?'·':b).join(''),idx):'')+'</div>';
 const frames=[{title:'Declare the width and signed interpretation',explain:n+' is '+bits+' in an eight-bit signed word. Fix the width before complementing.',html:frame(0)},{title:'Invert all eight bits',explain:'Every 0 becomes 1, and every 1 becomes 0. This produces the one’s complement '+flipped+'.',html:frame(1)},{title:'Add one stored unit',explain:'Add 00000001 to the inverted word, starting at the rightmost column.',html:frame(2)}];
 let carry=1;for(let i=7;i>=0&&carry;i--){const digit=+flipped[i],total=digit+carry;carry=total>=2?1:0;frames.push({title:'Add at bit weight '+2**(7-i),explain:digit+' + 1 = '+total+(carry?'. Write 0 and carry 1 to the next column.':'. Write 1. The carry stops here.'),html:frame(3,i)});}
 frames.push({title:'Check the signed value',explain:n===0?'In eight bits, the carry out is discarded and the result is 00000000. Two’s complement has one zero.':parseInt(neg,2)+' − 256 = −'+n+'. The result represents the negative of the original value.',html:frame(3)+'<div class="vw-equation">'+neg+' = '+(n===0?'0':'−'+n)+' <small>(signed 8-bit)</small></div>'});return {frames,takeaway:'Two’s-complement negation = invert a fixed-width word, add 1, and keep that width. The bits need a declared signed interpretation.'};
}});
})(window);
