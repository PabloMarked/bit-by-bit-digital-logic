const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'..'),E=require('../engine.js'),sandbox={window:{LogicEngine:E}};
for(const name of ['content','visuals','visual-fractions','visual-logic','visual-codes'])vm.runInNewContext(fs.readFileSync(path.join(dist,name+'.js'),'utf8'),sandbox);
const V=sandbox.window.VisualWalkthroughs,C=sandbox.window.COURSE_DATA;
test('all 30 lessons map to a usable visual, and every default/preset contains valid frames',()=>{
 assert.equal(V.list().length,18);
 for(const m of C.modules)for(const l of m.lessons){const ids=V.forLesson(m.id,l.id);assert.ok(ids.length,m.id+'/'+l.id);for(const id of ids){const spec=V.get(id),model=spec.build(V.defaults(spec));assert.ok(model.frames.length>=2&&model.frames.length<=16,id);}}
 for(const spec of V.list())for(const p of [{values:{}},...(spec.presets||[])]){const result=spec.build({...V.defaults(spec),...p.values});for(const f of result.frames){assert.ok(f.title&&f.explain&&f.html,spec.id);assert.doesNotMatch(f.html,/undefined|NaN|<script\b|onclick=/,spec.id);}}
});
test('every unsigned magnitude through 127 has the correct fixed-width two’s-complement visual result',()=>{
 const spec=V.get('complement-flip');for(let n=0;n<128;n++){const model=spec.build({value:String(n)}),result=((256-n)%256).toString(2).padStart(8,'0');assert.ok(model.frames.at(-1).html.includes(result),String(n));assert.ok(model.frames.at(-1).explain.includes(n===0?'00000000':'−'+n));assert.ok(model.frames.length<=12);}
 assert.throws(()=>spec.build({value:'128'}));assert.throws(()=>spec.build({value:'-1'}));assert.throws(()=>spec.build({value:'1.5'}));
});
test('visuals are categorized by their teaching topic and every module has an example',()=>{
 assert.equal(V.moduleFor('demorgan'),'boolean-algebra');assert.equal(V.moduleFor('binary-gray'),'gray-code');
 for(const m of C.modules)assert.ok(V.list().some(x=>V.moduleFor(x.id)===m.id),m.id);
});
test('all locally referenced visual scripts and styles exist, and load in dependency order',()=>{
 const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
 for(const name of ['visuals','visual-fractions','visual-logic','visual-codes'])for(const ext of ['js','css'])assert.ok(html.includes(name+'.'+ext)&&fs.existsSync(path.join(dist,name+'.'+ext)));
 assert.ok(html.indexOf('engine.js')<html.indexOf('visuals.js'));assert.ok(html.indexOf('visuals.js')<html.indexOf('visual-fractions.js'));assert.ok(html.indexOf('visual-codes.js')<html.indexOf('app.js'));
});
